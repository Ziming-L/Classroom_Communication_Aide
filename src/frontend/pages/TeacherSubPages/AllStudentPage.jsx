import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile"
import StudentEntryList from "../../components/TeacherPage/StudentEntryList";
import StudentEntry from "../../components/TeacherPage/StudentEntry";
import styles from "../../components/TeacherPage/styles.module.css"

export default function AllStudentPage() {

    // Mock student data - TODO: Replace with API call
    const students = [
        {
            name: "Han Solo",
            icon: "/images/user_profile_icon/cow_1.png",
            lang: "es",
            stars: 54,
            username: "han_s",
            usage: "high",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Walter White",
            icon: "/images/user_profile_icon/baby_chick_1.png",
            lang: "zh",
            stars: 4,
            username: "walter_w",
            usage: "medium",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Batman",
            icon: "/images/user_profile_icon/bat_1.png",
            lang: "ar",
            stars: 2,
            username: "batman",
            usage: "low",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Skyler White",
            icon: "/images/user_profile_icon/bird_1.png",
            lang: "fr",
            stars: 24,
            username: "skyler_w",
            usage: "high",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
    ]

    const navigate = useNavigate();
    const [newStudentUsername, setNewStudentUsername] = useState("");

    const returnToTeacher = () => navigate("/teacher");
    const goToProfile = () => navigate("/teacher/profile");

    const addStudent = (newStudentUsername) => {
        // Placeholder for add student functionality
        alert(`Add student: ${newStudentUsername}`);
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button onClick={() => returnToTeacher()} className={styles.button}>
                    Back to Main
                </button>
                <h1 className="text-2xl"> All Student View </h1>
                <div className={styles.headerButtons}>
                    <button onClick={() => goToProfile()} className={styles.profileButton}>
                        <Profile />
                    </button>
                </div>
            </header>
            <div className="mx-20">
                <div className="items-center p-5 flex flex-row justify-center bg-white">
                    <h2 className="m-3 p-3 text-5xl font-light text-center">Student List For: </h2>
                    <h2 className="w-min m-3 p-3 text-5xl font-light text-center bg-gray-200 rounded-xl">v4KL0e52y8</h2>
                    <button
                        className="ml-10 p-3 bg-blue-200 rounded-xl shadow-md hover:bg-blue-300 transition-all duration-200 cursor-pointer text-center text-2xl font-medium"
                        onClick={() => addStudent(newStudentUsername)}>
                        Add Student
                    </button>
                    <input
                        type="text"
                        value={newStudentUsername}
                        onChange={(e) => setNewStudentUsername(e.target.value)}
                        placeholder="Enter username"
                        className="ml-3 p-3 border border-gray-300 rounded-lg"
                    />
                </div>
                <StudentEntryList students={students}/>
            </div>
        </div>
    )
}

const local = {
    page: { display: "flex", flexDirection: "column", padding: "2rem", width: "full", position: "relative" },
    ActivityContainer: { display: "flex", flexDirection: "row", marginTop: "20px", alignItems: "center", gap: "20px" },
    inputBox: { borderRadius: '10px', width: "1000px", height: "40px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    button: { borderRadius: '20px', marginTop: "10px", padding: "8px 16px", fontSize: "16px", background: "#ADD8E6" },
    headerContainer: { display: "flex", marginbottom: "1.5rem", justifyContent: 'space-between', alignitems: "center" },
    headerButtons: { display: "flex", alignItems: "Center", gap: "10px" }
};