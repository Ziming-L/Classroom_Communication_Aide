import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useRef, useLayoutEffect } from "react";
import { TOP_BUTTONS_MAP, STUDENT_PROFILE_TEXT} from "../../utils/constants.js";
import Profile from "../../components/Profile.jsx";
import AvatarSelector from "../../components/AvatarSelector.jsx";
import ColorSelector from "../../components/ColorSelector.jsx";
import request from "../../utils/auth.js";

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    const { state } = useLocation();
    const studentInfo = state?.studentInfo;
    const userLang = studentInfo?.language_code;

    const [name, setName] = useState(studentInfo?.student_name);
    const [profileColor, setProfileColor] = useState(studentInfo?.student_icon_bg_color);
    const [avatar, setAvatar] = useState(studentInfo?.student_icon);


    const handleSave = async () => {
        try {
            const data = await request("/api/students/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    student_name: name,
                    student_icon: avatar,
                    student_icon_bg_color: profileColor,
                }),
            });
            navigate("/student");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    // NOTES; backend expect "../images/ ..." not "../../images ..."
    return (
        <div className="p-8">
            <button onClick={() => returnToDashboard()} className="
                bg-purple-600 text-white 
                text-sm sm:text-base
                px-3 py-1.5 sm:px-5 sm:py-2 
                rounded-full 
                shadow-md 
                hover:bg-purple-700">
                {TOP_BUTTONS_MAP[userLang]?.goBack}
            </button>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl text-center font-bold">{STUDENT_PROFILE_TEXT[userLang]?.profile}</h1>
                <div 
                    className="p-6 rounded-xl shadow-md w-full max-w-lg"
                >
                    <div className="flex justify-center mb-4">
                        <div className="text-6xl text-center mb-4">
                            <Profile 
                                image={avatar}
                                color={profileColor}
                                size={135}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">{STUDENT_PROFILE_TEXT[userLang]?.name}</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <AvatarSelector 
                        avatar={avatar}
                        onChange={setAvatar}
                        pathPrefix=""
                    />

                    <div className="mb-6">
                        <label className="block font-medium mb-2">{STUDENT_PROFILE_TEXT[userLang]?.color}</label>
                        <ColorSelector 
                            color={profileColor}
                            onChange={setProfileColor}
                        />
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        {STUDENT_PROFILE_TEXT[userLang]?.save}
                    </button>
                </div>
            </div>
        </div>
    );
}