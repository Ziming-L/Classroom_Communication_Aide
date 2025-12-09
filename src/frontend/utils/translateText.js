import request from "./auth";

/**
 * Translates a given text from one language to another using a backend API.
 *
 * @param {string} text - The text to translate.
 * @param {string} from - The source language code ("en", "es", etc).
 * @param {string} to - The target language code ("en", "es", etc).
 * 
 * @returns {Promise<string>} - The translated text, or an empty string if translation fails.
 */
export async function translateText(text, from, to) {
    if (!text || typeof text !== "string" || !text.trim()) return;
    
    try {
        const data = await request('/api/translate', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, from, to }),
        });

        return data[0]?.translations[0]?.text ?? "";
    } catch (err) {
        console.error("Translation failed: ", err);
        return "";
    }
}
