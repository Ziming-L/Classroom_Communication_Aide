import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile"
import StudentEntryList from "../../components/TeacherPage/StudentEntryList";
import StudentEntry from "../../components/TeacherPage/StudentEntry";

export default function AllStudentPage() {
    const navigate = useNavigate();

    const returnToTeacher = () => navigate("/teacher");
    const goToProfile = () => navigate("/teacher/profile");
    const goToRequestLog = () => navigate("/teacher/requestlogs");

    return (
        <div style={styles.page}>
            <header style={styles.headerContainer}>
                <button onClick={() => returnToTeacher()} style={styles.button}>
                    Back to Main
                </button>
                <h1> All Student View </h1>
                <div>
                    <button onClick={() => goToRequestLog()} style={styles.button}>
                        Request Logs
                    </button>

                    <button onClick={() => goToProfile()}>
                        <Profile />
                    </button>
                </div>
            </header>
            <div className="mx-20">
                <div className="items-center p-5 flex flex-row justify-center bg-white">
                    <h2 className="m-3 p-3 text-5xl font-light text-center">Student List For: </h2>
                    <h2 className="w-min m-3 p-3 text-5xl font-light text-center bg-gray-200 rounded-xl">v4KL0e</h2>
                </div>
                <StudentEntryList />
            </div>
        </div>
    )
}

const styles = {
    page: { display: "flex", flexDirection: "column", padding: "2rem", width: "full", position: "relative" },
    ActivityContainer: { display: "flex", flexDirection: "row", marginTop: "20px", alignItems: "center", gap: "20px" },
    inputBox: { borderRadius: '10px', width: "1000px", height: "40px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    button: { borderRadius: '20px', marginTop: "10px", padding: "8px 16px", fontSize: "16px", background: "#ADD8E6" },
    headerContainer: { display: "flex", marginbottom: "1.5rem", justifyContent: 'space-between', alignitems: "center" },
    headerButtons: { display: "flex", alignItems: "Center", gap: "10px" }
};