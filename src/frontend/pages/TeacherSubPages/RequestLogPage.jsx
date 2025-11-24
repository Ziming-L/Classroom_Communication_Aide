import React from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile"
import styles from "../../components/TeacherPage/styles.module.css"
import StudentMessage from "../../components/TeacherPage/StudentMessage.jsx"


export default function RequestLogPage() {
    const navigate = useNavigate();

    const returnToTeacher = () => navigate("/teacher");
    const goToProfile = () => navigate("/teacher/profile");

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

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => returnToTeacher()} className={styles.button}>
                    Back to Main
                </button>
                <h1 className="text-2xl"> Request Log </h1>
                <div className={styles.headerButtons}>
                    {/* Profile */}
                    <button className={styles.profileButton} onClick={() => goToProfile()}>
                        <Profile />
                    </button>
                </div>
            </header>
            <div>
                {testMessages.map(msg => (
                    <StudentMessage
                        key={msg.id}
                        message={msg}
                        onClear={null}
                        onRespond={null}
                    />
                ))}
            </div>
        </div>
    )
}

const local = {
    page: { display: "flex", flexDirection: "column", padding: "2rem", width: "full", position: "relative" },
};