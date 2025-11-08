import express from "express";
import { supabase } from "./supabaseClient.js";
import { getDefaultCommands } from "../utils/defaultCommands.js";
import { authMiddleware } from "../services/authService.js";

const router = express.Router();

router.post("/join-class", authMiddleware, async (req, res) => {
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

        const student_id = student.student_id;
        const studentLang = student.language_code.toLowerCase();

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
        const class_id = classData.class_id;

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
            .select("command_id, command_text");
        
        if (insertErr) {
            throw insertErr;
        }

        const { error: translationErr } = await supabase
            .from("Command_Translation")
            .insert(
                insertedCommands.map((cmd, i) => ({
                    command_id: cmd.command_id, 
                    translated_text: defaultCommands[i].targetLangText,
                    target_language_code: teacherLang,
                }))
            );

        if (translationErr) {
            throw translationErr;
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

        // insert student to the class identified by the class code
        const { error: classLinkErr } = await supabase
            .from("Student_Classes")
            .insert([{ student_id, class_id }]);

        if (classLinkErr) {
            throw classLinkErr;
        }

        return res.status(200).json({
            success: true,
            message: "Student successfully joined the class with default commands added",
        });
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            detail: err.message,
        });
    }

})


export default router;
