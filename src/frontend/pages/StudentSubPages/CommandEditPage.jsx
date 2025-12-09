import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TOP_BUTTONS_MAP} from "../../utils/constants.js";
import EditableButton from "../../components/EditableButton.jsx"

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    const userLang = "es";
    const location = useLocation();
    //const originalButtons = location.state.editableButtonsState;
    const originalButtons = location.state?.editableButtonsState ?? [];
    const [editedButtons, setEditedButtons] = useState(
        JSON.parse(JSON.stringify(originalButtons))
    );

    const colorOptions = ["#c6ddff", "#e7e7e7", "#dfdaff", "#f0fcf6"];
    const iconOptions = ["../images/commands_icon/glasses.png", 
        "../images/commands_icon/computer_moving.png",
        "../images/commands_icon/pencil.png",
        "../images/commands_icon/raining.png"
    ];

 
    const updateButton = (id, fields) => {
        setEditedButtons(prev =>
            prev.map(b =>
                b.id === id ? { ...b, ...fields } : b
            )
        );
    };

    const saveChanges = () => {
        navigate("/student", { state: { updatedButtons: editedButtons } });
    };

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
                <button className="bg-green-500 text-white px-4 py-2 rounded-full" onClick={saveChanges}> 
                    Save Changes
                </button>
            </div>
            
            <div className="flex flex-col items-center mt-4">
                <div className="w-full max-w-2xl space-y-6">
                    {editedButtons.map(button => (
                        <div 
                            key={button.id}
                            className={`${button.color} p-4 rounded-lg shadow"`}
                        >
                            <div>
                                <p>Description:</p>
                                <input
                                    className="w-full border p-2 rounded mb-2"
                                    value={button.userLangText}
                                    onChange={(e) => updateButton(button.id, { userLangText: e.target.value })}
                                />
                            </div>

                            <div>
                                <p>Translation:</p>
                                <input
                                    className="w-full border p-2 rounded mb-2"
                                    value={button.targetLangText}
                                    onChange={(e) => updateButton(button.id, { targetLangText: e.target.value })}
                                />
                            </div>

                            <p className="text-sm">Icon:</p>
                            <div className="flex gap-3 flex-wrap mb-4">
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() =>
                                            updateButton(button.id, { icon })
                                        }
                                        className={`p-1 rounded-lg border ${
                                            button.icon === icon
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

                            <p className="text-sm">Color:</p>
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