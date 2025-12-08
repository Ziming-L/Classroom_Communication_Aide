import React, { useState } from "react";
import Profile from "../../components/Profile";
import { formatToLocal } from "../../utils/convertTime";


function ResponseDetails({ status, content, time }) {
    let localDate = null, localTime = null;

    if (time) {
        ({ localDate, localTime } = formatToLocal(time));
    }

    const color = {
        pending: "text-red-700",
        approved: "text-green-700",
        message: "text-blue-700",
    }[status];

    return (
        <div className="text-center text-gray-800">
            <p className={`text-center font-semibold ${color}`}>
                {status === "pending"
                    ? "Request Pending (✗)"
                    : status === "approved"
                    ? "Request Approved (✔)"
                    : "Teacher Message"}
            </p>

            {content && <div className="mt-1">
                {content}
            </div>}

            {/* only show time if exists */}
            {time && (
                <p className="text-xs text-gray-500 mt-2 italic">
                    {status === "message" ? "Sent" : "Approved"} at: {localDate} {localTime}
                </p>
            )}
        </div>
    );
}


export default function RequestRow({ profilePicture, profileColor, name, request, createdAt, responseType = "pending", respondedAt = null, messageData = null, rowColor = "bg-yellow-100"}) {
    const [open, setOpen] = useState(false);
    const { localDate: date, localTime: time } = formatToLocal(createdAt);

    // a switch for expand the display
    const toggle = () => setOpen(!open);

    return (
        <div className="w-full max-w-5xl mx-auto mb-4">
            <div
                role="clickable row"
                tabIndex={0}
                onClick={toggle}
                onKeyDown={
                    (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            toggle();
                        }
                    }
                }
                className={`
                    rounded-lg 
                    border border-gray-200 shadow-sm p-4 
                    flex items-center gap-6 ${rowColor} 
                    cursor-pointer
                    transition-all duration-200
                    hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500
                `}
                aria-expanded={open}
            >
                <div className="w-16 h-16 hover:-translate-y-0.5">
                    <Profile 
                        image={profilePicture}
                        color={profileColor}
                        size="68"
                    />
                </div>
                <div className="flex-1 text-lg text-gray-800 flex flex-wrap items-center gap-4">
                    <div className="min-w-[150px] hover:-translate-y-0.5">
                        <span className="text-base font-medium">Name: </span>
                        <span className="font-semibold">{name}</span>
                    </div>

                    <div className="min-w-[240px] hover:-translate-y-0.5">
                        <span className="text-base font-medium">Request: </span>
                        <span className="font-semibold">{request}</span>
                    </div>

                    <div className="min-w-[140px] hover:-translate-y-0.5">
                        <span className="text-base font-medium">Date: </span>
                        <span className="font-semibold">{date}</span>
                    </div>

                    <div className="min-w-[120px] hover:-translate-y-0.5">
                        <span className="text-base font-medium">Time: </span>
                        <span className="font-semibold">{time}</span>
                    </div>
                </div>

                {/* expand the row for more info */}
                {open && (
                    <div className={`w-full rounded-b-lg border border-t-1 border-gray-200 p-4 ${rowColor} hover:-translate-y-0.5`}>
                        {responseType === "pending" && (
                            <ResponseDetails 
                                status="pending" 
                                time={respondedAt} 
                            />
                        )}

                        {responseType === "approved" && respondedAt && (
                            <ResponseDetails 
                                status="approved" 
                                time={respondedAt} 
                            />
                        )}

                        {responseType === "message" && messageData && (
                            <ResponseDetails
                                status="message"
                                time={messageData.sent_at}
                                content={<p>{messageData.content}</p>}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}