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
            <button onClick={sendMessage} class="px-[14px] py-[10px] rounded-[10px] border-none bg-[#2B82F6] text-white cursor-pointer">send</button>
        </div>
    );
}
