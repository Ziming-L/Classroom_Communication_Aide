import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");

    return (
        <div>
            <button onClick={() => returnToDashboard()}>
                Go Back
            </button>
            <p> Profile</p>
        </div>
    );
}