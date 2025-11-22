import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TranslatorPage from "./pages/TranslatorPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import "./index.css";
import LandingPage from "./pages/LandingPage.jsx";
import TeacherPage from "./pages/TeacherPage.jsx";
import AllStudentPage from "./pages/TeacherSubPages/AllStudentPage.jsx";
import RequestLogPage from "./pages/TeacherSubPages/RequestLogPage.jsx";
import TeacherProfile from "./pages/TeacherSubPages/TeacherProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* If you want to test other pages, modify the routes for pages. */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="student/translator" element={<TranslatorPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
                <Route path="/teacher/allstudents" element={<AllStudentPage />} />
                <Route path="/teacher/requestlogs" element={<RequestLogPage />} />
                <Route path="/teacher/profile" element={<TeacherProfile />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
