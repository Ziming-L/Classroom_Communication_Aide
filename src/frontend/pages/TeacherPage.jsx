import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageQueue from "../components/MessageQueue";


export default function TeacherPage() {

    const [currentActivity, setCurrentActivity] = useState("");
    const [currentClass, setCurrentClass] = useState("Math");

    const clickPlaceholder = () => {
        alert("opening new page");
    };

    const handleSend = () => {
        alert("sending message");
        setCurrentActivity("")
    };

    const handleGoToAllStudent = () => {
        navigate("/AllStudent", {
        });
    };

    return (
        <div className="flex flex-col p-8 w-full font-sans relative">
            {/* Header */}
            <header className="mb-6 flex justify-between items-center">
                {/* Teacher View */}
                <h1 className="text-3xl font-bold mb-2">Teacher View</h1>

                <div className="flex items-center gap-2.5">

                    {/* Request Logs Button */}
                    <button onClick={() => clickPlaceholder()}
                        style={styles.button}
                    >
                        Request Logs
                    </button>

                    {/* All Student Info Button */}
                    <button onClick={() => clickPlaceholder()}
                        style={styles.button}
                    >
                        All Student
                    </button>

                    {/* Profile */}
                    <button onClick={() => clickPlaceholder()}
                        style={styles.button}
                    >
                        Profile
                    </button>
                </div>
            </header>

            {/* Change Current Activity */}
            <p>
                <div style={styles.ActivityContainer}>
                    <h2 style={{ fontSize: '18px', color: 'black' }}> <b>Set Activity: </b></h2>
                    <textarea
                        placeholder={currentActivity}
                        value={currentActivity}
                        onChange={(e) => setCurrentActivity(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleSend} style={styles.button}>Send</button>
                </div>
            </p>
            {/* Message Queue */}
            <div>
                <h1 style={{ marginTop: "20px", fontSize: '18px', color: 'blue' }}><b>Message Queue</b></h1>
                {MessageQueue()}
            </div>
            <br></br>
        </div>
    );
}

const styles = {
    ActivityContainer: { borderRadius: '50px', display: "flex", flexDirection: "row", marginTop: "50px", alignItems: "center", marginTop: "2rem" },
    input: { width: "1000px", height: "50px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    button: { borderRadius: '10px', marginTop: "10px", padding: "8px 16px", fontSize: "16px", background: "#ADD8E6" },
};
