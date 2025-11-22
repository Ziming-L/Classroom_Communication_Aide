import React from 'react';
import StudentEntry from './StudentEntry.jsx';

export default function StudentEntryList({ classCode }) {

    // Mock student data - TODO: Replace with API call
    const students = [
        {
            name: "Han Solo",
            icon: "/images/user_profile_icon/cow_1.png",
            lang: "es",
            stars: 54,
            username: "han_s",
            usage: "high",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Walter White",
            icon: "/images/user_profile_icon/baby_chick_1.png",
            lang: "zh",
            stars: 4,
            username: "walter_w",
            usage: "medium",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Batman",
            icon: "/images/user_profile_icon/bat_1.png",
            lang: "ar",
            stars: 2,
            username: "batman",
            usage: "low",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
        {
            name: "Skyler White",
            icon: "/images/user_profile_icon/bird_1.png",
            lang: "fr",
            stars: 24,
            username: "skyler_w",
            usage: "high",
            command_history: [
                { command: "Can I go to the bathroom?", count: 5},
                { command: "I need help with my homework.", count: 3},
                { command: "May I have some water?", count: 2}
            ],
        },
    ]

    // Return the list of student entries
    return (
        <>
            <div className='flex flex-col border-2 border-black rounded-lg'>
                {students.map((student) => (
                    <div className='flex'>
                        <StudentEntry student={student} />
                    </div>
                ))}
            </div>
        </>
    );
}
