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
                <h1 style={{ fontSize: "18px" }}>
                    Profile Page
                </h1>
                <button className={styles.profileButton} onClick={() => goToProfile()}>
                    <Profile />
                </button>
            </header>
            <ClassQueue />
        </div>
    )
}

const local = {
    ActivityContainer: { display: "flex", flexDirection: "row", marginTop: "20px", alignItems: "center", gap: "20px" },
    inputBox: { borderRadius: '10px', width: "1000px", height: "40px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    headerContainer: { display: "flex", marginbottom: "1.5rem", justifyContent: 'space-between', alignitems: "center" },
    headerButtons: { display: "flex", alignItems: "Center", gap: "10px" }
};