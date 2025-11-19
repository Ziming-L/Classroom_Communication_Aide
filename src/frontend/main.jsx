import React  from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TranslatorPage from "./pages/TranslatorPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import "./index.css";
import LandingPage from "./pages/LandingPage.jsx";
import TeacherPage from "./pages/TeacherPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* If you want to test other pages, modify the routes for pages. */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
                <Route path="/translator" element={<TranslatorPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
