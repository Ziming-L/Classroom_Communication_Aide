import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { verifyToken, authRequireTeacher } from "../services/authService.js";
import { updateProfileHelper } from "../utils/updateProfile.js";

const router = express.Router();

router.put("/update-profile", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { teacher_name, teacher_icon, teacher_icon_bg_color } = req.body;

        const result = await updateProfileHelper(user_id, {
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

export default router;