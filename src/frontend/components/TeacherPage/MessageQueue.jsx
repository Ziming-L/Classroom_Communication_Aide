/*
 * component for the incoming student message queue in the main teacher page
 */
import { useState } from "react";
import StudentMessage from "./StudentMessage";

export default function MessageQueue() {
    const [messages, setMessages] = useState([]);

    const testMessages = [
        {
            id: 1,
            name: "Batman",
            message: "I need help!",
            studentColor: "#A8DCAB",
            time: "(3m)"
        },
        {
            id: 2,
            name: "Walter White",
            message: "I need to go to the bathroom",
            studentColor: "#FFCCCB",
            time: "(2m)"
        },
        {
            id: 3,
            name: "Jesse",
            message: "I need to cook",
            studentColor: "#b5e2ff",
            time: "(1m)"
        }
    ]

    const clearMessage = (id) => {
        alert("clearing message");
        setMessages((prev) => prev.filter((message) => message.id !== id));
    };

    const respondToMessage = (id) => {
        alert("Responding");
    };

    return (
        <div>
            {testMessages.map(msg => (
                <StudentMessage
                    key={msg.id}
                    message={msg}
                    onClear={clearMessage}
                    onRespond={respondToMessage}
                />
            ))}
        </div>
    );
}
