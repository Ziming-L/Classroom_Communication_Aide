import React, { useState } from "react";

export default function ClassQueue() {
    const [classes, setClasses] = useState([]);
    const [input, setInput] = useState("");

    const addMessage = () => {
        if (!input.trim()) return;

        const newClass = {
            id: Date.now(),        // unique per message
            text: input.trim()
        };

        setClasses((prev) => [...prev, newClass]); // enqueue
        setInput("");
    };

    const deleteMessage = (id) => {
        setClasses((prev) => prev.filter((className) => className.id !== id));
    };

    return (
        <div style={styles.container}>
            <h2>Class Queue</h2>
            {/* Queue List */}
            <ul style={styles.list}>
                {classes.map((className) => (
                    <li key={className.id} style={styles.listItem}>
                        <span>{className.text}</span>
                        <button style={styles.deleteBtn} onClick={() => deleteMessage(className.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {/* Input + Add Button */}
            <div style={styles.inputRow}>
                <input
                    style={styles.input}
                    value={input}
                    placeholder="Enter a class"
                    onChange={(e) => setInput(e.target.value)}
                />
                <button style={styles.addBtn} onClick={addMessage}>Add</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "500px"
    },
    inputRow: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid gray"
    },
    addBtn: {
        padding: "10px 20px",
        borderRadius: "8px",
        background: "#4CAF50",
        color: "white",
        border: "none",
        cursor: "pointer"
    },
    list: {
        listStyle: "none",
        padding: 0
    },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        background: "#f3f3f3",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px"
    },
    deleteBtn: {
        background: "#E53935",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer"
    }
};
