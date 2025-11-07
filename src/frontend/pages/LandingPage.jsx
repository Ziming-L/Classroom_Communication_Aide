import React, { useState } from 'react';
import LoginPage from './LoginPage.jsx';

/**
 * LandingPage Component
 *
 * Renders a home interface with a student / teacher login option.
 *
 * @returns JSX.Element - the landing page
 */
export default function LandingPage() {
  const [selectedType, setSelectedType] = useState(null);

  if (selectedType) {
    return <LoginPage userType={selectedType} onBack={() => setSelectedType(null)} />;
  }

  return (
    <div className="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4 py-8">
      <div className="text-center mb-16 animate-[fadeIn_1s_ease-in]">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-6 leading-tight px-4">
          Classroom Communication Aid
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-medium mt-6">
          Welcome! Choose your role to login
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-20 w-full max-w-4xl px-4">
        <button
          className="cursor-pointer flex-1 text-3xl sm:text-4xl md:text-5xl font-semibold bg-white border-4 border-blue-500 text-blue-500 py-8 sm:py-10 md:py-12 px-6 sm:px-8 rounded-3xl shadow-lg"
          onClick={() => setSelectedType('student')}
        >
          <span className="flex flex-col items-center gap-3">
            <span className="text-5xl sm:text-6xl">🎒</span>
            <span>I Am a Student</span>
          </span>
        </button>

        <button
          className="cursor-pointer flex-1 text-3xl sm:text-4xl md:text-5xl font-semibold bg-white border-4 border-pink-500 text-pink-500 py-8 sm:py-10 md:py-12 px-6 sm:px-8 rounded-3xl shadow-lg"
          onClick={() => setSelectedType('teacher')}
        >
          <span className="flex flex-col items-center gap-3">
            <span className="text-5xl sm:text-6xl">👩‍🏫</span>
            <span>I Am a Teacher</span>
          </span>
        </button>
      </div>
    </div>
  );
}
