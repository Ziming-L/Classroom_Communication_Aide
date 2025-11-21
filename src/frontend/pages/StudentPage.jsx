import React, { useState} from "react";
import { studentButtons } from "../utils/studentButtons";
import { COMMAND_POP_UP_TEXT } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import StarBox from "../components/StarBox"
import CommandPopUp from "../components/CommandPopUp";

export default function StudentPage() {

    const navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [currentClass, setCurrentClass] = useState("Math");
    const [buttons, setButtons] = useState(studentButtons);
    const [starCount, setStarCount] = useState(7);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [commandPopUpVisible, setcommandPopUpVisible] = useState(false);
    const userLang = "en";

    const handleGoToTranslator = () => {
        navigate("/translator", {
            state: {
                userLang: "es", 
                teacherLang: "en", 
            },
        });
    };

    const handleButtonClick = (btn) => { 
        setSelectedCommand(btn); 
        setcommandPopUpVisible(true); 
    };

    const addButton = () => {
        if (buttons.length == 8) return;
        const newButtonId = buttons.length + 1;
        const newButton = {
            id: newButtonId,
            userLangText: "Spanish",
            img: "/images/commands_icon/chicken_moving.png",
            targetLangText: "English",
            color: "bg-blue-500"
        };

        setButtons([...buttons, newButton]);
    };

    const createButtonGrid = (buttons) => (
        <div className="flex flex-row gap-24 justify-center">
            {buttons.map((btn) => (
            <button
                key={btn.id}
                className={`${btn.color} text-white font-semibold rounded hover:opacity-80 flex flex-col items-center justify-center w-40 h-40`}
                onClick={() => handleButtonClick({ 
                    userLangText: btn.userLangText,
                    targetLangText: btn.targetLangText, 
                    img: btn.img,
                })}
            >
                <span className="text-sm">{btn.userLangText}</span>
                    <img
                        src={btn.img}
                        alt="button image"
                        className="w-12 h-12 my-2"
                    />
                <span className="text-sm">{btn.targetLangText}</span>
            </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col p-8 w-full font-sans relative"> 
            {/* Header */}
            <header className="mb-6 flex justify-between items-center"> 
                {/* Student Greeting */}
                <h1 className="text-3xl font-bold mb-2">Hola Carlos!</h1>
        
                <div className="flex items-center gap-2.5">

                    {/* Help Button */}
                    <button className=" 
                        bg-black text-white 
                        text-sm sm:text-base
                        px-3 py-1 sm:px-4 sm:py-1.5 
                        rounded-lg 
                        shadow-md 
                        hover:bg-gray-800"
                    >
                        Help
                    </button>

                    {/* Current Class */}
                    <button className="px-[10px] py-[6px] rounded-[8px] border border-gray-300 bg-white cursor-pointer">
                        {currentClass}
                    </button>

                    {/* Profile */}
                    <div className="text-[26px] cursor-pointer">
                        <span role="img" aria-label="profile">👤</span>
                    </div>
                </div> 
            </header>

            {/* Current Activity */}
            <p className="text-xl mb-2">
                {currentActivity}
            </p>
            <p>
                I want to tell my teacher that...
            </p>
            {/* Edit Button */}
            <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow px-3 py-1.5 cursor-pointer">
                    <img 
                        src="/images/button_icon/edit_icon.png"
                        alt="Edit Icon"
                        className="w-5 h-5"

                    />
                    edit
                </button>
            </div>
            {/* Button Grids */}
            <div>
                {createButtonGrid(buttons)}
            </div>
            <br></br>
            <div>
                {createButtonGrid(buttons)}
            </div>
       
            {/* Translator */}
            <div>
                <button
                    onClick={handleGoToTranslator}
                    className="
                        fixed bottom-6 right-6
                        flex items-center gap-2
                        px-4 py-2 
                        bg-blue-600 
                        text-white 
                        rounded-full shadow 
                        hover:bg-blue-700
                        transition-all duration-200
                    "
                >
                    <img
                        src="/images/button_icon/translate_icon.png"
                        alt="Translate Icon"
                        className="w-5 h-5"
                    />
                    Translator
                </button>
            </div>
            <MessageBox />
            <StarBox starCount={starCount} />
            <CommandPopUp 
                visible={commandPopUpVisible}
                onClose={() => setcommandPopUpVisible(false)}
                command={selectedCommand}
                mode={"normal"} // can choose either "normal" or "star" mode
                textTranslations={COMMAND_POP_UP_TEXT[userLang]}
            />
        </div>
    );
}