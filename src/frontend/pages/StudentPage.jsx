import React, { useState} from "react";
import { studentButtons } from "../utils/studentButtons";
import MessageBar from "../components/MessageBox";

export default function StudentPage() {

    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [currentClass, setCurrentClass] = useState("Math");
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
        <div className="flex flex-col p-8 w-full p-[15px] font-sans relative"> 
            {/* Header */}
            <header className="mb-6 flex justify-between items-center"> 
                {/* Student Greeting */}
                <h1 className="text-3xl font-bold mb-2">Hola Carlos!</h1>
                {/* Class and Profile */}
                <div class="flex items-center gap-2.5">
                    <button class="px-[10px] py-[6px] rounded-[8px] border border-gray-300 bg-white cursor-pointer">
                        {currentClass}
                    </button>
                    <div className="text-[26px] cursor-pointer">
                        <span role="img" aria-label="profile">👤</span>
                    </div>
                </div> 
            </header>
            <p>
                {currentActivity}
            </p>
            <p>
                I want to tell my teacher that...
            </p>
            {/* Edit Button */}
            <div className="flex justify-end">
                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-[8px] px-3 py-1.5 cursor-pointer">
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
            <MessageBar />
        </div>
    );
}