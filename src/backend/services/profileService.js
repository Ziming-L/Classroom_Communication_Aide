import { supabase } from "../services/supabaseClient.js";

/**
 * Helper to create a profile to supabase
 * @param {number} user_id - User ID
 * @param {'student' | 'teacher'} role - User role
 * @param {{name, language_code, icon, icon_bg_color, school_name}} data - Include: name, language code, icon, icon bg color, school name
 * 
 * @returns {{success: boolean, message: string}}
 */
export async function createProfile(user_id, role, data) {
    try {
        const { name, language_code, icon, icon_bg_color, school_name } = data;

        if (role !== "teacher" && role !== "student") {
            return {
                success: false,
                message: "Invalid role"
            };
        }

        if (name.trim() === "") {
            return {
                success: false,
                message: "Name cannot be just whitespace"
            };
        }
        if (name.length > 20) {
            return {
                success: false,
                message: "Name too long (> 20 characters)"
            };
        }

        if (language_code.trim() === "") {
            return {
                success: false,
                message: "Language code cannot be just whitespace"
            };
        }
        if (language_code.length !== 2 && language_code.length !== 3) {
            return {
                success: false,
                message: "Language code must be 2 or 3 characters (e.g. 'en', 'es')"
            };
        }

        if (icon !== undefined) {
            const iconRegex = /^\.\.\/images\/user_profile_icon\/[a-zA-Z0-9_-]+\.png$/;
            if (!iconRegex.test(icon)) {
                return {
                    success: false,
                    message: "Icon must match format: ../images/user_profile_icon/<name>.png"
                };
            }
        } 

        if (icon_bg_color !== undefined) {
            const hexRegex = /^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;
            // validate hex color
            if (!hexRegex.test(icon_bg_color)) {
                return {
                    success: false,
                    message: "Invalid color format. Use hex like #add8e6 or #14336cff"
                };
            }
        }

        if (school_name !== undefined) {
            if (school_name.trim() === "") {
                return {
                    success: false,
                    message: "School name cannot be just whitespace"
                };
            }
        }

        const params = {
            p_user_id: user_id,
            p_role: role,
            p_name: name,
            p_language_code: language_code,
        };
        if (icon !== undefined) {
            params.p_icon = icon;
        }
        if (icon_bg_color !== undefined) {
            params.p_icon_bg_color = icon_bg_color;
        }
        if (school_name !== undefined) {
            params.p_school_name = school_name;
        }

        const { data: result, error } = await supabase.rpc("create_user_profile", params);
        if (error) {
            return {
                success: false,
                message: error.message
            };
        }

        return result;
    } catch (err) {
        return {
            success: false,
            message: "Unexpected error: " + err.message
        };
    }
}

/**
 * Helper that can be used by student and teacher to change their profile setting
 * 
 * @param {number} user_id - the user id
 * @param {object} props
 * @param {string} props.name - the name that want to be changed to (can be empty)
 * @param {string} props.icon - the icon that want to be changed to (can be empty)
 * @param {string} props.icon_bg_color - the icon background color that want to be changed to (can be empty)
 * 
 * @returns {json} return the success: true/false and the message
 */
export async function updateProfile(user_id, { name, icon, icon_bg_color }) {
    try {
        if (name !== undefined) {
            if (name.trim() === "") {
                return {
                    success: false,
                    message: "Name cannot be just whitespace"
                };
            }
            if (name.length > 20) {
                return {
                    success: false,
                    message: "Name too long (> 20 characters)"
                };
            }
        }

        if (icon !== undefined) {
            const iconRegex = /^\.\.\/images\/user_profile_icon\/[a-zA-Z0-9_-]+\.png$/;
            if (!iconRegex.test(icon)) {
                return {
                    success: false,
                    message: "Icon must match format: ../images/user_profile_icon/<name>.png"
                };
            }
        } 

        if (icon_bg_color !== undefined) {
            const hexRegex = /^#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?$/;
            // validate hex color
            if (!hexRegex.test(icon_bg_color)) {
                return {
                    success: false,
                    message: "Invalid color format. Use hex like #add8e6 or #14336cff"
                };
            }
        }

        const { data, error } = await supabase.rpc("modify_profile", {
            p_user_id: user_id, 
            p_name: name ?? null,
            p_icon: icon ?? null,
            p_icon_bg_color: icon_bg_color ?? null
        });
        if (error) {
            return {
                success: false, 
                message: error.message
            };
        }

        return data;
    } catch (err) {
        return {
            success: false,
            message: "Unexpected error: " + err.message
        };
    }
}