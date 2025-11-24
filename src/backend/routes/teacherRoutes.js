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
        
        return res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.get("/current-requests/:class_id", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_id } = req.params;

        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: "Missing class_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("get_pending_requests_for_teacher", {
            p_user_id: user_id,
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

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.get("/all-students-info/:class_id", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_id } = req.params;

        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: "Missing class_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("get_class_students_and_requests", {
            p_user_id: user_id,
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

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

router.post("/create-class", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_name, class_start, class_end } = req.body;

        if (!class_name || !class_start || !class_end) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: class_name, class_start, and class_end"
            });
        }

        const { data, error } = await supabase.rpc("create_class_for_teacher", {
            p_user_id: user_id,
            p_class_name: class_name,
            p_class_start: class_start,
            p_class_end: class_end
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

router.get("/all-classes", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;

        const { data, error } = await supabase.rpc("get_teacher_classes", {
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


router.delete("/delete-class", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_id, class_code } = req.body;

        if (!class_id || !class_code) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: class_id and class_code"
            });
        }

        const { data, error } = await supabase.rpc("delete_class_for_teacher", {
            p_user_id: user_id,
            p_class_id: class_id,
            p_class_code: class_code
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

router.post("/increment-star/:student_id", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { student_id } = req.params;

        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: "Missing student_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("increment_student_star", {
            p_user_id: user_id,
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


router.post("/add-student", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { username, class_id } = req.body;

        if (!username || !class_id) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: username and class_id"
            });
        }

        const { data, error } = await supabase.rpc("add_student_to_class_by_username", {
            p_user_id: user_id,
            p_username: username,
            p_class_id: class_id
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

router.post("/approve-request-button", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { request_id } = req.body;

        if (!request_id) {
            return res.status(400).json({
                success: false,
                message: "Missing request_id"
            });
        }

        const { data, error } = await supabase.rpc("approve_request_button", {
            p_user_id: user_id,
            p_request_id: request_id
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

router.post("/approve-request-message", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { request_id, content, sent_at } = req.body;

        if (!request_id || !content || !sent_at) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: request_id, content, and sent_at"
            });
        }

        const { data, error } = await supabase.rpc("approve_request_message", {
            p_user_id: user_id,
            p_request_id: request_id,
            p_content: content,
            p_sent_at: sent_at
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


router.get("/request-history-class/:class_id", verifyToken, authRequireTeacher, async (req, res) => {
    try {
        const { user_id } = req.user;
        const { class_id } = req.params;

        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: "Missing class_id in parameter call"
            });
        }

        const { data, error } = await supabase.rpc("get_request_history_for_class", {
            p_user_id: user_id,
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

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
});

export default router;