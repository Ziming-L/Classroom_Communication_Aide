import React, { useState } from "react";
import AddClassModal from "./AddClassModal";

export default function ClassQueue() {
    const [classes, setClasses] = useState([
        { id: 1, name: "Math 101", startTime: "9:00 AM", endTime: "10:50 AM" },
        { id: 2, name: "Science 201", startTime: "11:00 AM", endTime: "11:50 AM" },
    ]);

    const [showModal, setShowModal] = useState(false);

    const handleAddClass = (newClass) => {
        setClasses([...classes, newClass]);
        setShowModal(false);
    };

    const handleDeleteClass = (id) => {
        //TODO: are you sure pop up window?
        setClasses(classes.filter((c) => c.id !== id));
    };

    return (
        <div style={{ padding: 20 }}>
            <h2><strong>Current Classes:</strong></h2>

            <ul style={local.classBox}>
                {classes.map((c, i) => (
                    <li style={local.classEntry} key={i}>
                        <h2><strong>{c.name}</strong> | {c.startTime} - {c.endTime}</h2>
                        <button
                            onClick={() => handleDeleteClass(c.id)}
                            style={local.deleteButton}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <button style={local.addClassbutton} onClick={() => setShowModal(true)}>
                Add Class
            </button>

            {showModal && (
                <AddClassModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddClass}
                />
            )}
        </div>
    );
}
const local = {
    classBox: {
        backgroundColor: "white", width: "500px", borderRadius: "10px",
    },
    classEntry: {
        borderRadius: "5px", backgroundColor: "#D3D3D3", padding: "10px",
        marginTop: "10px", border: "2px solid #333333", borderRadius: "8px",
        display: "flex", justifyContent: "space-between"
    },
    addClassbutton: {
        borderRadius: "20px", marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#88e788"
    },
    deleteButton: {
        background: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "4px 8px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: "0.8rem",
    }
}
