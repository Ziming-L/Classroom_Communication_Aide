import { speak, stopSpeaking } from "../utils/speechSynthesis";
import { useState } from "react";
import request from "../utils/auth";

export default function CommandPopUp({
    visible,
    onClose,
    onSend,
    command,
    mode,
    textTranslations,
    classId
}) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    if (!visible) return null;

    const handleSpeak = () => {
        if (!isSpeaking) {
            speak(command.targetLangText, "en-US", {
                onSpeak: () => setIsSpeaking(true),
                onStop: () => setIsSpeaking(false)
            });
        } else {
            stopSpeaking();
            setIsSpeaking(false);
        }
    };

    const sendRequest = async () => {
        try {
            const response = await request("/api/students/create-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    command_id: command.id,
                    class_id: classId,
                })
            });

            if (response.success) {
                alert("Sent request to teacher!");
                onSend();
            }
            onClose();
        } 
        catch (err) {
            console.error("Failed to create request:", err);
            alert("Unable to send request to teacher.");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 scale-150">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                <button onClick={onClose} className="
                        bg-purple-600 text-white
                        text-xs
                        px-2 py-1 
                        rounded-full
                        shadow-sm
                        hover:bg-purple-700"> 
                    {textTranslations.goBack} 
                </button>

                {mode === "star" && ( <h2 className="text-xl font-semibold mt-3">{textTranslations.starHeader}</h2> )}
                <div className="flex flex-row justify-between items-start gap-6 mt-4">
                    <div className="text-black rounded border-2 border-blue-500 flex flex-col items-center justify-center text-center w-40 h-40">
                        <span className="text-sm">{command.userLangText}</span>
                            <img
                                src={command.img}
                                alt="button image"
                                className="w-12 h-12 my-2"
                            />
                        <span className="text-sm">{command.targetLangText}</span>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                        {mode === "normal" ? ( <> 
                            <button onClick={onClose} className="bg-[#ffe57f] hover:bg-yellow-400 border text-black py-2 px-4 rounded-lg w-full">{textTranslations.tryOnOwn}</button> 
                            <button onClick={sendRequest} className="bg-[#afa4f3] hover:bg-purple-400 border text-black py-2 px-4 rounded-lg w-full">{textTranslations.sendToTeacher}</button>
                            </> ) 
                            : 
                            ( <> 
                            <button onClick={onClose} className="bg-[#c3f3d8] hover:bg-green-400 border text-black py-2 px-4 rounded-lg w-full">{textTranslations.yesTry}</button> 
                            <button onClick={sendRequest} className="bg-[#ff9493] hover:bg-red-400 border text-black py-2 px-4 rounded-lg w-full">{textTranslations.noTry}</button> 
                            </> )
                        }
                        <button className="bg-[#c7c6c6] hover:bg-gray-400 border text-black py-2 px-4 rounded-lg w-full"onClick={handleSpeak}>
                            {isSpeaking ? textTranslations.stopPlaying : textTranslations.playOutLoud}
                        </button> 
                    </div>

                </div>
            </div>
        </div>
    );
}