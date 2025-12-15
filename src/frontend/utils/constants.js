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

// Map the language code to the command pop up texts
export const COMMAND_POP_UP_TEXT = {
    en: {
        tryOnOwn: "⭐ Try on your own", 
        sendToTeacher: "Send To Teacher", 
        playOutLoud: "Play Out Loud", 
        stopPlaying: "⏹ Stop Sound",
        starHeader: "⭐ Try on your own to get a star!", 
        yesTry: "😎 Ok, I will try", 
        noTry: "😰 No, thank you", 
        goBack: "Go back",
    },
    es: {
        tryOnOwn: "⭐ Intentar por mi cuenta", 
        sendToTeacher: "Enviar a la maestra", 
        playOutLoud: "Reproducir", 
        stopPlaying: "⏹ Detener el sonido",
        starHeader: "⭐ Intenta por tu cuenta para ganar una estrella!", 
        yesTry: "😎 Está bien, lo intentaré", 
        noTry: "😰 No gracias", 
        goBack: "Regresar",
    },
};

// Map the language code to the student page help tooltips
export const STUDENT_PAGE_HELP_TEXT = {
    en: {
        help: "Tap here to see tips for using this page",
        edit: "Edit your command buttons",
        translator: "Open the translator to help you communicate",
        command: "Tap a button to tell your teacher something",
        activityText: "This shows what the class is doing right now",
        profile: "See your profile and settings",
        class: "Choose your current class or subject",
        message: "Send a message to your teacher",
        close: "Close help"
    },
    es: {
        help: "Toca aquí para ver consejos sobre cómo usar esta página",
        edit: "Edita tus botones de comandos",
        translator: "Abre el traductor para ayudarte a comunicarte",
        command: "Toca un botón para decirle algo a tu maestro",
        activityText: "Esto muestra lo que la clase está haciendo ahora",
        profile: "Mira tu perfil y configuración",
        class: "Elige tu clase o materia",
        message: "Envia un mensaje a tu maestro",
        close: "Cierra ayuda"
    },
};

// Map the language code to the student profile option text
export const STUDENT_PROFILE_TEXT = {
    en: {
        profile: "Profile",
        save: "Save",
        name: "Name",
        color: "Color",
    },
    es: {
        profile: "Perfil",
        save: "Guarda",
        name: "Nombre",
        color: "Color",
    },
};

// Map the language code to the student page buttons and text
export const STUDENT_PAGE_TEXT = {
    en: {
        edit: "edit",
        message: "send message to teacher...",
        disabledMessage: "select a class to send messages",
        translator: "Translator",
        help: "Help",
        greeting: "Hello",
        buttonPrompt: "I want to tell my teacher that...",
        star: "Star count:",
        noClass: "Please add a class in order to send requests and messages to your teacher"
    },
    es: {
        edit: "edita",
        message: "manda un mesaje a tu maestro...",
        disabledMessage: "seleccione una clase para enviar mensajes",
        translator: "Traducir",
        help: "Ayuda",
        greeting: "Hola",
        buttonPrompt: "Le quiero decir a mi maestro que...",
        star: "Estrellas:",
        noClass: "Por favor, añade una clase para poder enviar solicitudes y mensajes a tu maestro"
    },
};

// Map the language code to the student button editor text
export const BUTTON_EDITOR_TEXT = {
    en: {
        back: "Go Back",
        save: "Save Changes",
        description: "Description:",
        translation: "Translation:",
        icon: "Icon:",
        color: "Color:",
    },
    es: {
        back: "Regresar",
        save: "Guardar Cambios",
        description: "Descripción:",
        translation: "Traducción:",
        icon: "Icono:",
        color: "Color:",
    },
};