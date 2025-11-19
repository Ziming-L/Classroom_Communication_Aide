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
    const { name, language_code, icon, icon_bg_color, school_name } = data;

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
        params.p_school_name = icon;
    }

    const { data: result, error } = await supabase.rpc("create_user_profile", params);
    if (error) {
        return {
            success: false,
            message: error.message
        };
    }

    return result;
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
    if (name && name.length > 15) {
        return {
            success: false,
            message: "Name too long"
        };
    }
    if (icon_bg_color && !/^#([0-9A-Fa-f]{6})$/.test(icon_bg_color)) {
        return {
            success: false, 
            message: "Invalid icon background color: need to be in hex"
        };
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
}