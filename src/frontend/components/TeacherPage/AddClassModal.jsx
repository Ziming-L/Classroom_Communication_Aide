import React, { useState } from "react";
import request from "../../utils/auth";
import { convertToUTCTime } from "../../utils/convertTime";

export default function AddClassModal({ onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [classCode, setClassCode] = useState(null);

    const handleSubmit = async () => {
        if (!name.trim() || !startTime.trim() || !endTime.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await request("/api/teachers/create-class", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    class_name: name.trim(),
                    class_start: convertToUTCTime(startTime),
                    class_end: convertToUTCTime(endTime),
                }),
            });

            if (!res.success) {
                setError(res.message);
                setLoading(false);
                return;
            }

            const createdClass = res.class;
            setClassCode(createdClass.class_code);

            // update parent list
            onSubmit(createdClass);
        } catch (err) {
            setError("Failed to create class: ", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={local.overlay}>
            <div style={local.modal}>
                <h3>Adding New Class...</h3>

                <label>
                    <strong style={{ fontSize: "24px" }}>Class Name: </strong>
                    <input style={local.textBox}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label style={{ gap: "20px" }}>
                    <strong style={{ fontSize: "24px" }}>Start Time: </strong>
                    <input style={local.textBox}
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </label>

                <label style={{ gap: "20px" }}>
                    <strong style={{ fontSize: "24px" }}>End Time: </strong>
                    <input style={local.textBox}
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </label>

                {error && (
                    <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {classCode && (
                    <div style={{ color: "green", fontSize: "18px" }}>
                        ✅ Class Code: <strong>{classCode}</strong>
                    </div>
                )}

                <div style={local.buttons}>
                    <button 
                        style={local.cancelButton} 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        style={local.addClassbutton} 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

const local = {
    cancelButton: {
        borderRadius: "20px", marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#FF7F7F", width: "100px"
    },
    addClassbutton: {
        borderRadius: "20px", marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#88e788", width: "100px"
    },
    textBox: {
        borderRadius: "5px", width: "100%", height: "50px",
        padding: "10px", fontSize: "24px", background: "#D3D3D3"
    },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        background: "white",
        padding: 20,
        borderRadius: 8,
        minWidth: 300,
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
    },
};
