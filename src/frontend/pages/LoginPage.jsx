import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/auth';
import { Routes, Route } from 'react-router-dom';

/**
 * LoginPage Component
 *
 * Renders a login interface.
 *
 * @returns JSX.Element - the login page
 */
export default function LoginPage({ userType, onBack, onLogin }) {

    // State variables for form inputs and status
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(userType || 'student');

    // State for error messages and loading status
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { token, user } = await loginUser({ email, password, role: userType });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (typeof onLogin === 'function') {
                onLogin(user);
            } else {
                console.error("onLogin is not a function!");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await registerUser({ email, username, password, role });
            const { token, user } = await loginUser({ email, password, role });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (typeof onLogin === 'function') {
                onLogin(user);
            } else {
                console.error("onLogin is not a function!");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (

        <div className="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 px-4 py-8 mx-2">
            <div className="text-center mb-12 animate-[fadeIn_1s_ease-in]">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r  from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight px-4">
                    {isRegister ? 'Register' : (userType === 'student' ? 'Student Login' : 'Teacher Login')}
                </h1>     
            </div>

            <div className="w-full max-w-4xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-12 mb-8">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-10">
                    <div>
                        <label htmlFor="email" className="block text-3xl sm:text-4xl font-semibold text-gray-700 mb-4">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-8 py-6 text-2xl sm:text-3xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label htmlFor="username" className="block text-3xl sm:text-4xl font-semibold text-gray-700 mb-4">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-8 py-6 text-2xl sm:text-3xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-3xl sm:text-4xl font-semibold text-gray-700 mb-4">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-8 py-6 text-2xl sm:text-3xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label htmlFor="role" className="block text-3xl sm:text-4xl font-semibold text-gray-700 mb-4">
                                Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full px-8 py-6 text-2xl sm:text-3xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full cursor-pointer text-xl sm:text-2xl font-semibold bg-white border-2 border-blue-500 text-blue-500 py-4 px-6 rounded-2xl shadow-lg"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="text-2xl">✓</span>
                            <span>{isRegister ? 'Register' : `Login as ${userType}`}</span>
                        </span>
                    </button>
                </form>

                <div className="space-y-4 mt-10">
                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                        <span className="text-2xl text-gray-500 font-semibold">OR</span>
                        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-4 bg-white border-2 border-purple-600 text-gray-700 text-xl sm:text-2xl font-semibold py-4 px-6 rounded-2xl shadow-lg hover:bg-purple-50"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        <span>{isRegister ? 'Back to Login' : 'Create an Account'}</span>
                    </button>
                </div>

                <div className="flex gap-4 w-full mt-8">
                    <button
                        type="button"
                        className="w-full cursor-pointer text-xl sm:text-2xl font-semibold bg-white border-2 border-pink-500 text-pink-500 py-4 px-6 rounded-2xl shadow-lg"
                        onClick={onBack}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="text-2xl">←</span>
                            <span>Back to Home</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
