import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { getDefaultCommands } from "../utils/defaultCommands.js";
import { verifyToken, authRequireStudent } from "../services/authService.js";

const router = express.Router();

router.post("/join-class", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_code } = req.body;

        if (!class_code || typeof class_code !== "string" || class_code.length > 20) {
            return res.status(400).json({ error: "Invalid class code" });
        }

        const { data: studentLang, error: studentLangErr } = await supabase.rpc(
            "get_student_language",
            { p_user_id: user_id }
        );
        if (studentLangErr) {
            return res.status(400).json({ error: studentLangErr.message });
        }
        if (!studentLang) {
            return res.status(400).json({ error: "Student language not found" });
        }

        const { data: teacherLang, error: teacherLangErr } = await supabase.rpc(
            "get_teacher_language",
            { p_class_code: class_code }
        );
        if (teacherLangErr) {
            return res.status(400).json({ error: teacherLangErr.message });
        }
        if (!teacherLang) {
            return res.status(400).json({ error: "Teacher language not found" });
        }

        const defaultCommands = getDefaultCommands(studentLang, teacherLang);

        const { data, error } = await supabase.rpc("join_class", {
            p_user_id: user_id,
            p_class_code: class_code, 
            p_default_commands: defaultCommands,
            p_teacher_lang: teacherLang
        });
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            error: "Internal server error",
            detail: err.message,
        });
    }
});


router.post("/add-command", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_text, translated_text, target_language_code, command_color, command_image, priority_number } = req.body;

        // validate input
        if (!command_text || typeof command_text !== "string") {
            return res.status(400).json({ error: "Invalid command_text"});
        }
        if (!translated_text || typeof translated_text !== "string") {
            return res.status(400).json({ error: "Invalid translated_text"});
        }
        if (!target_language_code || typeof target_language_code !== "string" || target_language_code.length > 3) {
            return res.status(400).json({ error: "Invalid target_language_code"});
        }
        if (!command_color || typeof command_color !== "string") {
            return res.status(400).json({ error: "Invalid command_color"});
        }
        if (!command_image || typeof command_image !== "string") {
            return res.status(400).json({ error: "Invalid command_image"});
        }
        if (!priority_number || typeof priority_number !== "number") {
            return res.status(400).json({ error: "Invalid priority_number"});
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
                error: "Internal server error: add_command rpc failed",
                detail: error.message
            });
        }
        if (!data.success) {
            return res.status(400).json({
                success: false,
                error: data.message
            });
        }

        return res.status(201).json({
            success: true,
            message: data.message
        });
    } catch (err) {        
        return res.status(500).json({
            error: "Server error: Failed to add the command",
            detail: err.message
        });
    }
});

router.put("/update-command/:command_id", verifyToken, authRequireStudent, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { command_id } = req.params;

        if (!command_id) {
            return res.status(400).json({ error: "Missing command_id in parameter call"});
        }

        const { command_text, translated_text, target_language_code, command_color, command_image, priority_number } = req.body;

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
            return res.status(500).json({ success: false, error: error.message });
        }
        if (!data.success) {
            return res.status(400).json({ success: false, error: data.message });
        }

        return res.status(200).json({ success: true, message: data.message });
    } catch (err) {
        return res.status(500).json({ success: false, error: "Internal Server error", detail: err.message });
    }
})

export default router;
