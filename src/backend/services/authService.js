import { supabase } from "./supabaseClient.js";

/**
 * Register a new user to database
 * @param {Object} props
 * @param {string} props.email - User email (only for local)
 * @param {string} props.password - User password (only for local)
 * @param {string} props.username - Username
 * @param {'teacher' | 'student'} props.role - User role
 * @param {string} props.provided_auth_uid - Only needed when provider is google
 * @param {'google' | 'local'} props.provider - Provider type 
 * 
* @returns {Promise<{success: boolean, user?: any, error?: string}>}
 */
export async function registerUser({email, password, username, role, provided_auth_uid, provider = "local"}) {
    try {
        let authUser;
        if (provider === "local") {
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });
            if (authError) {
                throw authError;
            }

            authUser = authData.user;
            if (!authUser) {
                throw new Error("Failed to create auth user");
            }
        }

        const auth_uid = provider === "local" ? authUser.id : provided_auth_uid;
        const { data: userData, error: userErr } = await supabase.rpc("insert_user", {
            p_auth_uid: auth_uid,
            p_role: role,
            p_username: username
        });
        if (userErr) {
            throw userErr;
        }

        return userData;
    } catch (err) {
        return { success: false, error: err.message};
    }
}

/**
 * Check for user login for local signup approach
 * @param {Object} props
 * @param {string} props.email - User email
 * @param {string} props.password - User password
 * 
 * @returns {Promise<{success: boolean, access_token?: any, user?: any, error?: string}>}
 */
export async function loginUser({ email, password }) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            throw error;
        }

        const access_token = data.session?.access_token;
        const auth_uid = data.user.id;

        const { data: userData, error: userErr } = await supabase.rpc("get_user_by_auth_id", {
            p_auth_uid: auth_uid
        });
        if (userErr) {
            throw userErr;
        }

        return { 
            success: userData.success, 
            access_token, 
            user: userData.user || null,
            message: userData.message || null
        }
    } catch (err) {
        return {
            success: false,
            message: err.message,
            user: null
        };
    }
}

/**
 * Express middleware that verifies the JWT access token from the Authorization header.
 * 
 * - Expects header: `Authorization: Bearer <token>`
 * - If valid: attaches decoded payload to `req.user` and calls `next()`
 * - If missing or invalid: returns 401/403 response
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * 
 * @returns {void} Sends a 401/403 response or calls next()
 */
export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ 
            success: false,
            message: 'Missing verification token' 
        })
    };

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid authorization header" 
        });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token" 
            });
        }

        const { data: userData, error: userErr } = await supabase.rpc("get_user_by_auth_id", {
            p_auth_uid: user.id
        });
        if (userErr) {
            throw userErr;
        }
        if (!userData.success) {
            return res.status(403).json(userData);
        }

        req.user = userData.user; 

        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: err.message 
        });
    }
}

/**
 * Express middleware that check if current user have matched role
 * 
 * @param {'student' | 'teacher'} role - The required role to continue
 * 
 * @returns {Function} Express middleware that validates the user's role.
 */
export function authRequireRole(role) {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.user_id) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized access" 
            });
        }
        if (user.role !== role) {
            return res.status(403).json({ 
                success: false, 
                message: `Only allow ${role} is allowed to perform this action.` 
            });
        }
        next();
    };
}

export const authRequireStudent = authRequireRole("student");
export const authRequireTeacher = authRequireRole("teacher");
