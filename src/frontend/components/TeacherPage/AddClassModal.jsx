import React, { useState } from "react";

export default function AddClassModal({ onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");


    const handleSubmit = () => {
        if (!name.trim() || !startTime.trim() || !endTime.trim()) return;
        onSubmit({ name, startTime, endTime });
    };

    return (
        <div style={local.overlay}>
            <div style={local.modal}>
                <h3>Adding New Class...</h3>

                <label>
                    <strong>Class Name: </strong>
                    <input style={local.textBox}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label style={{ gap: "20px" }}>
                    <strong>Start Time: </strong>
                    <input style={local.textBox}
                        type="text"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </label>

                <label style={{ gap: "20px" }}>
                    <strong>End Time: </strong>
                    <input style={local.textBox}
                        type="text"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </label>

                <div style={local.buttons}>
                    <button style={local.cancelButton} onClick={onClose}>Cancel</button>
                    <button style={local.addClassbutton} onClick={handleSubmit}>OK</button>
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
        borderRadius: "5px", width: "100%", height: "40px",
        padding: "10px", fontSize: "18px", background: "#D3D3D3"
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
