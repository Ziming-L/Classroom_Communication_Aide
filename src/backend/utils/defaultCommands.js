const COMMANDS_TEXT_MAP = {
    es : {
        wantWater: "Quiero beber agua",
        needBathroom: "quiero ir al baño",
        sick: "Me siento enfermo",
        needHelp: "Necesito ayuda",
    }, 
    en : {
        wantWater: "I want to drink water",
        needBathroom: "I need to go to the bathroom",
        sick: "I feel sick",
        needHelp: "I need help",
    }, 
};

const COMMAND_IMG_MAP = {
    wantWater: "/images/commands_icon/cup.png",
    needBathroom: "/images/commands_icon/chicken_moving.png",
    sick: "/images/commands_icon/sick.png",
    needHelp: "/images/commands_icon/question.png",
};

const COMMAND_COLOR_MAP = {
    wantWater: "bg-blue-500",
    needBathroom: "bg-yellow-500", 
    sick: "bg-orange-500",
    needHelp: "bg-red-500",
};

const COMMAND_PRIORITY_MAP = {
    wantWater: 1,
    needBathroom: 1, 
    sick: 1,
    needHelp: 2,
};

/**
 * Get default commands for both student and teacher languages
 * @param {string} studentLang - language code for student (default: "es")
 * @param {string} teacherLang - language code for teacher (default: "en")
 * 
 * @returns {Array<{ 
 *  key: string, 
 *  userLangText: string, 
 *  targetLangText: string, 
 *  img: string, 
 *  color: string,
 *  priority: number }>}
 */
export function getDefaultCommands(studentLang = "es", teacherLang = "en") {
    const studentCommands = COMMANDS_TEXT_MAP[studentLang];
    const teacherView = COMMANDS_TEXT_MAP[teacherLang];

    const commandKeys = Object.keys(COMMAND_IMG_MAP);

    return commandKeys.map((key) => ({
        key, 
        userLangText: studentCommands[key],
        targetLangText: teacherView[key], 
        img: COMMAND_IMG_MAP[key], 
        color: COMMAND_COLOR_MAP[key],
        priority: COMMAND_PRIORITY_MAP[key],
    }));
}