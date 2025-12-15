import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RequestQueue from "../components/TeacherPage/RequestQueue";
import Profile from "../components/Profile";
import styles from "../components/TeacherPage/styles.module.css";
import request from "../utils/auth";
import { selectActiveClass } from "../utils/selectActiveClass";

export default function TeacherPage() {
    const navigate = useNavigate();
    const [activity, setActivity] = useState("");
    const [prevActivity, setPrevActivity] = useState("Type activity...");

    const [currentClass, setCurrentClass] = useState(null);
    const [currentRequests, setCurrentRequests] = useState();
    const [loading, setLoading] = useState(true);
    const [teacherInfo, setTeacherInfo] = useState();
    const [classInfo, setClassInfo] = useState([]);
    const [error, setError] = useState();
    const [message, setMessages] = useState();
    
    const wsURL = 'ws://localhost:5100';
    // use ref so websocket stays across renders
    const wsRef = useRef(null);

    const addMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };

    useEffect(() => {
        if (!currentClass?.class_id) {
            return;
        }

        wsRef.current = new WebSocket(wsURL);
        
        // when recent join
        wsRef.current.onopen = () => {
            wsRef.current.send(JSON.stringify({
                type: "register",
                payload: {
                    role: "teacher",
                    classId: currentClass.class_id,
                    classCode: currentClass.class_code
                }
            }))
        }

        // when recieving message
        wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type == "student-message") {
                alert(`Message from student: ${msg.payload.student_name}\n\nMessage: ${msg.payload.message}`);
                console.log("Received from student: ", msg.payload);
            }
            if (msg.type === "refresh-requests") {
                fetchCurrentRequests();
            }
        };

        wsRef.current.onclose= () => {
            console.log(`Teacher connection closed for: ${currentClass.class_name}`);
        }

        return () => wsRef.current.close();
    }, [currentClass]);

    const sendActivity = () => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn("Teacher WS not ready");
            return;
        }

        // empty activity error check
        if (!activity.trim()) return;
        const msg = {
            type: 'activity',
            payload: {
                activity: activity.trim(),
                timestamp: Date.now()
            }
        }
        // send update activity message
        wsRef.current.send(JSON.stringify(msg));
        setPrevActivity(activity.trim());
        setActivity("");
    };
    
    const requestApprovedByBtn = (request_name) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn("Teacher WS not ready");
            return;
        }

        wsRef.current.send(JSON.stringify({
            type: "request-allowed-button",
            payload: {
                teacher_name: teacherInfo.teacher_name,
                class: currentClass.class_name,
                request_name,
                timestamp: Date.now()
            }
        }));
    }

    const fetchTeacherInfo = async () => {
        try {
            const res = await request("/api/teachers/teacher-profile-with-all-classes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.success) {
                setTeacherInfo(res.teacher);
                setClassInfo(res.classes);
                console.log("Teacher date: ", res);

                const activeClass = selectActiveClass(res.classes);
                setCurrentClass(activeClass);
            } else {
                console.error("Backend error:", res);
                setError("Backend error:" + res);
            }
        } catch (err) {
            console.error("Error fetching teacher data:", err);
            setError("Error fetching teacher data:" + err);
        }
    }

    const fetchCurrentRequests = async () => {
        console.log("current requests: ", currentRequests);
        
        if (!currentClass?.class_id) {
            return;
        }

        try {
            const res = await request(`/api/teachers/current-requests/${currentClass.class_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.success) {
                setCurrentRequests(res.requests);
            } else {
                console.error("Backend error:", res);
                setError("Backend error:" + res);
            }
        } catch (err) {
            console.error("Error fetching current request data:", err);
            setError("Error fetching current request data:" + err);
        }
    }

    useEffect(() => {
        const loadTeacherData = async () => {
            await Promise.all([
                fetchTeacherInfo(),
            ]);
            setLoading(false);
        };
        loadTeacherData();
    }, []);

    useEffect(() => {
        if (currentClass?.class_id) {
            fetchCurrentRequests();
        }
    }, [currentClass]);


    const goToRequestLog = () => navigate("/teacher/requestlogs", {
        state: {
            class_id: currentClass?.class_id ?? null,
            teacher_icon: teacherInfo.teacher_icon,
            teacher_icon_bg_color: teacherInfo.teacher_icon_bg_color
        }
    });
    const goToAllStudent = () => navigate("/teacher/allstudents", {
        state: {
            teacher_icon: teacherInfo.teacher_icon,
            teacher_icon_bg_color: teacherInfo.teacher_icon_bg_color
        }
    });
    const goToProfile = () => navigate("/teacher/profile");

    if (loading) {
        return (
            <div className=" bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 flex flex-col items-center justify-center h-screen">
                <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight px-4">Loading Teacher Page...</p>
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
            {/* Page Header */}
            <header className={styles.header}>
                {/* Teacher */}
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Classroom Communication Aide</h1>

                <div className={styles.headerButtons}>
                    <label style={local.subjectButton}>
                        Subject:
                        <select 
                            name="subject" 
                            value={currentClass?.class_id ?? ""}
                            onChange={(e) => {
                                const selected = classInfo.find(cls => cls.class_id === Number(e.target.value));
                                setCurrentClass(selected ?? null);
                            }}
                            style={{ borderRadius: "5px", fontWeight: "bold", backgroundColor: "#EEEEEE", marginLeft: "5px"}}
                        >
                            <option value="" disabled>
                                {classInfo.length ? "Select class..." : "No classes"}
                            </option>
                            {classInfo?.map((cls) => (
                                <option key={cls.class_id} value={cls.class_id}>
                                    {cls.class_name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {/* Request Logs Button */}
                    <button onClick={() => goToRequestLog()} className={styles.button}>
                        Request Logs
                    </button>

                    {/* All Student Info Button */}
                    <button onClick={() => goToAllStudent()} className={styles.button}>
                        All Student
                    </button>

                    {/* Profile */}
                    <button className={styles.profileButton} onClick={() => goToProfile()} >
                        <Profile 
                            image={teacherInfo.teacher_icon}
                            color={teacherInfo.teacher_icon_bg_color}
                        />
                    </button>
                </div>
            </header>
            {!currentClass && (
                <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                    Please select a class to start!
                </div>
            )}
            {/* Change Current Activity */}
            <div style={local.ActivityContainer}>
                <h2 style={local.ActivityText}><b>Set Activity: </b></h2>
                <input
                    placeholder={prevActivity}
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    style={local.inputBox}
                />
                <button onClick={sendActivity} className={styles.button}>
                    Send
                </button>
            </div>
            {/* Message Queue */}
            <div>
                <h1 style={{ marginTop: "20px", fontSize: '18px' }}>Student Messages:</h1>
                {currentRequests && 
                    <RequestQueue 
                        currentRequests={currentRequests} 
                        setCurrentRequests={setCurrentRequests} 
                        teacher_icon={teacherInfo.teacher_icon}
                        teacher_icon_bg_color={teacherInfo.teacher_icon_bg_color}
                        onApproveRequest={requestApprovedByBtn}
                    />
                }
            </div>
            <br></br>
        </div>
    );
}

const local = {
    ActivityContainer: {
        display: "flex", flexDirection: "row",
        marginTop: "20px", alignItems: "center", gap: "20px"
    },
    ActivityText: { fontSize: '20px', color: 'black', whiteSpace: 'nowrap' },
    inputBox: {
        borderRadius: '10px', width: "1000px", height: "50px",
        padding: "10px", fontSize: "18px", background: "#D3D3D3"
    },
    subjectButton: {
        borderRadius: '10px', marginTop: "10px", padding: "8px 16px",
        fontSize: "18px", background: "#FFC067", gap: "10px"
    },
};