import React, { useState } from "react";
import AddClassModal from "./AddClassModal";
import { formatUtcToLocal } from "../../utils/convertTime";
import request from "../../utils/auth";

export default function ClassQueue({ classes, setClasses }) {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAddClass = (newClass) => {
        setClasses(prev => [...prev, newClass]);
        setShowModal(false);
    };

    const handleDeleteClass = async (id, class_code) => {
        try {
            const res = await request("/api/teachers/delete-class", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    class_id: id,
                    class_code,
                }),
            });

            if (!res.success) {
                setError(res.message);
                setLoading(false);
                return;
            }

            setClasses(prev => prev.filter((c) => c.class_id !== id));
        } catch (err) {
            setError("Failed to delete class: ", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2><strong style={{ fontSize: "32px" }}>Current Classes:</strong></h2>

            <ul style={local.classBox}>
                {classes.map((c) => (
                    <li style={local.classEntry} key={c.class_id}>
                        <div >
                            <strong style={{ margin: "5px" }}>{c.class_name}</strong>  |  
                            <strong style={{ margin: "5px" }}>{c.class_code}</strong>  | 
                            <span style={{ margin: "5px" }} >{formatUtcToLocal(c.class_start)} - {formatUtcToLocal(c.class_end)} </span>
                            </div>
                        <button
                            onClick={() => handleDeleteClass(c.class_id, c.class_code)}
                            style={local.deleteButton}
                        >
                            {loading ? "Deleting..." : "Delete"}
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
        backgroundColor: "white", width: "600px", borderRadius: "10px",
    },
    classEntry: {
        borderRadius: "5px", backgroundColor: "#D3D3D3", padding: "10px",
        marginTop: "10px", border: "2px solid #333333",
        display: "flex", justifyContent: "space-between", fontSize: "24px"
    },
    addClassbutton: {
        borderRadius: "20px", marginTop: "10px", padding: "8px 16px",
        fontSize: "24px", background: "#88e788"
    },
    deleteButton: {
        background: "#ff4d4f",
        color: "white",
        border: "none",
        padding: "4px 8px",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: "18px",
    }
}
