import { useState } from "react";
import styles from "./styles.module.css";

export default function StudentMessage({ message, onClear, onRespond }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid #ddd",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            backgroundColor: message.studentColor
        }}>
            <div style={{ width: "500px" }}><strong>{message.name}</strong> : {message.message}</div>

            <div className={styles.headerButtons}>
                <button style={local.approveButton} onClick={() => onClear(message.id)}>Allow</button>
                <button style={local.respondButton} onClick={() => onRespond(message.id)}>Respond</button>
            </div>
            <div style={{ fontSize: "16px", color: "#555" }}>
                {message.time}
            </div>
        </div >
    );
}

const local = {
    approveButton: {
        borderRadius: '10px', marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#FFC067", gap: "10px"
    },
    respondButton: {
        borderRadius: '10px', marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#EF8490", gap: "10px"
    },
    buttons: { marginTop: "10px", display: "flex", gap: "10px" }
}