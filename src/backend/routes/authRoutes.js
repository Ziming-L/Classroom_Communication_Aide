import express from 'express';
import { loginUser, registerUser } from '../services/authService.js';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, username, password, role, auth_uid, provider } = req.body;
    const result = await registerUser({email, password, username, role, auth_uid, provider});
    
    if (!result.success) {
        return res.status(400).json({ 
            success: false, 
            message: result.error 
        });
    }

    return res.status(201).json({ 
        success: true,
        message: 'User registered', 
        user: result.user 
    });
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