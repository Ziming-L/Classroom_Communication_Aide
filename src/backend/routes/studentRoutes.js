import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { getDefaultCommands } from "../utils/defaultCommands.js";
import { authMiddleware } from "../services/authService.js";

const router = express.Router();

router.post("/join-class", authMiddleware, async (req, res) => {
    const cleanup = {
        commandIds: [],
        translationIds: [],
        studentCommandsInserted: false,
        studentClassLinked: false,
    }

    let student_id = null;
    let class_id = null;

    try {
        const authUser = req.user;
        if (!authUser || !authUser.user_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        if (authUser.role !== "student") {
            return res.status(403).json({ error: "Only allow students to join class" });
        }

        const { class_code } = req.body;
        if (!class_code || typeof class_code !== "string" || class_code.length > 20) {
            return res.status(400).json({ error: "Invalid class code" });
        }

        const { data: student, error: studentErr } = await supabase
            .from("Students")
            .select("student_id, language_code, user_id")
            .eq("user_id", authUser.user_id)
            .maybeSingle();
        
        if (studentErr) {
            throw studentErr;
        }
        if (!student) {
            return res.status(404).json({ error: "Student profile not found" });
        }

        student_id = student.student_id;
        const studentLang = student.language_code.toLowerCase() || "es";

        const { data: classData, error: classErr } = await supabase
            .from("Class_Information")
            .select("class_id")
            .eq("class_code", class_code)
            .maybeSingle();
        
        if (classErr) {
            throw classErr;
        }
        if (!classData) {
            return res.status(404).json({ error: "Can not find class code" });
        }
        class_id = classData.class_id;

        const { data: exist, error: existErr } = await supabase
            .from("Student_Classes")
            .select("*")
            .eq("student_id", student_id)
            .eq("class_id", class_id);

        if (existErr) {
            throw existErr;
        }
        if (exist.length > 0) {
            return res.status(200).json({ message: "Student already joined this class, returned" });
        }

        const { data: existStudentCmd, error: existStudentCmdErr } = await supabase
            .from("Student_Commands")
            .select("*")
            .eq("student_id", student_id)
        
        if (existStudentCmdErr) {
            throw existStudentCmdErr;
        }
        // only insert if there was no exisiting commands, which act first time student join class
        if ((existStudentCmd || []).length === 0) {
            const { data: teacherClass, error: teacherErr} = await supabase
                .from("Teacher_Classes")
                .select(`teacher_id, Teachers(language_code)`)
                .eq("class_id", classData.class_id)
                .single();
        
            if (teacherErr) {
                throw teacherErr;
            }
            if (!teacherClass) {
                return res.status(404).json({ error: "Teacher profile not found" });
            }
            
            const teacherLang = teacherClass?.Teachers?.language_code?.toLowerCase() || "en";

            const defaultCommands = getDefaultCommands(studentLang, teacherLang);

            const { data: insertedCommands, error: insertErr } = await supabase
                .from("Commands")
                .insert(
                    defaultCommands.map(((cmd) => ({
                        command_text: cmd.userLangText,
                        command_color: cmd.color,
                        command_image: cmd.img, 
                        priority_number: cmd.priority,
                    })))
                )
                .select("command_id");
            
            if (insertErr) {
                throw insertErr;
            }
            // track the inserted commands for later cleanup if error occurs
            if (insertedCommands && insertedCommands.length > 0) {
                cleanup.commandIds = insertedCommands.map(c => c.command_id);
            }

            const { data: insertedTranslations, error: translationErr } = await supabase
                .from("Command_Translation")
                .insert(
                    insertedCommands.map((cmd, i) => ({
                        command_id: cmd.command_id, 
                        translated_text: defaultCommands[i].targetLangText,
                        target_language_code: teacherLang,
                    }))
                )
                .select("translation_id");

            if (translationErr) {
                throw translationErr;
            }
            // track translation ids for cleanup
            if (insertedTranslations && insertedTranslations.length > 0) {
                cleanup.translationIds = insertedTranslations.map(t => t.translation_id);
            }

            const { error: studentCommandErr } = await supabase
                .from("Student_Commands")
                .insert(
                    insertedCommands.map((cmd) => ({
                        student_id, 
                        command_id: cmd.command_id,
                    }))
                );

            if (studentCommandErr) {
                throw studentCommandErr;
            }
            // track if inserted commands to the student commands table
            cleanup.studentCommandsInserted = true;
        }

        // insert student to the class identified by the class code
        const { error: classLinkErr } = await supabase
            .from("Student_Classes")
            .insert([{ student_id, class_id }]);

        if (classLinkErr) {
            throw classLinkErr;
        }
        cleanup.studentClassLinked = true;

        return res.status(200).json({
            success: true,
            message: "Student successfully joined the class with default commands added",
        });
    } catch (err) {
        console.error("Error occurred:", err.message);
        try {
            // delete the Student_Class entry made
            if (cleanup.studentClassLinked) {
                await supabase
                    .from("Student_Classes")
                    .delete()
                    .eq("student_id", student_id)
                    .eq("class_id", class_id);
            }
            // delete the Student_Commands entry that was created a few lines before
            if (cleanup.studentCommandsInserted && cleanup.commandIds.length > 0) {
                await supabase
                    .from("Student_Commands")
                    .delete()
                    .eq("student_id", student_id)
                    .in("command_id", cleanup.commandIds);
            }
            // delete the Command_Translation entry that got inputed
            if (cleanup.translationIds.length > 0) {
                await supabase
                    .from("Command_Translation")
                    .delete()
                    .in("translation_id", cleanup.translationIds);
            }
            // delete the commands that was created
            if (cleanup.commandIds.length > 0) {
                await supabase
                    .from("Commands")
                    .delete()
                    .in("command_id", cleanup.commandIds);
            }
            console.log("Cleanup completed");
        } catch (cleanupErr) {
            console.error("Cleanup failed:", cleanupErr.message);
        }

        return res.status(500).json({
            error: "Internal server error",
            detail: err.message,
        });
    }

})


export default router;
