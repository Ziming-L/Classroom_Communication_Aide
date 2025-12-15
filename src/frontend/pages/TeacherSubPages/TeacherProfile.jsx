import React, { useState, useEffect } from "react";
import Profile from "../../components/Profile";
import ClassQueue from "../../components/TeacherPage/ClassQueue";
import styles from "../../components/TeacherPage/styles.module.css";
import GoBackButton from "../../components/GoBackButton";
import request from "../../utils/auth";

export default function TeacherProfile() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teacherIcon, setTeacherIcon] = useState('../images/user_profile_icon/default_user.png');
    const [teacherIconBg, setTeacherIconBg] = useState('#add8e6');
    const [classes, setClasses] = useState([]);

    const fetchClasses = async () => {
        try {
            const res = await request("/api/teachers/teacher-profile-with-all-classes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.success) {
                setTeacherIcon(res.teacher.teacher_icon);
                setTeacherIconBg(res.teacher.teacher_icon_bg_color);
                setClasses(res.classes);
                console.log("classes in profile: ", res.classes);
            } else {
                console.error("Backend error:", res);
                setError("Backend error:" + res);
            }
        } catch (err) {
            console.error("Error fetching teacher profile:", err);
            setError("Error fetching teacher profile:" + err);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchClasses(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);


    if (loading) {
        return (
            <div className=" bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 flex flex-col items-center justify-center h-screen">
                <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight px-4">Loading Teacher Profile...</p>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <GoBackButton
                    fallback="/teacher"
                    label="Back to Main"
                />
                <h1 style={{ fontSize: "20px" }}>
                    Profile Page
                </h1>
                <button className={styles.profileButton}>
                    <Profile 
                        image={teacherIcon}
                        color={teacherIconBg}
                    />
                </button>
            </header>

            {error && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div style={local.queue}>
                <ClassQueue classes={classes} setClasses={setClasses}/>
            </div>
        </div>
    )
}

const local = {
    queue: { display: "flex", justifyContent: "center" }
};