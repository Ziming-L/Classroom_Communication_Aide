import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentPage from './pages/StudentPage';
import TranslatorPage from './pages/TranslatorPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import TeacherPage from './pages/TeacherPage';
import AllStudentPage from './pages/TeacherSubPages/AllStudentPage';
import RequestLogPage from './pages/TeacherSubPages/RequestLogPage';
import TeacherProfile from './pages/TeacherSubPages/TeacherProfile';
import StudentProfile from './pages/StudentSubPages/StudentProfile';
import CommandEditPage from './pages/StudentSubPages/CommandEditPage';
import CustomMessagePage from './pages/TeacherSubPages/CustomMessagePage';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    console.log("Handle Login() called with user:", loggedInUser);
    console.log("User role is:", loggedInUser.role, "Type:", typeof loggedInUser.role);
    setUser(loggedInUser);
    if (loggedInUser.role === 'student') {
      console.log("Navigating to /student");
      navigate('/student');
    } else {
      console.log("Navigating to /teacher");
      navigate('/teacher');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onBack={() => navigate('/')} />} />
      <Route path="/callback" element={<AuthCallbackPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/student" element={user && user.role === 'student' ? <StudentPage user={user} onLogout={handleLogout} /> : <LoginPage userType="student" onLogin={handleLogin} onBack={() => navigate('/')} />} />
      <Route path="/student/translator" element={<TranslatorPage />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/edit" element={<CommandEditPage />} />
      <Route path="/teacher" element={<TeacherPage user={user} onLogout={handleLogout} />} />
      <Route path="/teacher/allstudents" element={<AllStudentPage />} />
      <Route path="/teacher/requestlogs" element={<RequestLogPage />} />
      <Route path="/teacher/profile" element={<TeacherProfile />} />
      <Route path="/teacher/custom-message" element={<CustomMessagePage />} />
    </Routes>
  );
}
