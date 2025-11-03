// import images
import MicIcon from "../images/translate_screen/microphone.png"
import VolumeIcon from "../images/translate_screen/sound.png"
import XIcon from "../images/translate_screen/x.png"
import StopIcon from "../images/translate_screen/stop.png"
import useSpeechToText from "../hooks/useSpeechToText.js";
import { LANGUAGE_NAMES, TRANSLATOR_LANGUAGE_PLACEHOLDERS, LANGUAGE_SPEECH_CODE } from "../utils/constants.js";

import { useState, useEffect } from "react";
import { useRef } from "react";

/**
 * TranslatorBox component
 *
 * Renders a text area for translation along with control buttons for:
 * - Clearing text
 * - Speech-to-text input (microphone)
 * - Text-to-speech output (speak)
 *
 * @param {Object} props
 * @param {string} props.language - Language code ("es", "en", etc)
 * @param {string} props.color - Color theme for the box ("yellow" or "blue")
 * @param {string} props.text - Current text in the translator box
 * @param {function} props.onChange - Callback when text changes
 * @param {function} props.onClear - Callback to clear the text
 * @param {function} props.onActivate - Callback when the input is activated (focused)
 * @param {React.Ref} props.inputRef - Ref for the textarea element
 * @param {React.Ref} props.micRef - Ref for the microphone button
 * @param {React.Ref} props.xRef - Ref for the clear button
 * @param {React.Ref} props.speakRef - Ref for the speak button
 *
 * @returns {JSX.Element} A translator box with text area and controls
 */
export default function TranslatorBox({ language, color, text, onChange, onClear, onActivate, inputRef, micRef, xRef, speakRef}) {
    const colorMap = {
        yellow: "bg-yellow-100 border-yellow-300", 
        blue: "bg-blue-100 border-blue-300",
    };

    const displayName = LANGUAGE_NAMES[language];
    const placeholder = TRANSLATOR_LANGUAGE_PLACEHOLDERS[language];
    const speechCode = LANGUAGE_SPEECH_CODE[language];

    const [isSpeaking, setIsSpeaking] = useState(false);
    const textRef = useRef(text);
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    const { startListening, stopListening, isListening } = useSpeechToText(
        (speechText) => {
            const current = textRef.current || "";
            const newText = (current.trim() ? current + " " : current) + speechText;
            onActivate?.();
            onChange(newText);
        },
        speechCode,
        () => {
            onActivate?.();
            onChange(textRef.current || "");
        }
    );

    // stop when change to another language during mic recording
    useEffect(() => {
        stopListening();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const handleMicClick = () => {
        onActivate?.();
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSpeakClick = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = speechCode;
            utterance.onend = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        }
    };
    
    const prevTextRef = useRef(text);
    useEffect(() => {
        if (isListening && prevTextRef.current.trim() && !text.trim()) {
            stopListening();
        }
        prevTextRef.current = text;
    }, [text, isListening, stopListening]);

    return (
        <div className={`flex flex-col flex-1 p-6 rounded-2xl border-2 shadow-md ${colorMap[color]} || bg-gray-100 h-[75vh] max-h-[80vh] w-full md:flex-1`}>
            <h2 className="text-center text-xl font-semibold mb-3">{displayName}</h2>
            <textarea 
                ref={inputRef}
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="flex-grow w-full p-4 rounded-md border border-gray-300 bg-transparent focus:outline-none resize-none text-lg leading-relaxed min-h-[300px]"
                placeholder={placeholder} 
                />
            <div className="flex justify-between items-center mt-6">
                {/* Clear button */}
                <button 
                    ref={xRef}
                    onClick={onClear} className="hover:opacity-70">
                    <img src={XIcon} alt="Clear" className="w-12 h-12"/>
                </button>
                {/* Microphone / Stop button */}
                <button 
                    ref={micRef}
                    onClick={handleMicClick} className="hover:opacity-70 relative">
                    <img 
                        src={isListening ? StopIcon : MicIcon} 
                        alt={isListening ? "Stop Listening" : "Mic"}
                        className={`w-12 h-12 transition-all duration-200 ${
                            isListening ? "opacity-90 scale-110 animate-pulse" : ""
                        }`}
                    />
                </button>
                {/* Speak / Stop button */}
                <button 
                    ref={speakRef}
                    onClick={handleSpeakClick} className="hover:opacity-70 relative">
                    <img 
                        src={isSpeaking ? StopIcon : VolumeIcon} 
                        alt={isSpeaking ? "Stop Speaking" : "Speak"}
                        className="w-12 h-12 transition-all duration-200"
                    />
                </button>
            </div>
        </div>
    );
}