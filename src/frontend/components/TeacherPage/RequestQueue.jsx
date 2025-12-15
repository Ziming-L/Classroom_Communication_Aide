/*
 * component for the incoming student message queue in the main teacher page
 */
import StudentRequest from "./StudentRequest";
import request from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function RequestQueue({ currentRequests = [], setCurrentRequests, teacher_icon, teacher_icon_bg_color, onApproveRequest }) {
    const navigate = useNavigate();

    if (!currentRequests) {
        return;
    }

    const clearRequest = async (request_sent) => {
        alert("clearing request");

        try {
            const res = await request('/api/teachers/approve-request-button', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ request_id: request_sent.request_id })
            });

            if (!res.success) {
                console.error("Backend error:", res);
                return;
            }
            onApproveRequest(request_sent.translated_text);
            setCurrentRequests((prev) => prev.filter((request) => request.request_id !== request_sent.request_id));
        } catch (err) {
            console.error("Error approved by 'allow' button :", err);
        }
    };

    const respondToRequest = (request_sent) => {        
        navigate("/teacher/custommessage", {
            state: {
                request_id: request_sent.request_id,
                created_at: request_sent.created_at,
                student_name: request_sent.student_name, 
                student_icon: request_sent.student_icon, 
                student_icon_bg_color: request_sent.student_icon_bg_color, 
                translate_text: request_sent.translated_text, 
                teacher_icon, 
                teacher_icon_bg_color 
            }
        })
    };

    return (
        <div>
            {currentRequests.map(request_sent => (
                <StudentRequest
                    key={request_sent.request_id}
                    request={request_sent}
                    onClear={() => clearRequest(request_sent)}
                    onRespond={() => respondToRequest(request_sent)}
                />
            ))}
        </div>
    );
}
