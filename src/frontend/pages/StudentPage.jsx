import React, { useState} from "react";
import { studentButtons } from "../utils/studentButtons";

export default function StudentPage() {

    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [buttons, setButtons] = useState(studentButtons);

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
    );
}