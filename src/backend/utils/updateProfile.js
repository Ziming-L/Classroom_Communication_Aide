import { supabase } from "../services/supabaseClient.js";

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
export async function updateProfileHelper(user_id, { name, icon, icon_bg_color }) {
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