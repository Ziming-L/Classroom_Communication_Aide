import { useState, useRef, useEffect, useLayoutEffect } from "react";
import TranslatorBox from "../components/TranslatorBox";
import SwapButton from "../components/SwapButton";
import { translateText } from "../utils/translateText.js";
import Tooltip from "../components/Tooltip.jsx";
import { TOP_BUTTONS_MAP, TRANSLATOR_HELP_TEXT } from "../utils/constants.js";

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
    const [leftLang, setLeftLang] = useState("es");
    const [rightLang, setRightLang] = useState("en");
    const [leftText, setLeftText] = useState("");
    const [rightText, setRightText] = useState("");
    const [activeInput, setActiveInput] = useState("left");
    const [showHelp, setShowHelp] = useState(false);

    // user language
    const userLang = "es";

    const backBtnRef = useRef(null);
    const helpBtnRef = useRef(null);
    const micRef = useRef(null);
    const xRef = useRef(null);
    const speakRef = useRef(null);
    const swapRef = useRef(null);
    const inputRef = useRef(null);

    const [positions, setPositions] = useState({});

    useLayoutEffect(() => {
        if (showHelp) {
            const newPositions = {
                back: backBtnRef.current?.getBoundingClientRect(),
                help: helpBtnRef.current?.getBoundingClientRect(),
                mic: micRef.current?.getBoundingClientRect(),
                x: xRef.current?.getBoundingClientRect(),
                speak: speakRef.current?.getBoundingClientRect(),
                swap: swapRef.current?.getBoundingClientRect(),
                input: inputRef.current?.getBoundingClientRect(),
            };
            setPositions(newPositions);
        }
    }, [showHelp]);

    useEffect(() => {
        if (showHelp) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showHelp]);

    useEffect(() => {
        const handleResize = () => {
            if (showHelp) {
                const newPositions = {
                    back: backBtnRef.current?.getBoundingClientRect(),
                    help: helpBtnRef.current?.getBoundingClientRect(),
                    mic: micRef.current?.getBoundingClientRect(),
                    x: xRef.current?.getBoundingClientRect(),
                    speak: speakRef.current?.getBoundingClientRect(),
                    swap: swapRef.current?.getBoundingClientRect(),
                    input: inputRef.current?.getBoundingClientRect(),
                };
                setPositions(newPositions);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [showHelp]);

    const handleTranslate = async (text) => {
        if (!text.trim()) {
            if (activeInput === "left") {
                setRightText("");
            } else {
                setLeftText("");
            }
            return;
        }

        const from = activeInput === "left" ? leftLang : rightLang;
        const to = activeInput === "left" ? rightLang : leftLang;

        try {
            const result = await translateText(text, from, to);
            if (activeInput === "left") {
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

    const isLargeScreen = window.innerWidth >= 768;

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-50">

            {/* top bar */}
            <div className="flex justify-between items-center w-full px-8">
                <button 
                    ref={backBtnRef}
                    className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-purple-700">
                    {TOP_BUTTONS_MAP[userLang]?.goBack}
                </button>
                <button 
                    ref={helpBtnRef}
                    onClick={() => setShowHelp(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800">
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
                        setActiveInput("left");
                        setLeftText(val);
                        handleTranslate(val);
                    }}
                    onActivate={() => setActiveInput("left")}
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
                        setActiveInput("right");
                        setRightText(val);
                        handleTranslate(val);
                    }}
                    onActivate={() => setActiveInput("right")}
                    onClear={handleClearBoth}
                />
            </div>

            {/* help overlay */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50">
                    {/* Close button */}
                    <button
                        onClick={() => setShowHelp(false)}
                        className="absolute top-7 right-15 bg-white/70 text-black px-3 py-1 rounded-md shadow-md hover:bg-white"
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
                        offsetTBottom={-250}
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