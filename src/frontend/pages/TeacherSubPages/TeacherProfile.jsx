import React from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile";


export default function RequestLogPage() {
    const navigate = useNavigate();

    const returnToTeacher = () => navigate("/teacher");
    const goToAllStudent = () => navigate("/teacher/allstudents");
    const goToRequestLog = () => navigate("/teacher/requestlogs");

    return (
        <div style={styles.page}>
            <header style={styles.headerContainer}>
                <button onClick={() => returnToTeacher()} style={styles.button}>
                    Back to Main
                </button>
                <h1>
                    Profile Page
                </h1>
                <Profile />
            </header>
        </div>
    )
}

const styles = {
    page: { display: "flex", flexDirection: "column", padding: "2rem", width: "full", position: "relative" },
    ActivityContainer: { display: "flex", flexDirection: "row", marginTop: "20px", alignItems: "center", gap: "20px" },
    inputBox: { borderRadius: '10px', width: "1000px", height: "40px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    button: { borderRadius: '20px', marginTop: "10px", fontSize: "16px", background: "#ADD8E6" },
    headerContainer: { display: "flex", marginbottom: "1.5rem", justifyContent: 'space-between', alignitems: "center" },
    headerButtons: { display: "flex", alignItems: "Center", gap: "10px" }
};