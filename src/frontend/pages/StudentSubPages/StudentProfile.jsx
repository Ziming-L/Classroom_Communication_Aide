import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useLayoutEffect } from "react";
import { TOP_BUTTONS_MAP} from "../../utils/constants.js";

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    const userLang = "es";

    const [name, setName] = useState("");
    const [profileColor, setProfileColor] = useState("#8b5cf6");
    const [avatar, setAvatar] = useState("../../images/user_profile_icon/baby_chick_1.png");

    
    const avatarOptions = ["../../images/user_profile_icon/baby_chick_1.png", "../../images/user_profile_icon/cat_1.png"];
    const colorOptions = ["#8b5cf6", "#f59e0b", "#10b981"];

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
                <h1 className="text-2xl text-center font-bold">Profile</h1>
                <div 
                    className="p-6 rounded-xl shadow-md w-full max-w-lg"
                >
                    <div className="flex justify-center mb-4">
                        <div className="text-6xl text-center mb-4">
                            <img 
                                src={avatar}
                                alt="Avatar"
                                className="w-32 h-32 object-contain rounded-full"
                                style={{ backgroundColor: profileColor }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            className="w-full border rounded px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        {avatarOptions.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAvatar(a)}
                                className={`p-1 rounded-lg border ${
                                    avatar === a ? "border-black" : "border-transparent"
                                }`}
                            >
                                <img 
                                    src={a}
                                    alt="avatar option"
                                    className="w-12 h-12 object-contain rounded-full"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block font-medium mb-2">Color</label>
                        <div className="flex gap-3">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className="w-10 h-10 rounded-full border"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setProfileColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        save
                    </button>
                </div>
            </div>
        </div>
    );
}