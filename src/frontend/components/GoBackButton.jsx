import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton = forwardRef(
    ({ fallback = "/student", label, position ="px-3 py-1.5 sm:px-5 sm:py-2"}, ref) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate(fallback);
        }
    };

    return (
        <button 
            ref={ref} 
            onClick={handleClick} 
            className={`
                bg-purple-600 text-white
                text-sm sm:text-base
                rounded-full 
                shadow-md 
                hover:bg-purple-700
                ${position}
            `}
        >
            {label}
        </button>
    );
  }
);

export default GoBackButton;
