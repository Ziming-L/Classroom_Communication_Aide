// src/pages/SendPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SendActivity() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSend = () => {
        if (!message.trim()) return;
        // Navigate to inbox and pass message through router state
        navigate("/inbox", { state: { message } });
    };

    return (
        <div style={styles.container}>
            <h2>Update activity: </h2>
            <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleSend} style={styles.button}>Send</button>
        </div>
    );
}

const styles = {
    container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" },
    input: { width: "300px", height: "100px", padding: "10px", fontSize: "16px" },
    button: { marginTop: "10px", padding: "8px 16px", fontSize: "16px" },
};

export default SendPage;