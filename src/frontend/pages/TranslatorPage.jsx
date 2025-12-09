import { useState, useRef, useEffect, useLayoutEffect } from "react";
import TranslatorBox from "../components/TranslatorBox";
import SwapButton from "../components/SwapButton";
import { translateText } from "../utils/translateText.js";
import Tooltip from "../components/Tooltip.jsx";
import { TOP_BUTTONS_MAP, TRANSLATOR_HELP_TEXT } from "../utils/constants.js";
import { useLocation } from "react-router-dom";
import GoBackButton from "../components/GoBackButton.jsx";

/**
 * TranslatorPage Component
 *
 * Renders a bilingual translation interface with:
 * - Two text boxes for source and target languages
 * - Automatic translation when typing
 * - Swap and clear buttons
 * - Help overlay with tooltips for interactive elements
 *
 * @returns JSX.Element - the translator page
 */
export default function TranslatorPage() {
    const location = useLocation();

    const { userLang = "es", teacherLang = "en" } = location.state || {};
    const [leftLang, setLeftLang] = useState(userLang);
    const [rightLang, setRightLang] = useState(teacherLang);
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    const backBtnRef = useRef(null);
    const helpBtnRef = useRef(null);
    const micRef = useRef(null);
    const xRef = useRef(null);
    const speakRef = useRef(null);
    const swapRef = useRef(null);
    const inputRef = useRef(null);

    const [positions, setPositions] = useState({});

    const [isLargeScreen, setIsLargeScreen] = useState(() => 
        typeof window !== "undefined" ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const onResize = () => setIsLargeScreen(window.innerWidth >= 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const getRects = () => ({
        back: backBtnRef.current?.getBoundingClientRect(),
        help: helpBtnRef.current?.getBoundingClientRect(),
        mic: micRef.current?.getBoundingClientRect(),
        x: xRef.current?.getBoundingClientRect(),
        speak: speakRef.current?.getBoundingClientRect(),
        swap: swapRef.current?.getBoundingClientRect(),
        input: inputRef.current?.getBoundingClientRect(),
    });

    useLayoutEffect(() => {
        if (!showHelp) return;

        setPositions(getRects());
    }, [showHelp]);

    useEffect(() => {
        if (!showHelp) return;

        const updatePositions = () => {
            setPositions(getRects());
        }

        updatePositions();

        window.addEventListener("scroll", updatePositions, { passive: true });
        window.addEventListener("resize", updatePositions);
        window.addEventListener("orientationchange", updatePositions);

        return () => {
            window.removeEventListener("scroll", updatePositions);
            window.removeEventListener("resize", updatePositions);
            window.removeEventListener("orientationchange", updatePositions);
        };

    }, [showHelp]);

    const handleTranslate = async (text, source) => {
        if (!text.trim()) {
            if (source === "left") {
                setRightText("");
            } else {
                setLeftText("");
            }
            return;
        }

        const from = source === "left" ? leftLang : rightLang;
        const to = source === "left" ? rightLang : leftLang;

        try {
            const result = await translateText(text, from, to);
            if (source === "left") {
                setRightText(result);
            } else {
                setLeftText(result);
            }
        } catch (err) {
            console.error("Translation failed:", err);
        }
    }

    const handleSwap = () => {
        setLeftLang(rightLang);
        setRightLang(leftLang);
        setLeftText(rightText);
        setRightText(leftText);
    };

    const handleClearBoth = () => {
        setLeftText("");
        setRightText("");
    }

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-50">

            {/* top bar */}
            <div className="flex justify-between items-center w-full px-8">
                <GoBackButton 
                    label={TOP_BUTTONS_MAP[userLang]?.goBack}
                    ref={backBtnRef}
                />
                <button 
                    ref={helpBtnRef}
                    onClick={() => setShowHelp(true)}
                    className="
                        bg-black text-white 
                        text-sm sm:text-base
                        px-3 py-1.5 sm:px-4 sm:py-2 
                        rounded-lg 
                        shadow-md 
                        hover:bg-gray-800">
                    {TOP_BUTTONS_MAP[userLang]?.help}
                </button>
            </div>

            {/* translation section */}
            <div 
                className="
                    flex flex-1 justify-center items-center 
                    gap-4 sm:gap-6 md:gap-8
                    mt-10 w-full max-w-6xl mx-auto
                    h-auto md:h-[75vh]
                    flex-col md:flex-row
                ">

                {/* left translator box */}
                <TranslatorBox
                    inputRef={inputRef}
                    micRef={micRef}
                    xRef={xRef}
                    speakRef={speakRef}
                    language={leftLang}
                    color="yellow"
                    text={leftText}
                    onChange={(val) => {
                        setLeftText(val);
                        handleTranslate(val, "left");
                    }}
                    onClear={handleClearBoth}
                />

                {/* swap button */}
                <div 
                    ref={swapRef}
                    className="flex justify-center items-center">
                    <SwapButton onSwap={handleSwap} />
                </div>

                {/* right translator box */}
                <TranslatorBox
                    language={rightLang}
                    color="blue"
                    text={rightText}
                    onChange={(val) => {
                        setRightText(val);
                        handleTranslate(val, "right");
                    }}
                    onClear={handleClearBoth}
                />
            </div>

            {/* help overlay */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50">
                    {/* Close button */}
                    <button
                        onClick={() => setShowHelp(false)}
                        className="
                            fixed top-6 right-6
                            bg-gradient-to-r from-purple-600 to-indigo-600 
                            text-white font-medium
                            px-3 py-1
                            rounded-md shadow-lg
                            hover:from-purple-700 hover:to-indigo-700
                            transition-all duration-200
                            z-[99999]
                        "
                    >
                        {TRANSLATOR_HELP_TEXT[userLang].close}
                    </button>

                    {/* Tooltip for Go back */}
                    <Tooltip
                        position={positions.back} 
                        text={TRANSLATOR_HELP_TEXT[userLang].dashboard} 
                        maxWidth={150} 
                        offsetTBottom={8}
                        center={true} 
                    />
                    
                    {/* Tooltip for Help button */}
                    <Tooltip
                        position={positions.help} 
                        text={TRANSLATOR_HELP_TEXT[userLang].help} 
                        maxWidth={170} 
                        offsetTBottom={8}
                        offsetLeft={-100}
                        center={true} 
                    />

                    {/* Tooltip for input box */}
                    <Tooltip
                        position={positions.input} 
                        text={TRANSLATOR_HELP_TEXT[userLang].input} 
                        maxWidth={260} 
                        offsetTBottom={-200}
                        center={true} 
                    />

                    {/* Tooltip for swap button */}
                    <Tooltip
                        position={positions.swap} 
                        text={TRANSLATOR_HELP_TEXT[userLang].swap} 
                        maxWidth={200} 
                        offsetTBottom={8}
                        center={true} 
                    />

                    {/* Tooltip for clean */}
                    <Tooltip
                        position={positions.x} 
                        text={TRANSLATOR_HELP_TEXT[userLang].clean} 
                        maxWidth={150} 
                        offsetTBottom={8}
                        center={true} 
                    />

                    {/* Tooltip for Mic */}
                    <Tooltip 
                        position={positions.mic}
                        text={TRANSLATOR_HELP_TEXT[userLang].mic}
                        maxWidth={200}
                        center={true}
                        adjustForLargeScreen={true}
                        largeScreenOffset={-38}
                        isLargeScreen={isLargeScreen}
                    />

                    {/* Tooltip for speak */}
                    <Tooltip 
                        position={positions.speak} 
                        text={TRANSLATOR_HELP_TEXT[userLang].speak} 
                        maxWidth={150} 
                        offsetTBottom={8}
                        center={true} 
                    />
                </div>
            )}
        </div>
    );
}