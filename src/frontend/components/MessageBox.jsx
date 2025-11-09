import React, { useState } from "react";

export default function MessageBar() {
    const [text, setText] = useState("");

    const sendMessage = () => {
        setText("");
    };

    return (
        <div class="flex mt-5 gap-2.5">
            <input
                type="text"
                placeholder="send message to Mrs. A..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                class="flex-1 p-2.5 rounded-[10px] border border-gray-300"
            />
            <button onClick={sendMessage} class="flex items-center gap-2 bg-blue-200 hover:bg-blue-400 text-white rounded-full shadow px-3 py-1.5 cursor-pointer">
                <img 
                    src="/images/button_icon/send_icon.png"
                    alt="Send Icon"
                    className="w-7 h-7"
                />
            </button>
        </div>
    );
}
