// Map of language name based on the code
export const LANGUAGE_NAMES = {
    en: "English",
    es: "Español",
};

// Map for the language code to corresponding speech code
export const LANGUAGE_SPEECH_CODE = {
    en: "en-US",
    es: "es-ES",
};

// Map the language code to corresponding top buttons text
export const TOP_BUTTONS_MAP = {
    en: {
        goBack: "Go Back",
        help: "Help"
    },
    es: {
        goBack: "Regresar",
        help: "Ayuda"
    },
};

// Map the language code to the translation box placeholder
export const TRANSLATOR_LANGUAGE_PLACEHOLDERS = {
    en: "Type something in English...",
    es: "Escribe algo en español...",
};

// Map the language code to help text for translator screen tooltips
export const TRANSLATOR_HELP_TEXT = {
    en: {
        mic: "🎤 Speak to translate",
        clean: "❌ Clear text",
        speak: "🔊 Listen to text",
        swap: "🔁 Swap languages",
        help: "ℹ️ Click this anytime to see help tips",
        input: "⌨️ Type here to translate",
        close: "Close",
        dashboard: "👈 Go back to the dashboard.",
    },
    es: {
        mic: "🎤 Habla para traducir",
        clean: "❌ Borrar texto",
        speak: "🔊 Escuchar texto",
        swap: "🔁 Cambiar idiomas",
        help: "ℹ️ Haz clic aquí en cualquier momento para ver consejos de ayuda.",
        input: "⌨️ Escribe aquí para traducir",
        close: "Cerrar",
        dashboard: "👈 Volver al panel de control.",
    },
};

// Map the language code to help text for translator screen tooltips
export const COMMAND_POP_UP_TEXT = {
    en: {
        tryOnOwn: "⭐ Try on your own", 
        sendToTeacher: "Send To Teacher", 
        playOutLoud: "Play Out Loud", 
        starHeader: "⭐ Try on your own to get a star!", 
        yesTry: "😎 Ok, I will try", 
        noTry: "😰 No, thank you", 
        goBack: "Go back",
    },
    es: {
        tryOnOwn: "⭐ Intentar por mi cuenta", 
        sendToTeacher: "Enviar a la maestra", 
        playOutLoud: "Reproducir", 
        starHeader: "⭐ Intenta por tu cuenta para ganar una estrella!", 
        yesTry: "😎 Está bien, lo intentaré", 
        noTry: "😰 No gracias", 
        goBack: "Regresar",
    },
};