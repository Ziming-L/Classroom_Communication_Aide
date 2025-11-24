import React from 'react';
import StudentEntry from './StudentEntry.jsx';

export default function StudentEntryList({ students }) {

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
