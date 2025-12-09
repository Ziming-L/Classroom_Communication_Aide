import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { getDefaultCommands } from "../utils/defaultCommands.js";
import { verifyToken, authRequireStudent } from "../services/authService.js";
import { createProfile, updateProfile} from "../services/profileService.js";

const router = express.Router();

router.post("/join-class", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_code } = req.body;

        if (!class_code || typeof class_code !== "string" || class_code.length != 10) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid class code" 
            });
        }

        const { data: studentLang, error: studentLangErr } = await supabase.rpc(
            "get_student_language",
            { p_user_id: user_id }
        );
        if (studentLangErr) {
            return res.status(400).json({ 
                success: false, 
                message: studentLangErr.message 
            });
        }
        if (!studentLang) {
            return res.status(400).json({ 
                success: false, 
                message: "Student language not found" 
            });
        }

        const { data: teacherLang, error: teacherLangErr } = await supabase.rpc(
            "get_teacher_language",
            { p_class_code: class_code }
        );
        if (teacherLangErr) {
            return res.status(400).json({ 
                success: false, 
                message: teacherLangErr.message 
            });
        }
        if (!teacherLang) {
            return res.status(400).json({ 
                success: false, 
                message: "Teacher language not found" 
            });
        }

        const defaultCommands = getDefaultCommands(studentLang, teacherLang);

        const { data, error } = await supabase.rpc("join_class", {
            p_user_id: user_id,
            p_class_code: class_code, 
            p_default_commands: defaultCommands,
            p_teacher_lang: teacherLang
        });
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/add-command", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_text, translated_text, target_language_code, command_color, command_image, priority_number } = req.body;

        // validate input
        if (!command_text || typeof command_text !== "string") {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid command_text"
            });
        }

        if (!translated_text || typeof translated_text !== "string") {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid translated_text"
            });
        }

        if (!target_language_code || typeof target_language_code !== "string" || (target_language_code.length != 2 && target_language_code.length != 3)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid target_language_code"
            });
        }

        const hexRegex = /^#[0-9A-Fa-f]{6}$/;
        if (!command_color || typeof command_color !== "string" || !hexRegex.test(command_color)) {
            return res.status(400).json({
                success: false,
                message: "Invalid color format. Use hex like #ade8e6"
            });
        }

        const commandPathRegex = /^\.\.\/images\/commands_icon\/[a-zA-Z0-9_-]+\.png$/;
        if (!command_image || typeof command_image !== "string" || !commandPathRegex.test(command_image)) {
            return res.status(400).json({
                success: false,
                message: "Command image path must match format: ../images/commands_icon/<name>.png"
            });
        }

        if (!priority_number || typeof priority_number !== "number" || priority_number === 1) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid priority_number"
            });
        }

        const { data, error } = await supabase.rpc("add_command", {
            p_user_id: user_id,
            p_command_text: command_text,
            p_translated_text: translated_text,
            p_target_language_code: target_language_code,
            p_command_color: command_color,
            p_command_image: command_image,
            p_priority_number: priority_number
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(201).json(data);
    } catch (err) {        
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.put("/update-command/:command_id", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_id } = req.params;

        if (!command_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing command_id in parameter call"
            });
        }

        const { command_text, translated_text, target_language_code, command_color, command_image, priority_number } = req.body;
        
        if (target_language_code !== undefined  && (target_language_code.length != 2 && target_language_code.length != 3)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid target_language_code"
            });
        }

        if (command_color !== undefined) {
            const hexRegex = /^#[0-9A-Fa-f]{6}$/;
            if (!hexRegex.test(command_color)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid color format. Use hex like #ade8e6"
                });
            }
        }

        if (command_image !== undefined) {
            const commandPathRegex = /^\.\.\/images\/commands_icon\/[a-zA-Z0-9_-]+\.png$/;
            if (!commandPathRegex.test(command_image)) {
                return res.status(400).json({
                    success: false,
                    message: "Command image path must match format: ../images/commands_icon/<name>.png"
                });
            }
        }

        if (priority_number !== undefined) {
            if (typeof priority_number !== "number" || priority_number === 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid priority_number"
                });
            }
        }

        const { data, error } = await supabase.rpc("modify_command", {
            p_user_id: user_id,
            p_command_id: Number(command_id),
            p_command_text: command_text ?? null,
            p_command_color: command_color ?? null,
            p_command_image: command_image ?? null,
            p_priority_number: typeof priority_number === "number" ? priority_number : null,
            p_translated_text: translated_text ?? null,
            p_target_language_code: target_language_code ?? null
        });
        if (error) {
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error: " + err.message 
        });
    }
});

router.delete("/command/:command_id", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_id } = req.params;

        if (!command_id) {
            return res.status(400).json({
                success: false,
                message: "Missing command_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("delete_command", {
            p_user_id: user_id,
            p_command_id: Number(command_id)
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.put("/update-profile", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { student_name, student_icon, student_icon_bg_color } = req.body;
        
        // check handled inside function
        const result = await updateProfile(user_id, {
            name: student_name, 
            icon: student_icon,
            icon_bg_color: student_icon_bg_color
        });
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            success: false, 
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/create-profile", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { name, language_code, icon, icon_bg_color } = req.body;

        if (!name || !language_code) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: name and language_code"
            });
        }

        // check handled inside the function
        const result = await createProfile(user_id, "student", {
            name,
            language_code,
            icon,
            icon_bg_color
        });
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/create-request", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_id, class_id } = req.body;

        if (!command_id || !class_id) {
            return res.status(400).json({
                success: false,
                message: "Missing command_id or class_id"
            });
        } 

        const { data, error } = await supabase.rpc("create_request", {
            p_user_id: user_id,
            p_command_id: Number(command_id),
            p_class_id: Number(class_id)
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.get("/student-info", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;

        const { data, error } = await supabase.rpc("get_student_home_info", {
            p_user_id: user_id,
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/add-command-translation", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_id, translated_text, target_language_code } = req.body;

        if (!command_id || typeof command_id !== "number") {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid command_id"
            });
        }
        if (!translated_text || typeof translated_text !== "string") {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid translated_text"
            });
        }
        if (!target_language_code || typeof target_language_code !== "string" || (target_language_code.length !== 2 && target_language_code.length !== 3)) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid target_language_code"
            });
        }

        const { data, error } = await supabase.rpc("add_command_translation", {
            p_user_id: user_id,
            p_command_id: command_id,
            p_translated_text: translated_text,
            p_target_language_code: target_language_code
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/check-class-status", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_code } = req.body;

        if (!class_code) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing class_code"
            });
        }

        const { data, error } = await supabase.rpc("check_student_class_status", {
            p_user_id: user_id,
            p_class_code: class_code
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                status: 'inactive'
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message,
            status: 'inactive'
        });
    }
});

// call this by teacher or student to set student's `try_yourself` to `value` (true | false)
router.post("/set-try-yourself", verifyToken, async (req, res) => {
    try {
        const { user_id, role } = req.user;
        const { student_id, value, class_code } = req.body;

        if (!student_id || value === undefined || !class_code) {
            return res.status(400).json({ 
                success: false, 
                message: "REQUIRED: student_id, value, and class_code"
            });
        }

        if (class_code.length != 10) {
            return res.status(400).json({ 
                success: false, 
                message: "class_code need to be 10 characters long"
            });
        }

        const { data: classData, error: classErr } = await supabase
            .from("Class_Information")
            .select("class_id")
            .eq("class_code", class_code)
            .single();
        
        if (classErr || !classData) {
            return res.status(403).json({
                success: false,
                message: "Class not found"
            });
        }

        const { class_id } = classData;

        // create arguments for rpc
        const args = {
            p_student_id: student_id,
            p_value: value,
            p_class_id: class_id
        }
        if (role === "student") {
            args.p_caller_student_user_id = user_id;
        } else if (role === "teacher") {
            args.p_caller_teacher_user_id = user_id;
        }

        const { data, error } = await supabase.rpc("set_student_try_yourself", args);
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message,
        });
    }
});

router.get("/try-yourself/:student_id", verifyToken, async (req, res) => {
    try {
        const { student_id } = req.params;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: "Missing student_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("get_try_yourself_status", {
            p_student_id: student_id,
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.get("/star-number", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;

        const { data, error } = await supabase.rpc("get_student_star_number", {
            p_user_id: user_id,
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.get("/message/:message_id", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { message_id } = req.params;

        if (!message_id) {
            return res.status(400).json({
                success: false,
                message: "Missing message_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("get_message_student", {
            p_user_id: user_id,
            p_message_id: message_id
        });
        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
        if (!data.success) {
            return res.status(400).json(data);
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});


export default router;
