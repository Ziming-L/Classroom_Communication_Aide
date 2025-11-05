import React  from "react";
import ReactDOM from "react-dom/client";
import TranslatorPage from "./pages/TranslatorPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <TranslatorPage />
    </React.StrictMode>
);