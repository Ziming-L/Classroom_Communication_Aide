import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom React hook for speech-to-text using the Web Speech API.
 *
 * @param {function(string):void} onResult - Callback fired with the recognized transcript.
 * @param {string} [lang = "en-US"] - Language code for recognition ("en-US", "es-ES", etc).
 * @param {function():void} [onEndCallback] - Optional callback when speech recognition ends.
 * 
 * @returns {Object} An object with:
 *  - startListening: function to start recognition
 *  - stopListening: function to stop recognition
 *  - isListening: boolean flag indicating if recognition is on
 */
export default function useSpeechToText(onResult, lang = "en-US", onEndCallback) {
    const [isListening, setIsListening] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const recognitionRef = useRef(null);

    // Prevent rapid double clicks
    const withCooldown = useCallback(
        (fn) => {
            if (cooldown) return false;
            fn();
            setCooldown(true);
            setTimeout(() => setCooldown(false), 300);
            return true;
        },
        [cooldown]
    );

    // Start listening
    const startListening = useCallback(() => {
        withCooldown(() => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser.");
                return;
            }

            // Create a recognition instance
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;
            recognition.lang = lang;
            recognition.continuous = true;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const lastResult = event.results[event.results.length - 1];
                const transcript = lastResult[0].transcript;
                onResult(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                recognitionRef.current = null;
                if (onEndCallback) onEndCallback();
            };

            recognition.start();
        } catch (err) {
            console.error("Failed to start speech recognition:", err);
            setIsListening(false);
        }
        });
    }, [lang, onResult, withCooldown, onEndCallback]);

    // Stop listening safely
    const stopListening = useCallback(() => {
        withCooldown(() => {
            const rec = recognitionRef.current;
            if (!rec) return;

            try {
                rec.onresult = null;
                rec.onerror = null;
                rec.onend = null;

                if (isListening && typeof rec.stop === "function") {
                    rec.stop();
                } else if (typeof rec.abort === "function") {
                    rec.abort();
                }

                recognitionRef.current = null;
                setIsListening(false);
            } catch (err) {
                console.error("Error stopping recognition:", err);
            }
        });
    }, [isListening, withCooldown]);

    // secure cleanup
    useEffect(() => {
        return () => {
            const rec = recognitionRef.current;
            if (rec) {
                rec.onresult = null;
                rec.onerror = null;
                rec.onend = null;
                rec.abort?.();
            }
        };
    }, []);

    return { startListening, stopListening, isListening };
}
