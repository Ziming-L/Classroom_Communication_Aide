import React, { useState, useRef, useLayoutEffect } from "react";
import { studentButtons, editableButtons } from "../utils/studentButtons";
import { COMMAND_POP_UP_TEXT, STUDENT_PAGE_HELP_TEXT } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import StarBox from "../components/StarBox"
import CommandPopUp from "../components/CommandPopUp";
import { useEffect } from "react";
import Tooltip from "../components/Tooltip.jsx";
import request from "../utils/auth";

export default function StudentPage( ) {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // for help tooltips
    const helpBtnRef = useRef(null);
    const editBtnRef = useRef(null);
    const translatorBtnRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);
    const [positions, setPositions] = useState({})

    

    const [studentName, setStudentName] = useState("");
    const [studentInfo, setStudentInfo] = useState(null);
    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [currentClass, setCurrentClass] = useState("Math");
    const [buttons, setButtons] = useState(studentButtons);
    const [editableButtonsState, setEditableButtons] = useState(editableButtons);
    const [starCount, setStarCount] = useState(0);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [commandPopUpVisible, setcommandPopUpVisible] = useState(false);
    const [tryMode, setTryMode] = useState("normal");
    const userLang = "es";
    

    const handleGoToTranslator = () => {
        navigate("/student/translator", {
            state: {
                userLang: "es", 
                teacherLang: "en", 
            },
        });
    };

    const handleGoToProfile = () => {
        navigate("/student/profile", { state: { studentInfo } });
    };

    const handleGoToEdit = () => {
        navigate("/student/edit", { state: { editableButtonsState } });
    };

    const handleButtonClick = (btn) => { 
        setSelectedCommand(btn); 
        setcommandPopUpVisible(true); 
    };

    const toggleTryMode = () => {
        setTryMode(tryMode === "normal" ? "star" : "normal");
    }

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
                className={`${btn.color} cursor-pointer text-black rounded hover:opacity-80 flex flex-col items-center justify-center w-40 h-40 border`}
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

    const getRects = () => ({
        help: helpBtnRef.current?.getBoundingClientRect(),
        edit: editBtnRef.current?.getBoundingClientRect(),
        translator: translatorBtnRef.current?.getBoundingClientRect()
    });

    useLayoutEffect(() => {
        if (!showHelp) return;
        setPositions(getRects());
    }, [showHelp]);

    useEffect(() => {
        if (!showHelp) return;

        const updatePositions = () => setPositions(getRects());
        window.addEventListener("resize", updatePositions);
        window.addEventListener("scroll", updatePositions);

        return () => {
            window.removeEventListener("resize", updatePositions);
            window.removeEventListener("scroll", updatePositions);
        };
    }, [showHelp]);

    const fetchStarCount = async () => {
        try {
            const res = await request("/api/students/star-number", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.success) {
                setStarCount(res.star_number);
            } else {
                console.error("Backend error:", res);
            }
        } catch (err) {
            console.error("Error fetching star count:", err);
        }
    };

    const fetchStudentInfo = async () => {
        try {
            const res = await request("/api/students/student-info", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            console.log("API returned:", res);
            if (res.success) {
                setStudentInfo(res.student);
            } else {
                console.error("Backend error:", res);
            }
        } catch (err) {
            console.error("Error fetching student info:", err);
        }
    };

    useEffect(() => {
        fetchStudentInfo();
    }, []);


    useEffect(() => {
        fetchStarCount();
    }, []);


    return (
        <div className="flex flex-col p-8 w-full font-sans relative"> 
            {/* Header */}
            <header className="mb-6 flex justify-between items-center"> 
                {/* Student Greeting */}
                <h1 className="text-3xl font-bold mb-2">Hola {studentInfo?.student_name}!</h1>
        
                <div className="flex items-center gap-2.5">

                    {/* Help Button */}
                    <button ref={helpBtnRef} className=" 
                        bg-black text-white 
                        text-sm sm:text-base
                        px-3 py-1 sm:px-4 sm:py-1.5 
                        rounded-lg 
                        shadow-md 
                        hover:bg-gray-800"
                        onClick={() => setShowHelp(true)}
                    >
                        Help
                    </button>

                    {/* Current Class */}
                    <label >
                        <select name="subject" default="default"
                            className="px-[10px] py-[6px] rounded-[8px] border border-gray-300 bg-white cursor-pointer">
                            <option value="Math">Math</option>
                            <option value="Literature">Literature</option>
                            <option value="Science">Science</option>
                        </select>
                    </label>

                    {/* Profile */}
                    <div className="text-[26px] cursor-pointer">
                        <button onClick={handleGoToProfile}>
                            <span role="img" aria-label="profile">👤</span>
                        </button>
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
                <button ref={editBtnRef}
                onClick={handleGoToEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow px-3 py-1.5 cursor-pointer">
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
                {createButtonGrid(editableButtonsState)}
            </div>
       
            {/* Translator */}
            <div>
                <button
                    ref={translatorBtnRef}
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
                <button onClick={toggleTryMode} className={`border hover:bg-blue-400 mt-3 ${tryMode === "normal" ? "bg-blue-200" : "bg-yellow-200"}`}>
                     ⭐ 
                </button>
            </div>
            <MessageBox />
            <StarBox starCount={starCount} />
            <CommandPopUp 
                visible={commandPopUpVisible}
                onClose={() => setcommandPopUpVisible(false)}
                command={selectedCommand}
                mode={tryMode} // can choose either "normal" or "star" mode
                textTranslations={COMMAND_POP_UP_TEXT[userLang]}
            />

            {showHelp && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
                    <button
                        onClick={() => setShowHelp(false)}
                        className="fixed top-6 right-6 bg-purple-600 text-white px-3 py-1 rounded"
                    >
                        {STUDENT_PAGE_HELP_TEXT[userLang].close}
                    </button>

                    {/* Tooltip for help button */}
                    <Tooltip
                        position={positions.help}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].help}
                        maxWidth={150}
                        center
                    />

                    {/* Tooltip for edit button */}
                    <Tooltip
                        position={positions.edit}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].edit}
                        maxWidth={180}
                        center
                    />

                    {/* Tooltip for translator */}
                    <Tooltip
                        position={positions.translator}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].translator}
                        maxWidth={200}
                        center
                        offsetTBottom={-150}
                    />
                </div>
            )}
        </div>
 
    );
}