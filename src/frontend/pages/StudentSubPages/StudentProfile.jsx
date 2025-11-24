import { useNavigate } from "react-router-dom";
import { TOP_BUTTONS_MAP} from "../../utils/constants.js";

export default function StudentProfile() {
    const navigate = useNavigate();
    const returnToDashboard = () => navigate("/student");
    const userLang = "es";

    return (
        <div className="p-8">
            <button onClick={() => returnToDashboard()} className="
                bg-purple-600 text-white 
                text-sm sm:text-base
                px-3 py-1.5 sm:px-5 sm:py-2 
                rounded-full 
                shadow-md 
                hover:bg-purple-700">
                {TOP_BUTTONS_MAP[userLang]?.goBack}
            </button>
            <p> Profile</p>
        </div>
    );
}