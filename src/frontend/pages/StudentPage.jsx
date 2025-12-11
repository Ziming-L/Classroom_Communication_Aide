import React, { useState, useRef, useLayoutEffect } from "react";
import { studentButtons, editableButtons } from "../utils/studentButtons";
import { COMMAND_POP_UP_TEXT, STUDENT_PAGE_HELP_TEXT, STUDENT_PAGE_TEXT } from "../utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import StarBox from "../components/StarBox"
import CommandPopUp from "../components/CommandPopUp";
import { useEffect } from "react";
import Tooltip from "../components/Tooltip.jsx";
import request from "../utils/auth";
import Profile from "../components/Profile";

export default function StudentPage( ) {

    const navigate = useNavigate();
    const location = useLocation();

    // use for waiting for input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // for help tooltips
    const helpBtnRef = useRef(null);
    const editBtnRef = useRef(null);
    const translatorBtnRef = useRef(null);
    const messageBtnRef = useRef(null);
    const activityBtnRef = useRef(null);
    const [showHelp, setShowHelp] = useState(false);
    const [positions, setPositions] = useState({})

    const [studentInfo, setStudentInfo] = useState(null);
    const [classesInfo, setClassesInfo] = useState([]);
    const [commandsInfo, setCommandsInfo] = useState([]);
    const [currentActivity, setCurrentActivity] = useState( 'Class is heading to the reading rug to read "Pete the Cat"!' );
    const [currentClass, setCurrentClass] = useState("Math");

    const [buttons, setButtons] = useState(studentButtons);
    const [editableButtonsState, setEditableButtons] = useState(editableButtons);

    const [starCount, setStarCount] = useState(0);
    const [selectedCommand, setSelectedCommand] = useState(null);
    const [commandPopUpVisible, setcommandPopUpVisible] = useState(false);
    const [tryMode, setTryMode] = useState("normal");
    const userLang = studentInfo?.language_code || "en";    

    const handleGoToTranslator = () => {
        navigate("/student/translator", {
            state: {
                userLang: userLang, 
                teacherLang: "en", 
            },
        });
    };

    const handleGoToProfile = () => {
        navigate("/student/profile", { state: { studentInfo } });
    };

    const handleGoToEdit = () => {
        navigate("/student/edit", { state: { editableButtonsState, studentInfo } });
    };

    const handleButtonClick = (btn) => { 
        setSelectedCommand(btn); 
        setcommandPopUpVisible(true); 
    };

    const toggleTryMode = () => {
        setTryMode(tryMode === "normal" ? "star" : "normal");
    }

    useEffect(() => {
        if (location.state?.updatedButtons) {
            setEditableButtons(location.state.updatedButtons);
            navigate(location.pathname, { replace: true });
        }
    }, [location.state]);

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
                    "Content-Type": "application/json"
                }
            });

            if (res.success) {
                setStarCount(res.star_number);
            } else {
                console.error("Backend error:", res);
                setError("Backend error:" + res);
            }
        } catch (err) {
            console.error("Error fetching star count:", err);
            setError("Error fetching star count:" + err);
        }
    };

    const fetchStudentInfo = async () => {
        try {
            const res = await request("/api/students/student-info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("API returned:", res);
            if (res.success) {
                setStudentInfo(res.student || {});
                setClassesInfo(res.classes || {});
                setCommandsInfo(res.commands || {});
                setTryMode(res.student?.try_yourself ? "star" : "normal")
                const commands = res.commands || [];

                // get the editable commands specifically
                const editableCommands = commands.filter(cmd => cmd.is_default === false);
                const editable = editableCommands.map(cmd => ({
                        id: cmd.command_id,
                        userLangText: cmd.command_text,
                        targetLangText: cmd.translated_text?.en || "",
                        img: cmd.image,
                        color: cmd.color
                    })
                );

                // get the essential non-editable commands
                 const essentialCommands = commands.filter(cmd => cmd.is_default === true);
                const essential = essentialCommands.map(cmd => ({
                        id: cmd.command_id,
                        userLangText: cmd.command_text,
                        targetLangText: cmd.translated_text?.en || "",
                        img: cmd.image,
                        color: cmd.color
                    })
                );

                setEditableButtons(editable);
                setButtons(essential);

            } else {
                console.error("Backend error:", res);
                setError("Backend error:" + res);
            }
        } catch (err) {
            console.error("Error fetching student info:", err);
            setError("Error fetching student info:" + err);
        }
    };

    // get all information from the backend to continue rendering
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchStudentInfo(), 
                fetchStarCount()
            ]);
            setLoading(false);
        };
        loadData();
    }, []);


    const createButtonGrid = (buttons) => (
        <div className="flex flex-row gap-24 justify-center mb-5">
            {buttons.map((btn) => (
            <button
                key={btn.id}
                style={{ backgroundColor: btn.color }}
                className="cursor-pointer text-black rounded hover:opacity-80 flex flex-col items-center justify-center w-40 h-40 border"
                onClick={() => handleButtonClick({ 
                    id: btn.id,
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
        translator: translatorBtnRef.current?.getBoundingClientRect(),
        message: messageBtnRef.current?.getBoundingClientRect(),
        activity: activityBtnRef.current?.getBoundingClientRect()
    });

    useLayoutEffect(() => {
        if (!showHelp) return;
        setPositions(getRects());
    }, [showHelp]);

    // wait here until get data back from backend
    if (loading) {
        return (
            <div className=" bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 flex flex-col items-center justify-center h-screen">
                <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight px-4">Loading Student Page...</p>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col p-8 w-full font-sans relative"> 
            {/* Header */}
            <header className="mb-6 flex justify-between items-center"> 
                {/* Student Greeting */}
                <h1 className="text-3xl font-bold mb-2">{STUDENT_PAGE_TEXT[userLang].greeting} {studentInfo?.student_name}!</h1>
        
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
                        {STUDENT_PAGE_TEXT[userLang].help}
                    </button>

                    {/* Current Class */}
                    <label >
                        <select name="subject" default="default"
                            className="px-[10px] py-[6px] rounded-[8px] border border-gray-300 bg-white cursor-pointer">
                            <option value="Math">{classesInfo?.[0]?.class_code || "No Class"}</option>
                        </select>
                    </label>

                    {/* Profile */}
                    <div className="text-[26px] cursor-pointer">
                        <button onClick={handleGoToProfile}>
                            <Profile 
                                image={studentInfo.student_icon}
                                color={studentInfo.student_icon_bg_color}
                            />
                        </button>
                    </div>
                </div> 
            </header>

            {classesInfo?.[0]?.class_code && ( // withold messaging, editing, and button command features until connected to a class
                <div>
                    {/* Current Activity */}
                    <p className="text-xl mb-2">
                        {currentActivity}
                    </p>
                    <p ref={activityBtnRef}>
                        {STUDENT_PAGE_TEXT[userLang].buttonPrompt}
                    </p>
                    {/* Edit Button */}
                    <div className="flex justify-end">
                        <button ref={editBtnRef}
                            onClick={handleGoToEdit}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow px-3 py-1.5 cursor-pointer"
                        >
                            <img 
                            src="/images/button_icon/edit_icon.png"
                            alt="Edit Icon"
                            className="w-5 h-5"
                            />
                            {STUDENT_PAGE_TEXT[userLang].edit}
                        </button>
                    </div>
                    {/* Button Grids */}
                    <div>{createButtonGrid(buttons)}</div>
                    <div>{createButtonGrid(editableButtonsState)}</div>
                </div>
            )}

            {!(classesInfo?.[0]?.class_code) && ( // message if student is not added to any classes
                <p className="text-center text-lg text-gray-600 mt-6"> 
                    {STUDENT_PAGE_TEXT[userLang]?.noClass} 
                </p> 
            )}
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
                    {STUDENT_PAGE_TEXT[userLang].translator}
                </button>
                <button onClick={toggleTryMode} className={`border hover:bg-blue-400 ${tryMode === "normal" ? "bg-blue-200" : "bg-yellow-200"}`}>
                    ⭐? 
                </button>
            </div>
            <div ref={messageBtnRef} className="h-1 mb-1"></div>
            {classesInfo?.[0]?.class_code && ( // only allow messages if student is added to a class
                <MessageBox placeholderText={STUDENT_PAGE_TEXT[userLang].message}/>
            )}
            <StarBox starCount={starCount} text={STUDENT_PAGE_TEXT[userLang].star}/>
            <CommandPopUp 
                visible={commandPopUpVisible}
                onClose={() => setcommandPopUpVisible(false)}
                command={selectedCommand}
                mode={tryMode} // can choose either "normal" or "star" mode
                textTranslations={COMMAND_POP_UP_TEXT[userLang]}
                classId = {classesInfo[0]?.class_id}
            />

            {showHelp && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50">
                    <button
                        onClick={() => setShowHelp(false)}
                        className="fixed top-6 right-6 bg-purple-600 text-white px-3 py-1 rounded"
                    >
                        {STUDENT_PAGE_HELP_TEXT[userLang].close}
                    </button>

                    {/* Tooltip for activity */}
                    <Tooltip
                        position={positions.activity}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].activityText}
                        maxWidth={150}
                        center
                        offsetTBottom={-100}

                    />

                    {/* Tooltip for help button */}
                    <Tooltip
                        position={positions.help}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].help}
                        maxWidth={150}
                        center
                    />


                    {/* Tooltip for message bar */}
                    <Tooltip
                        position={positions.message}
                        text={STUDENT_PAGE_HELP_TEXT[userLang].message}
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