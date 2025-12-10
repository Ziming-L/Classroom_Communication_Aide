import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TOP_BUTTONS_MAP, BUTTON_EDITOR_TEXT} from "../../utils/constants.js";
import EditableButton from "../../components/EditableButton.jsx";
import { translateText } from "../../utils/translateText.js";
import request from "../../utils/auth.js";

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    
    const location = useLocation();
    const studentInfo = location.state?.studentInfo;
    const userLang = studentInfo?.language_code || "es";
    const originalButtons = location.state?.editableButtonsState ?? [];
    const [editedButtons, setEditedButtons] = useState(
        JSON.parse(JSON.stringify(originalButtons))
    );

    const colorOptions = ["#c6ddff", "#e7e7e7", "#dfdaff", "#f0fcf6"];
    const iconOptions = ["/images/commands_icon/glasses.png", 
        "/images/commands_icon/computer_moving.png",
        "/images/commands_icon/pencil.png",
        "/images/commands_icon/raining.png"
    ];

    // update the buttons in database
    const saveChangesBackend = async () => {
        try {
            for (const btn of editedButtons) {
                await request(`/api/students/update-command/${btn.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        command_text: btn.userLangText,
                        translated_text: btn.targetLangText, // doesn't update in backend?
                        command_color: btn.color,
                        command_image: `..${btn.img}`,
                    })
                });
            }

            navigate("/student");
        } 
        catch (err) {
            console.error("Did not save command:", err);
            alert("Failed to save the changes");
        }
    };
 
    const updateButton = (id, fields) => {
        setEditedButtons(prev =>
            prev.map(b =>
                b.id === id ? { ...b, ...fields } : b
            )
        );
    };

    // translate text from user lang to "en"
    // maybe get the teacher language here from parent page and change the "en"
    const handleUserLangUpdateText = async (id, text) => {
        updateButton(id, { userLangText: text });

        if (!text.trim()) {
            updateButton(id, { targetLangText: ""});
            return;
        }

        try {
            const translated = await translateText(text, userLang, "en");
            updateButton(id, { targetLangText: translated });
        } catch (err) {
            console.error("Translation failed in CommandEditPage.jsx: ", err);
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => returnToDashboard()} className="
                    bg-purple-600 text-white 
                    text-sm sm:text-base
                    px-3 py-1.5 sm:px-5 sm:py-2 
                    rounded-full 
                    shadow-md 
                    hover:bg-purple-700">
                    {TOP_BUTTONS_MAP[userLang]?.goBack}
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-full" onClick={saveChangesBackend}> 
                    {BUTTON_EDITOR_TEXT[userLang]?.save}
                </button>
            </div>
            
            <div className="flex flex-col items-center mt-4">
                <div className="w-full max-w-2xl space-y-6">
                    {editedButtons.map(button => (
                        <div 
                            key={button.id}
                            className={"p-4 rounded-lg shadow"}
                            style={{ backgroundColor: button.color }}
                        >
                            <div>
                                <p>{BUTTON_EDITOR_TEXT[userLang]?.description}</p>
                                <input
                                    className="w-full border p-2 rounded mb-2"
                                    value={button.userLangText}
                                    onChange={(e) => handleUserLangUpdateText(button.id, e.target.value)}
                                />
                            </div>

                            <div>
                                <p>{BUTTON_EDITOR_TEXT[userLang]?.translation}</p>
                                <input
                                    className="w-full border p-2 rounded mb-2"
                                    value={button.targetLangText}
                                    readOnly
                                />
                            </div>

                            <p className="text-sm">{BUTTON_EDITOR_TEXT[userLang]?.icon}</p>
                            <div className="flex gap-3 flex-wrap mb-4">
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() =>
                                            updateButton(button.id, { img: icon })
                                        }
                                        className={`p-1 rounded-lg border ${
                                            button.img === icon
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={icon}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </button>
                                ))}
                            </div>

                            <p className="text-sm">{BUTTON_EDITOR_TEXT[userLang]?.color}</p>
                            <div className="flex gap-3 mb-4">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        className="w-8 h-8 rounded-full border"
                                        style={{ backgroundColor: color }}
                                        onClick={() =>
                                            updateButton(button.id, { color })
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}