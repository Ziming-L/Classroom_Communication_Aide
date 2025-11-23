import express from 'express';
import { loginUser } from '../services/authService.js';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

// call this one first to create an account
router.post("/register-local", async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });
        if (error) {
            return res.status(400).json({ 
                success: false,
                message: error.message 
            });
        }

        return res.status(201).json({ 
            success: true,
            auth_uid: data.user.id 
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error: " + err.message
        });
    }
});

// call this after having register an account; this will insert auth_uid, username, and role to DB
router.post('/create-user', async (req, res) => {
    const { auth_uid, username, role } = req.body;
    
    try {
        if (!auth_uid || !username || !role) {
            return res.status(400).json({
                success: false,
                message: "REQUIRED: auth_uid, username, and role"
            });
        } 

        const { data, error } = await supabase.rpc("insert_user", {
            p_auth_uid: auth_uid,
            p_role: role,
            p_username: username
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

        return res.status(201).json({ 
            success: true,
            message: 'User created', 
            user: data.user 
        });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error: " + err.message
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    
    if (!result.success) {
        return res.status(401).json({ 
            success: false, 
            message: result.error 
        });
    }

    return res.status(200).json({ 
        success: true,
        message: 'Login successful', 
        token: result.token, 
        user: result.user 
    });
});

router.get("/schools", async (req, res) => {
    try {
        const { data, error } = await supabase.rpc("get_all_school_names");
        if (error) {
            return res.status(500).json({
                success: false, 
                message: error.message
            });
        }

        return res.status(200).json({
            success: true,
            schools: data
        });
    } catch (err) {
        return res.status(500).json({
            success: false, 
            message: "Internal server error: " + err.message
        });
    }
});

export default router