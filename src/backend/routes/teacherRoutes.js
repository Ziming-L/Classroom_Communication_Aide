import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { verifyToken, authRequireTeacher } from "../services/authService.js";
import { createProfile, updateProfile } from "../services/profileService.js";

const router = express.Router();

router.put("/update-profile", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { teacher_name, teacher_icon, teacher_icon_bg_color } = req.body;

        const result = await updateProfile(user_id, {
            name: teacher_name, 
            icon: teacher_icon,
            icon_bg_color: teacher_icon_bg_color
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

router.post("/create-profile", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { name, language_code, icon, icon_bg_color, school_name } = req.body;

        if (!name || !language_code || !school_name) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: name, language_code, and school_name."
            });
        }

        const result = await createProfile(user_id, "teacher", {
            name,
            language_code,
            icon,
            icon_bg_color,
            school_name
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

export default router;