import React, { useState } from 'react';
import request from '../../utils/auth';

export default function StudentEntry({ student }) {

    // State variables to manage dynamic display
    const [studentInfoDisplay, setStudentInfoDisplay] = useState(false);
    const [studentTryOnOwnDisplay, setStudentTryOnOwnDisplay] = useState(false);
    const [incrementingStar, setIncrementingStar] = useState(false);
    const [currentStars, setCurrentStars] = useState(student.stars);

    // Used to trigger student details
    const displayStudent = (e) => {
        e.stopPropagation();
        setStudentInfoDisplay(!studentInfoDisplay);
    }

    // Used to trigger the Try On Own response buttons
    const displayStudentTryOnOwn = (e) => {
        e.stopPropagation();
        setStudentTryOnOwnDisplay(!studentTryOnOwnDisplay);
    }

    // Student Stars are incremented via API
    const tryOnOwnSuccess = async (e) => {
        e.stopPropagation();
        if (!student.student_id) {
            console.error('Student ID not available');
            return;
        }
        try {
            setIncrementingStar(true);
            const response = await request(`/api/teachers/increment-star/${student.student_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.success) {
                // Increment stars locally to reflect change
                setCurrentStars(prev => prev + 1);
                setStudentTryOnOwnDisplay(false);
            } else {
                console.error('Failed to increment star:', response.message);
            }
        } catch (err) {
            console.error('Error incrementing star:', err.message);
        } finally {
            setIncrementingStar(false);
        }
    }

    const tryOnOwnCancel = (e) => {
        e.stopPropagation();
        setStudentTryOnOwnDisplay(false);
    }

    // Return the full language name given language code
    const getLanguageName = (code) => {
        try {
            const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
            return displayNames.of(code);
        } catch (error) {
            return code;
        }
    }

    return (
        <>
            <div className='text-lg border-2 border-gray-700 w-full p-2 m-2 rounded-lg
                transition-all duration-200 hover:border-blue-300 hover:translate-y-[-2px] cursor-pointer shadow-lg'
                onClick={displayStudent}>
                <div className='flex items-center m-2 gap-4'>
                    <div className='flex flex-row gap-2 items-center flex-1'>
                        <img src={student.icon} alt={`${student.name}'s icon`} className='max-h-20 max-w-20 p-3 bg-gray-200 rounded-full'/>
                        <h2 className='ml-2 font-bold text-2xl'>{student.name}</h2>
                    </div>
                    <div className='flex items-center justify-center flex-1'>
                        <p className='text-center'>Username: {student.username}</p>
                    </div>
                    <div className='flex flex-row gap-5 items-center justify-end flex-1'>
                        <button
                            className='bg-blue-200 p-3 rounded-xl shadow-lg hover:bg-blue-300 transition-all duration-200 cursor-pointer w-32 text-center disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={displayStudentTryOnOwn}
                            disabled={incrementingStar}
                        >
                            Try On Own
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-200 ease-in-out ${
                                studentTryOnOwnDisplay ? 'max-h-96 max-w-50 opacity-100' : 'max-h-0 max-w-0 opacity-0'
                            }`}>
                            <div className='mx-2 flex flex-row gap-5'>
                                <button
                                    className='py-2 px-4 bg-green-200 rounded-xl shadow-lg hover:bg-green-300 transition-all duration-200 cursor-pointer text-center'
                                    onClick={(e) => {tryOnOwnSuccess(e);}}
                                    title='Success!'
                                    >
                                    ✓
                                </button>
                                <button
                                    className='py-2 px-4 bg-red-200 rounded-xl shadow-lg hover:bg-red-300 transition-all duration-200 cursor-pointer text-center'
                                    onClick={(e) => {tryOnOwnCancel(e);}}
                                    title='Cancel'
                                    >
                                    ✗
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div 
                    className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        studentInfoDisplay ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className='py-10 px-4 flex flex-row gap-5 items-start justify-between border-t border-t-gray-400 border-t-1.5 text-gray-700'>
                        <div className='flex flex-col items-center flex-1'>
                            <h2 className='font-bold text-2xl mb-4 text-center'>Student Requests</h2>
                            <div className='border border-gray-700 rounded-lg overflow-hidden shadow-lg'>
                                <table className='w-full'>
                                    {student.command_history.map((entry, index) => (
                                        <tr key={index} className='border-b border-gray-700 last:border-b-0'>
                                            <td className='p-2 text-center'>{entry.command}</td>
                                            <td className='p-2 text-3xl text-center'>{entry.count}</td>
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        </div>
                        <div className='flex flex-col items-center flex-1'>
                            <h2 className='font-bold text-xl mb-4 text-center'>Number of Times They Tried By Themselves</h2>
                            <p className='text-center text-5xl flex flex-row items-center justify-center gap-2'>
                                {currentStars}
                                <img src="/images/commands_icon/star.png" alt="Students Stars" className='max-h-20'/>
                            </p>
                        </div>
                        <div className='flex flex-col items-center flex-1'>
                            <h2 className='font-bold text-xl mb-4 text-center'>Language</h2>
                            <p className='text-center text-4xl'>{getLanguageName(student.lang)}</p>
                        </div>            
                    </div>
                </div>
            </div>
        </>
    );
}
