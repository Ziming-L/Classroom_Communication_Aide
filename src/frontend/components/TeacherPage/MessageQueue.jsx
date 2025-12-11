/*
 * component for the incoming student message queue in the main teacher page
 */
import { useState } from "react";
import StudentMessage from "./StudentMessage";

export default function MessageQueue({ messages, setMessages }) {

    const clearMessage = (id) => {
        alert("clearing message");
        setMessages((prev) => prev.filter((message) => message.id !== id));
    };

    const respondToMessage = (id) => {
        alert("Responding to message " + id);
    };

    return (
        <div>
            {messages.map(msg => (
                <StudentMessage
                    key={msg.id}
                    message={msg.payload}
                    onClear={() => clearMessage(msg.id)}
                    onRespond={respondToMessage}
                />
            ))}
        </div>
    );
}
