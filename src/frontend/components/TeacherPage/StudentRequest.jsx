import styles from "./styles.module.css";
import { timeAgo } from "../../utils/convertTime";

export default function StudentRequest({ request, onClear, onRespond }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "2px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "18px",
            backgroundColor: request.student_icon_bg_color,
            color: "white"
        }}>
            <div style={{ width: "500px" }}><strong>{request.student_name}</strong> : {request.translated_text}</div>

            <div className={styles.headerButtons}>
                <button style={local.approveButton} onClick={() => onClear(request)}>Allow</button>
                <button style={local.respondButton} onClick={() => onRespond(request)}>Respond</button>
            </div>
            <div style={{ fontSize: "16px", color: "white", whiteSpace: "nowrap", marginLeft: "10px" }}>
                {timeAgo(request.created_at)}
            </div>
        </div >
    );
}

const local = {
    approveButton: {
        borderRadius: '10px', padding: "8px 16px",
        fontSize: "18px", background: "#FFC067", gap: "10px", color: "black"
    },
    respondButton: {
        borderRadius: '10px', padding: "8px 16px",
        fontSize: "18px", background: "#EF8490", gap: "10px", color: "black"
    },
    buttons: { marginTop: "10px", display: "flex", gap: "10px" }
}