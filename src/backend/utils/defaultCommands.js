const COMMANDS_TEXT_MAP = {
    es : {
        wantWater: "Quiero beber agua",
        needBathroom: "Quiero ir al baño",
        sick: "Me siento enfermo",
        needHelp: "Necesito ayuda",
        userCommand1: "Quiero beber agua",
        userCommand2: "Spanish",
        userCommand3: "Spanish", 
        userCommand4: "Spanish"
    }, 
    en : {
        wantWater: "I want to drink water",
        needBathroom: "I need to go to the bathroom",
        sick: "I feel sick",
        needHelp: "I need help",
        userCommand1: "I want to drink water",
        userCommand2: "English",
        userCommand3: "English", 
        userCommand4: "English"
    }, 
};

const COMMAND_IMG_MAP = {
    wantWater: "../images/commands_icon/cup.png",
    needBathroom: "../images/commands_icon/chicken_moving.png",
    sick: "../images/commands_icon/sick.png",
    needHelp: "../images/commands_icon/question.png",
    userCommand1: "../images/commands_icon/glasses.png", 
    userCommand2: "../images/commands_icon/computer_moving.png",
    userCommand3: "../images/commands_icon/pencil.png",
    userCommand4: "../images/commands_icon/raining.png"
};

const COMMAND_COLOR_MAP = {
    wantWater: "#e0eafd",
    needBathroom: "#fff7b6", 
    sick: "#f8d4ae",
    needHelp: "#ffc6c6" ,
    userCommand1: "#f0fcf6",
    userCommand2: "#dfdaff",
    userCommand3: "#e7e7e7", 
    userCommand4: "#c6ddff" 
};

const COMMAND_PRIORITY_MAP = {
    wantWater: 1,
    needBathroom: 1, 
    sick: 1,
    needHelp: 2,
    userCommand1: 3,
    userCommand2: 3,
    userCommand3: 3, 
    userCommand4: 3
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