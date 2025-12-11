import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageQueue from "../components/TeacherPage/MessageQueue";
import Profile from "../components/Profile";
import styles from "../components/TeacherPage/styles.module.css";

export default function TeacherPage() {
    const navigate = useNavigate();
    const [activity, setActivity] = useState("");
    const [currentClass, setCurrentClass] = useState("Math");
    const [messages, setMessages] = useState([])

    const goToRequestLog = () => navigate("/teacher/requestlogs");
    const goToAllStudent = () => navigate("/teacher/allstudents");
    const goToProfile = () => navigate("/teacher/profile");

    const wsURL = 'ws://127.0.0.1:5100';
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket(wsURL);
        wsRef.current.onopen = () => {
            addMessage("connected to socket server");
        };
        // when recieving message
        wsRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type == "activity") {
                addMessage("activity: ", msg.payload);
            }
        };
        wsRef.current.onclose = () => {
            addMessage("disconected from socket server")
        };

        return () => wsRef.current.close();
    }, []);

    const sendActivity = () => {
        // empty activity error check
        if (!activity.trim()) return;
        const msg = {
            type: 'activity',
            payload: {
                user: "teacher",
                activity: activity.trim()
            }
        }
        // send update activity message
        ws.send(JSON.stringify(msg));
        setActivity("");
    };

    return (
        <div className={styles.page}>
            {/* Page Header */}
            <header className={styles.header}>
                {/* Teacher */}
                <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Classroom Communication Aide</h1>

                <div className={styles.headerButtons}>
                    <label style={local.subjectButton}>
                        Subject:
                        <select name="subject" default="default"
                            style={{ borderRadius: "5px", fontWeight: "bold", backgroundColor: "#EEEEEE" }}>
                            <option value="Math">Math</option>
                            <option value="Literature">Literature</option>
                            <option value="Science">Science</option>
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
                        <Profile />
                    </button>
                </div>
            </header>

            {/* Change Current Activity */}
            <p>
                <div style={local.ActivityContainer}>
                    <h2 style={local.ActivityText}><b>Set Activity: </b></h2>
                    <input
                        placeholder="Type activity..."
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        style={local.inputBox}
                    />
                    <button onClick={sendActivity} className={styles.button}>Send</button>
                </div>
            </p>
            {/* Message Queue */}
            <div>
                <h1 style={{ marginTop: "20px", fontSize: '18px' }}>Student Messages:</h1>
                <MessageQueue
                    messages={messages}
                />
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