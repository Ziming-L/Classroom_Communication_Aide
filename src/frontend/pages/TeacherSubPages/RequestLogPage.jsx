import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../../components/Profile"
import styles from "../../components/TeacherPage/styles.module.css"
import RequestRow from "../../components/TeacherPage/RequestRow.jsx";
import GoBackButton from "../../components/GoBackButton.jsx";
import request from '../../utils/auth';


// TODO: delete before deploy -- just for testing
const sampleRequests = [
    {
        request_id: 1,
        student_icon: "../images/user_profile_icon/woman_5.png",
        student_icon_bg_color: "#b8a6d4ff",
        student_name: "Jackie May",
        request_text: "I want to drink water",
        created_at: "2025-12-07 01:41:32.058925+00",
        status: "pending",
        responded_at: null,
        message: null,
    },
    {
        request_id: 2,
        student_icon: "../images/user_profile_icon/woman_2.png",
        student_icon_bg_color: "#ffb6c1",
        student_name: "Jackie Chan",
        request_text: "I feel sick",
        created_at: "2025-11-28 00:03:50.03132+00",
        status: "approved",
        responded_at: "2025-11-28 02:41:32.058925+00",
        message: null,
    },
    {
        request_id: 3,
        student_icon: "../images/user_profile_icon/polar_bear_1.png",
        student_icon_bg_color: "#b0ecacff",
        student_name: "Sarah Doe",
        request_text: "I want to drink water",
        created_at: "2025-11-24 00:03:50.03132+00",
        status: "message",
        responded_at: null,
        message: {
            message_id: 12,
            content:
            "Please return the signed form by tomorrow. aaas sa an asdm asdnasd sak. sd ak d aks da kd qwk dandedkeja dkfea nf ekn dkwedknend ekn ksad adsaed,em cde dejd kedn a,rnf r efea jf jh. ",
            sent_at: "2025-11-24 00:03:50.03132+00",
        },
    },
    {
        request_id: 4,
        student_icon: "../images/user_profile_icon/polar_bear_1.png",
        student_icon_bg_color: "#b0ecacff",
        student_name: "Sarah Doe",
        request_text: "I want to drink water",
        created_at: "2025-11-24 00:03:50.03132+00",
        status: "message",
        responded_at: null,
        message: {
            message_id: 12,
            content:
            "Please return the signed form by tomorrow. aaas sa an asdm asdnasd sak. sd ak d aks da kd qwk dandedkeja dkfea nf ekn dkwedknend ekn ksad adsaed,em cde dejd kedn a,rnf r efea jf jh. ",
            sent_at: "2025-11-24 00:03:50.03132+00",
        },
    },
    {
        request_id: 5,
        student_icon: "../images/user_profile_icon/polar_bear_1.png",
        student_icon_bg_color: "#b0ecacff",
        student_name: "Sarah Doe",
        request_text: "I feel sick",
        created_at: "2025-11-22 00:03:50.03132+00",
        status: "message",
        responded_at: null,
        message: {
            message_id: 12,
            content:
            "Please return the signed form by tomorrow. aaas sa an asdm asdnasd sak. sd ak d aks da kd qwk dandedkeja dkfea nf ekn dkwedknend ekn ksad adsaed,em cde dejd kedn a,rnf r efea jf jh. ",
            sent_at: "2025-11-22 00:03:50.03132+00",
        },
    },
    {
        request_id: 6,
        student_icon: "../images/user_profile_icon/polar_bear_1.png",
        student_icon_bg_color: "#b0ecacff",
        student_name: "Sarah Doe",
        request_text: "I need help",
        created_at: "2025-11-21 00:03:50.03132+00",
        status: "message",
        responded_at: null,
        message: {
            message_id: 12,
            content:
            "Please return the signed form by tomorrow. aaas sa an asdm asdnasd sak. sd ak d aks da kd qwk dandedkeja dkfea nf ekn dkwedknend ekn ksad adsaed,em cde dejd kedn a,rnf r efea jf jh. ",
            sent_at: "2025-11-21 00:03:50.03132+00",
        },
    },
    {
        request_id: 7,
        student_icon: "../images/user_profile_icon/polar_bear_1.png",
        student_icon_bg_color: "#b0ecacff",
        student_name: "Sarah Doe",
        request_text: "I want to go to the bathroom",
        created_at: "2025-11-20 00:03:50.03132+00",
        status: "message",
        responded_at: null,
        message: {
            message_id: 12,
            content:
            "Please return the signed form by tomorrow. aaas sa an asdm asdnasd sak. sd ak d aks da kd qwk dandedkeja dkfea nf ekn dkwedknend ekn ksad adsaed,em cde dejd kedn a,rnf r efea jf jh. ",
            sent_at: "2025-11-20 00:03:50.03132+00",
        },
    }
];

export default function RequestLogPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const goToProfile = () => navigate("/teacher/profile");

    // get data from parent page
    const { class_id, teacher_icon, teacher_icon_bg_color } = location.state || {};

    const teacherIcon = teacher_icon ? "../" + teacher_icon : "../../images/user_profile_icon/default_user.png";
    const teacherIconBg = teacher_icon_bg_color || '#add8e6';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("");
    const [responseFilter, setResponseFilter] = useState("any");

    // get the request from backend
    useEffect(() => {
        if (!class_id) {
            console.error("Missing class_id");
            return;
        }

        async function getRequests() {
            // try {
            //     setLoading(true);

            //     const data = await request(`/api/teachers/request-history-class/${class_id}`, {
            //         method: "GET",
            //         headers: {
            //             "Authorization": `Bearer ${token}`,
            //             "Content-Type": "application/json"
            //         }
            //     });

            //     setRequests(data.requests || []);
            // } catch (err) {
            //     alert("Error loading request history: " + err.message);
            // } finally {
            //     setLoading(false);
            // }
        }

        getRequests();
    }, [class_id, token]);

// TODO: to be deleted the below test data:
    useEffect(() => {
        setRequests(sampleRequests);
    }, []);
// detete till here

    const filteredRequests = useMemo(() => {
        const nf = nameFilter.trim().toLowerCase();
        
        return requests.filter(r => {
            // filter by name
            if (nf && !r.student_name.toLowerCase().includes(nf)) {
                return false;
            }
            // filter by date
            const dateObject = new Date(r.created_at);
            if (dateFilter) {
                // transform to correct format
                const requestDate = [
                    dateObject.getFullYear(),
                    String(dateObject.getMonth() + 1).padStart(2, '0'),
                    String(dateObject.getDate()).padStart(2, '0')
                ].join('-');
                if (requestDate !== dateFilter) {
                    return false;
                }
            }
            // filter by time
            if (timeFilter) {
                const [h, m] = timeFilter.split(":").map(Number);
                const filterDate = new Date(dateObject);
                filterDate.setHours(h, m, 0, 0);

                // true for time greater than selected time
                if (dateObject < filterDate) {
                    return false;
                }
            }
            // filter by status
            if (responseFilter && responseFilter !== "any") {
                if (r.status !== responseFilter) {
                    return false;
                }
            }

            return true;
        });
    }, [requests, nameFilter, dateFilter, timeFilter, responseFilter]);

    function resetFilters() {
        setNameFilter("");
        setDateFilter("");
        setTimeFilter("");
        setResponseFilter("any");
    }

    const inputStyle = `
        h-7
        border border-gray-300 rounded-md px-3 py -2 
        focus:outline-none focus-ring-2 focus:ring-blue-400
        transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500
    `;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <GoBackButton
                    label="Go Back"
                    fallback="/teacher"
                />
                <h1 className="text-center text-3xl font-bold mb-6 italic">REQUEST HISTORY</h1>
                <div className={styles.headerButtons}>
                    {/* Profile */}
                    <button className={styles.profileButton} onClick={() => goToProfile()}>
                        <Profile 
                            image={teacherIcon}
                            color={teacherIconBg}
                        />
                    </button>
                </div>
            </header>

            <div className="flex justify-center">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="
                        inline-flex items-center gap-1 rounded-full 
                        px-2 py-1.5
                        text-xs sm:text-sm
                        border border-gray-300 bg-amber-700 
                        hover:bg-amber-800 text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3
                    "
                >
                    {showFilters ? "Hide filters" : "Show filters"}
                </button>
            </div>

            {/* filter feature */}
            {showFilters && (
                // <div className="
                <div 
                    className="
                        max-w-[1000px] mx-auto 
                        text-sm flex flex-col items-center gap-3 mb-3
                    "
                >
                    <div 
                        className="
                            grid grid-cols-2 gap-3 p-4 
                            border border-gray-300 rounded-md w-full
                            bg-gray-50
                            md:flex md:flex-wrap md:justify-center
                        "
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label className="w-25 text-gray-700">Student Name:</label>
                            <input 
                                type="text" 
                                placeholder="Filter by student name..."
                                title="Type the student's name to filter requests"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)} 
                                className={inputStyle}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label className="w-9 text-gray-700">Date:</label>
                            <input 
                                type="date"
                                title="Enter the date to filter requests"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className={inputStyle}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label className="w-9 text-gray-700">Time:</label>
                            <input 
                                type="time" 
                                title="Enter the time to filter requests (> selected time)"
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className={inputStyle}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <label className="w-9 text-gray-700">Type:</label>
                            <select 
                                value={responseFilter}
                                title="Choose an option to filter requests"
                                onChange={(e) => setResponseFilter(e.target.value)}
                                className={inputStyle}
                            >
                                <option value="any">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="message">Message Sent</option>
                            </select>
                        </div>
                    </div>

                    {(nameFilter || dateFilter || timeFilter || responseFilter !== "any") &&
                        <div className="col-span-2 w-full flex justify-center">
                            <button
                                onClick={resetFilters}
                                className="
                                    h-8 text-sm rounded-full px-3 border border-gray-300 bg-blue-100
                                    hover:bg-blue-300 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400
                                "
                            >
                            Reset
                            </button>
                        </div>
                    }
                </div>
            )}

            {/* contents for requests */}
            <div>
                {loading ? (
                    <div className="text-center py-5 text-xl text-gray-500 italic">
                        Loading request history...
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-5 text-xl text-gray-500 italic">
                        No requests found
                    </div>
                ) : (
                    // request rows
                    filteredRequests.map(r => (
                        <RequestRow
                            key={r.request_id}
                            profilePicture={r.student_icon}
                            profileColor={r.student_icon_bg_color}
                            name={r.student_name}
                            request={r.request_text}
                            createdAt={r.created_at}
                            responseType={r.status}
                            respondedAt={r.responded_at}
                            messageData={r.message}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
