import React from "react";

export default function ColorSelector({ color, onChange, style = ""}) {
    // add color here
    const colorOptions = [
        "#add8e6",
        "#76c7e1ff",
        "#8b5cf6", 
        "#f59e0b", 
        "#10b981",
        "#4587f1ff",
        "#e2228cff",
        "#95d7edff",
        "#612cddff", 
        "#d2a14cff", 
        "#51c7a0ff",
        "#a0b0c9ff",
        "#c45492ff",
        "#eccdeeff",
        "#88e4c5ff",
        "#566c90ff",
        "#e482b8ff",
        "#d051d9ff",
        "#98165ec5",
        "#735c75ff",
        "#d5dae3ff",
        "#ba357ec5",
        "#cb90d1ff",
        "#14336cff",
    ]

    return (
        <div className={`flex flex-wrap gap-3 max-h-55 overflow-y-auto p-5 mb-2 border rounded ${style}`}>
            {colorOptions.map((c) => (
                <button
                    key={c}
                    onClick={() => onChange(c)}
                    className={`
                        w-10 h-10 rounded-full border 
                        ${color === c ? "border-black scale-105" : "border-transparent"}
                        transition-all duration-200
                        hover:border-blue-500 hover:scale-108
                    `}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>
    )
};