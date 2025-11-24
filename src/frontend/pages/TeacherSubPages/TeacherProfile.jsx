import React from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile";
import ClassQueue from "../../components/TeacherPage/ClassQueue";
import styles from "../../components/TeacherPage/styles.module.css"

export default function TeacherProfile() {
    const navigate = useNavigate();

    const returnToTeacher = () => navigate("/teacher");
    const goToAllStudent = () => navigate("/teacher/allstudents");
    const goToRequestLog = () => navigate("/teacher/requestlogs");

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => returnToTeacher()} className={styles.button}>
                    Back to Main
                </button>
                <h1 style={{ fontSize: "20px" }}>
                    Profile Page
                </h1>
                <button className={styles.profileButton} onClick={() => goToProfile()}>
                    <Profile />
                </button>
            </header>
            <div style={local.queue}>
                <ClassQueue />
            </div>
        </div>
    )
}

const local = {
    queue: { display: "flex", justifyContent: "center" }
};