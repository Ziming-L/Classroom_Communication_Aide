import React, { useState} from "react";
import { studentButtons } from "../utils/studentButtons";
import { useNavigate } from "react-router-dom";

export default function StudentPage() {

    const navigate = useNavigate();
    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [buttons, setButtons] = useState(studentButtons);

    const handleGoToTranslator = () => {
        navigate("/translator", {
            state: {
                userLang: "es", 
                teacherLang: "en", 
            },
        });
    };

    const addButton = () => {
        if (buttons == 8) return;
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
        <div> 
            <div className="flex flex-col p-8"> 
                <header className="mb-6"> 
                    <h1 className="text-3xl font-bold mb-2">Hola Carlos!</h1> 
                </header>
                <p>
                    {currentActivity}
                </p>
                <div>
                    {createButtonGrid(buttons)}
                </div>
            </div>
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
        </div>
    );
}