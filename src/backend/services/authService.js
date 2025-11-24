import { supabase } from "./supabaseClient.js";

/**
 * Check for user login for local signup approach
 * @param {Object} props
 * @param {string} props.email - User email
 * @param {string} props.password - User password
 * @param {string} props.role - User role
 * 
 * @returns {Promise<{success: boolean, access_token?: any, user?: any, error?: string}>}
 */
export async function loginUser({ email, password, role }) {
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
        
        // check role
        if (!userData.user || userData.user.role !== role) {
            return {
                success: false,
                message: `Role does not match. Please login as ${userData.user.role}`,
                user: null,
                token: null
            };
        }

        return { 
            success: userData.success, 
            token: access_token, 
            user: userData.user,
            message: userData.message
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

/**
 * Handle OAuth login, check if user exists, if not they need to complete registration
 * @param {string} email - User email from OAuth provider
 * @param {string} auth_uid - Supabase auth user ID
 *
 * @returns {Promise<{success: boolean, token?: string, user?: any, needsRegistration?: boolean}>}
 */
export async function handleOAuthUser({ email, auth_uid }) {
    try {
        // Check if user exists in our database
        const { data: userData, error: userErr } = await supabase.rpc("get_user_by_auth_id", {
            p_auth_uid: auth_uid
        });

        if (userErr) {
            throw userErr;
        }

        // User exists
        if (userData.success) {
            // Generate a session token for this user
            const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email: email
            });

            if (sessionError) {
                throw sessionError;
            }

            return {
                success: true,
                token: sessionData.properties.hashed_token || auth_uid,
                user: userData.user
            };
        }

        // User does not exist, need to complete registration
        return {
            success: true,
            needsRegistration: true,
            auth_uid: auth_uid,
            email: email
        };
    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
}
