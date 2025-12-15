import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import request from "../../utils/auth";
import Profile from "../../components/Profile"
import StudentEntryList from "../../components/TeacherPage/StudentEntryList";
import StudentEntry from "../../components/TeacherPage/StudentEntry";
import styles from "../../components/TeacherPage/styles.module.css"
import GoBackButton from "../../components/GoBackButton";

export default function AllStudentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // State vars
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStudentUsername, setNewStudentUsername] = useState("");
    const [addingStudent, setAddingStudent] = useState(false);
    const [classId, setClassId] = useState(null);
    const [classCode, setClassCode] = useState("");
    const [classes, setClasses] = useState([]);

    const { teacher_icon, teacher_icon_bg_color } = location.state || {};
    const teacherIcon = teacher_icon ? teacher_icon : '../images/user_profile_icon/default_user.png';
    const teacherIconBg = teacher_icon_bg_color ? teacher_icon_bg_color : '#add8e6';
    // Navigation functions
    const goToProfile = () => navigate("/teacher/profile");

    // Handle class selection change
    const handleClassChange = (e) => {
        const selectedClassId = parseInt(e.target.value);
        const selectedClass = classes.find(c => c.class_id === selectedClassId);
        if (selectedClass) {
            setClassId(selectedClass.class_id);
            setClassCode(selectedClass.class_code);
        }
    };

    // Fetch teacher's classes
    const fetchTeacherClasses = async () => {
        try {
            const response = await request('/api/teachers/teacher-profile-with-all-classes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.success && response.classes && response.classes.length > 0) {
                // Store all classes
                setClasses(response.classes);
                // Set the first class as default
                const firstClass = response.classes[0];
                setClassId(firstClass.class_id);
                setClassCode(firstClass.class_code);
            } else {
                setError('No classes found. Please create a class first.');
                setLoading(false);
            }
        } catch (err) {
            setError(`Failed to load classes: ${err.message}`);
            setLoading(false);
        }
    };

    // Reform backend student data to match frontend format
    const transformStudentData = (backendStudent) => {
        return {
            student_id: backendStudent.student_id,
            name: backendStudent.student_name,
            icon: backendStudent.student_icon,
            icon_bg_color: backendStudent.student_icon_bg_color,
            lang: backendStudent.language_code,
            stars: backendStudent.star_number,
            username: backendStudent.username,
            command_history: backendStudent.requests_made.map(req => ({
                command: req.translated_text,
                count: req.times_used
            }))
        };
    };

    // Fetch students for the current class
    const fetchStudents = async () => {
        if (!classId) return;
        try {
            setLoading(true);
            setError(null);
            const response = await request(`/api/teachers/all-students-info/${classId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.success && response.students) {
                const transformedStudents = response.students.map(transformStudentData);
                setStudents(transformedStudents);
            } else {
                setError(response.message || 'Failed to load students');
            }
        } catch (err) {
            setError(`Error loading students: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Add a student to the class
    const addStudent = async () => {
        if (!newStudentUsername.trim()) {
            setError('Please enter a username');
            return;
        }
        if (!classId) {
            setError('No class selected');
            return;
        }
        try {
            setAddingStudent(true);
            setError(null);
            const response = await request('/api/teachers/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newStudentUsername.trim(),
                    class_id: classId
                }),
            });
            if (response.success) {
                // Clear input and refresh student list
                setNewStudentUsername('');
                await fetchStudents();
            } else {
                setError(response.message || 'Failed to add student');
            }
        } catch (err) {
            setError(`Error adding student: ${err.message}`);
        } finally {
            setAddingStudent(false);
        }
    };

    // Fetch classes on mount
    useEffect(() => {
        fetchTeacherClasses();
    }, []);

    // Fetch students when classId is available
    useEffect(() => {
        if (classId) {
            fetchStudents();
        }
    }, [classId]);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <GoBackButton 
                    fallback="/teacher"
                    label="Back to Main"
                />
                <h1 className="text-2xl"> All Student View </h1>
                <div className={styles.headerButtons}>
                    <button onClick={() => goToProfile()} className={styles.profileButton}>
                        <Profile 
                            image={teacherIcon}
                            color={teacherIconBg}
                        />
                    </button>
                </div>
            </header>
            <div className="mx-20">

                {/* Error display */}
                {error && (
                    <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {loading ? (
                    <div className="flex justify-center items-center p-10">
                        <div className="text-2xl">Loading students...</div>
                    </div>
                ) : (
                    <>
                        <div className="items-center p-5 flex flex-row justify-center bg-white gap-4">
                            {/* Class selector */}
                            {classes.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <label className="text-2xl font-medium">Class:</label>
                                    <select
                                        value={classId || ''}
                                        onChange={handleClassChange}
                                        className="p-2 text-lg border-2 border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none cursor-pointer"
                                    >
                                        {classes.map((cls) => (
                                            <option key={cls.class_id} value={cls.class_id}>
                                                {cls.class_code} - {cls.class_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <h2 className="m-3 p-3 text-5xl font-light text-center">Class: </h2>
                            <h2 className="w-min m-3 p-3 text-5xl font-light text-center bg-gray-200 rounded-xl">
                                {classCode || ' - '}
                            </h2>
                            <button
                                className="ml-10 p-3 bg-blue-200 rounded-xl shadow-md hover:bg-blue-300 transition-all duration-200 cursor-pointer text-center text-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={addStudent}
                                disabled={addingStudent || !newStudentUsername.trim()}>
                                {addingStudent ? 'Adding...' : 'Add Student'}
                            </button>
                            <input
                                type="text"
                                value={newStudentUsername}
                                onChange={(e) => setNewStudentUsername(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newStudentUsername.trim() && !addingStudent) {
                                        addStudent();
                                    }
                                }}
                                placeholder="Enter username"
                                className="ml-3 p-3 border border-gray-300 rounded-lg"
                                disabled={addingStudent}
                            />
                        </div>

                        {/* No students message */}
                        {students.length === 0 && !loading && (
                            <div className="text-center p-10 text-xl text-gray-500">
                                No students in this class or no class exists yet.
                            </div>
                        )}

                        {/* Student list */}
                        {students.length > 0 && (
                            <StudentEntryList students={students}/>
                        )}

                    </>
                )}
            </div>
        </div>
    )
}

const local = {
    page: { display: "flex", flexDirection: "column", padding: "2rem", width: "full", position: "relative" },
    ActivityContainer: { display: "flex", flexDirection: "row", marginTop: "20px", alignItems: "center", gap: "20px" },
    inputBox: { borderRadius: '10px', width: "1000px", height: "40px", padding: "10px", fontSize: "16px", background: "#D3D3D3" },
    button: { borderRadius: '20px', marginTop: "10px", padding: "8px 16px", fontSize: "16px", background: "#ADD8E6" },
    headerContainer: { display: "flex", marginbottom: "1.5rem", justifyContent: 'space-between', alignitems: "center" },
    headerButtons: { display: "flex", alignItems: "Center", gap: "10px" }
};