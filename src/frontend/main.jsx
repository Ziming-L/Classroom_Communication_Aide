import React  from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TranslatorPage from "./pages/TranslatorPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StudentPage />} />
                <Route path="/translator" element={<TranslatorPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);