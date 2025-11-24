import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TOP_BUTTONS_MAP} from "../../utils/constants.js";
import EditableButton from "../../components/EditableButton.jsx"

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    const userLang = "es";
    const location = useLocation();
    const originalButtons = location.state.editableButtonsState;
    const [editedButtons, setEditedButtons] = useState(
        JSON.parse(JSON.stringify(originalButtons))
    );

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
            
            <div className="w-full flex justify-center mt-6">
                <div className="w-full max-w-xl space-y-4">
                    {editedButtons.map(btn => (
                        <EditableButton 
                            key={btn.id}
                            button={btn}
                            updateButton={updateButton}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}