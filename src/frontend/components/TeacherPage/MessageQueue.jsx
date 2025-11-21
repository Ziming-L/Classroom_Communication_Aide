import { useState, useEffect, useRef } from "react";

export default function Inbox() {
    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:4000");

        ws.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === "NEW_MESSAGE") {
                setMessages(prev => [...prev, msg]);
            }

            if (msg.type === "DELETE_MESSAGE") {
                setMessages(prev => prev.filter(m => m.id !== msg.id));
            }
        };

        return () => ws.current.close();
    }, []);

    const deleteMessage = (id) => {
        ws.current.send(JSON.stringify({ type: "DELETE_MESSAGE", id }));
    };

    return (
        <div style={styles.container}>
            <h2>Inbox</h2>

            {messages.length === 0 && (
                <p style={styles.empty}>No messages yet...</p>
            )}

            <ul style={styles.list}>
                {messages.map(msg => (
                    <li key={msg.id} style={styles.item}>
                        <div>
                            <div style={styles.sender}>{msg.from}</div>
                            <div>{msg.text}</div>
                        </div>

                        <button style={styles.deleteBtn} onClick={() => deleteMessage(msg.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        padding: "2rem",
        maxWidth: "500px",
        fontFamily: "sans-serif"
    },
    list: {
        listStyle: "none",
        padding: 0,
        marginTop: "1.5rem"
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        background: "#f5f5f5",
        borderRadius: "8px",
        marginBottom: "10px"
    },
    sender: {
        fontWeight: "bold",
        marginBottom: "6px"
    },
    deleteBtn: {
        background: "#e63946",
        color: "white",
        padding: "6px 10px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer"
    },
    empty: {
        color: "#666",
        marginTop: "1rem"
    }
};
