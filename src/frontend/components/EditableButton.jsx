import React, { useState } from "react";

export default function EditableButton({ button, updateButton }) {
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    return (
        <div className={`${button.color} p-4 rounded-lg shadow"`}>
            <div>
                <p>Description:</p>
                <input
                    className="w-full border p-2 rounded mb-2"
                    value={button.userLangText}
                    onChange={(e) => updateButton(button.id, { userLangText: e.target.value })}
                />
            </div>

            <div>
                <p>Translation:</p>
                <input
                    className="w-full border p-2 rounded mb-2"
                    value={button.targetLangText}
                    onChange={(e) => updateButton(button.id, { targetLangText: e.target.value })}
                />
            </div>
            

            <div className="flex items-center gap-4 mt-2">
                <div>
                    <p className="text-sm">Icon</p>
                    <div
                        className="w-10 h-10 border rounded flex items-center justify-center cursor-pointer"
                        onClick={() => setShowIconPicker(true)}
                    >
                        <img src={button.img} className="w-8" />
                    </div>
                </div>

                <div>
                    <p className="text-sm">Color</p>
                    <div
                        className="w-10 h-10 border rounded cursor-pointer"
                        style={{ backgroundColor: button.color }}
                        onClick={() => setShowColorPicker(true)}
                    />
                </div>
            </div>
        </div>
    );
}