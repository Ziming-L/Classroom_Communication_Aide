import React, { useState } from "react";
import GoBackButton from "../../components/GoBackButton";
import Profile from "../../components/Profile";
import { useNavigate,useLocation } from "react-router-dom";
import request from '../../utils/auth';


export default function CustomMessagePage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // get data from parent page
    const { request_id, created_at, student_name, student_icon, student_icon_bg_color, translate_text } = location.state || {};
    // if (!request_id) {
    //     return <p className="text-center mt-10 text-red-600">No request selected!</p>;
    // }

    const studentIcon = student_icon || "../images/user_profile_icon/woman_2.png";
    const studentIconColor = student_icon_bg_color || "#ffb6c1";
    const studentName = student_name || 'daisy';
    const requestText = translate_text || 'i need help'
    const timestamp = created_at ? new Date(created_at) : new Date();
    const displayTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const displayDate = timestamp.toLocaleDateString();

    const token = localStorage.getItem('token');
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        setContent("");
        navigate("/teacher");
    }

    const handleSend = async () => {
        if (!content.trim()) {
            return alert("Message cannot be empty");
        }

        setLoading(true);
        // try {
        //     const sent_at = new Date().toISOString();
        //     const data = await request("/api/teacher/approve-request-message", {
        //         method: "POST", 
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         },
        //         body: JSON.stringify({request_id, content, sent_at}),
        //     });

        //     console.log("Message to send: ", content);
        //     navigate("/teacher");
        // } catch (err) {
        //     console.error("Failed to send message:", err);
        //     alert("Error sending message: " + err.message);
        // } finally {
        //     setLoading(false);
        // }
        
        // for actual, uncomment above and delete below
        console.log("Content: " + content);
        handleCancel();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            {/* GoBackButton left and Profile right */}
            <div className="w-full flex justify-between items-center mb-4">
                <GoBackButton
                    label="Go Back"
                    fallback="/teacher"
                />
                <Profile />
            </div>
            <h1 className="text-center text-3xl font-bold mb-6">RESPONSE MESSAGE</h1>

            {/* Card Container */}
            <div className="
                w-full 
                max-w-md sm:max-w-5xl
                bg-yellow-100 border rounded-xl shadow p-6
                min-h-[500px]
                flex flex-col justify-between
            ">
                <div className="flex items-center gap-4 p-4 bg-yellow-200 rounded-lg">
                    <div className="w-16 h-16">
                        <Profile 
                            image={studentIcon}
                            color={studentIconColor}
                            size="68"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-xl font-bold">NAME: <span className="font-normal uppercase">{studentName}</span></p>
                        <p className="text-xl font-bold">REQUEST: <span className="font-normal uppercase">{requestText}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold">REQUEST TIME: <span className="font-normal">{displayTime}</span></p>
                        <p className="text-xl font-bold">REQUEST DATE: <span className="font-normal">{displayDate}</span></p>
                    </div>
                </div>

                {/* Message Box */}
                <textarea 
                    className="flex-1 mt-6 mb-6 bg-orange-100 rounded-xl p-4 border text-lg resize-none w-full"
                    placeholder="Type your message here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {/* Buttons */}
                <div className="flex justify-center gap-12 mt-6">
                    <button 
                        className="bg-red-400 text-white px-7 py-2 rounded-full text-lg shadow"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-green-500 text-white px-7 py-2 rounded-full text-lg shadow"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
}
