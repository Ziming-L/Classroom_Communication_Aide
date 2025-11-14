import { supabase } from "./supabaseClient.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
    return jwt.sign(
        { user_id: user.user_id, role: user.role, username: user.username }, 
        JWT_SECRET,
        { expiresIn: '7d'}
    )
}

/**
 * Register a new user to database
 * @param {Object} props
 * @param {string} props.username 
 * @param {string} props.password 
 * @param {'teacher' | 'student'} props.role
 * @param {string} props.provider 
 * @param {int} props.providerId 
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function registerUser({username, password, role, provider, providerId}) {
    try {
        // no password for student
        if (role === 'student' && !password) {
            const { data, error} = await supabase
                .from('Login_Information')
                .insert([{username, password: null, role, auth_provider: provider || 'local', provider_id: providerId || null}])
                .select()
                .single();
            if (error) throw error;
            return { success: true, user: data}
        }

        if (provider && providerId) {
            const { data: existing, error: findError} = await supabase
                .from('Login_Information')
                .select('*')
                .eq('provider_id', providerId)
                .eq('auth_provider', provider)
                .maybeSingle();

            if (findError) throw findError;

            if (existing) {
                return {success: true, user: existing}
            }

            const { data, error } = await supabase
                .from('Login_Information')
                .insert([{ username, password: null, role, auth_provider: provider, provider_id: providerId }])
                .select()
                .single();
            if (error) throw error;
            return { success: true, user: data}
        }
        // local register for the teacher
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('Login_Information')
            .insert([{ username, password: hashedPassword, role, auth_provider: 'local', provider_id: null }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, user: data };
    } catch (err) {
        console.error('Unexpected error in registerUser:', err);
        return { success: false, error: err.message};
    }
}

/**
 * Check for user login
 * @param {Object} props
 * @param {string} props.username 
 * @param {string} props.password 
 * @param {string} props.provider 
 * @param {int} props.providerId 
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function loginUser({ username, password, provider, providerId }) {
  try {
    // OAuth login
    if (provider && providerId) {
        const { data: user, error } = await supabase
            .from('Login_Information')
            .select('*')
            .eq('provider_id', providerId)
            .eq('auth_provider', provider)
            .single()

        if (error || !user) throw new Error('OAuth user not found')
        const token = generateToken(user)
        return { success: true, token, user }
    }

    // Student login (no password)
    const { data: student, error: studentError } = await supabase
        .from('Login_Information')
        .select('*')
        .eq('username', username)
        .eq('role', 'student')
        .maybeSingle()

    if (student && !student.password) {
        const token = generateToken(student)
        return { success: true, token, user: student }
    }

    // Teacher login
    const { data: user, error } = await supabase
        .from('Login_Information')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !user) throw new Error('User not found')

    const validPassword = await bcrypt.compare(password, user.password || '')
    if (!validPassword) throw new Error('Invalid credentials')

    const token = generateToken(user)
    return { success: true, token, user }
    } catch (err) {
        console.error('loginUser error:', err)
        return { success: false, error: err.message }
    }
}

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing verification token' });

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
}

/**
 * Check if current user have matched role
 * 
 * @param {'student' | 'teacher'} role - The required role to continue
 * 
 * @returns {Function} Express middleware that validates the user's role.
 */
export function authRequireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.user_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        if (user.role !== role) {
            return res.status(403).json({ error: `Only allow ${role} is allow to perform this action.` });
        }
        next();
    };
}

export const authRequireStudent = authRequireRole("student");
export const authRequireTeacher = authRequireRole("teacher");
