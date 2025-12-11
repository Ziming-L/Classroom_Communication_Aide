import React, { useState } from 'react';
import { loginUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

/**
 * LoginPage Component
 *
 * Renders a login interface.
 *
 * @returns JSX.Element - the login page
 */
export default function LoginPage({ userType, onBack, onLogin }) {
    const navigate = useNavigate();

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
            // Sign in to Supabase to establish session
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) {
                throw new Error(signInError.message);
            }
            // Verify role with backend
            const response = await loginUser({ email, password, role: userType });

            // Check if user needs to complete registration
            if (response.needsRegistration) {
                navigate('/finish-registration', {
                    state: {
                        auth_uid: response.auth_uid,
                        email: response.email,
                        session: authData.session,
                        role: userType
                    }
                });
                return;
            }

            localStorage.setItem('user', JSON.stringify(response.user));

            if (typeof onLogin === 'function') {
                onLogin(response.user);
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
            // Create Supabase auth user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/callback`,
                }
            });
            if (signUpError) {
                console.error('Signup error:', signUpError);
                throw new Error(signUpError.message);
            }
            if (!data.user) {
                throw new Error('Failed to create account. Please try again.');
            }
            // Handle case where email confirmation is required (session will be null)
            if (!data.session) {
                setError('Please check your email to confirm your account before completing registration.');
                setLoading(false);
                return;
            }
            // Navigate to FinishRegistrationPage with auth data
            navigate('/finish-registration', {
                state: {
                    auth_uid: data.user.id,
                    email: data.user.email,
                    session: data.session,
                    role: role,
                    username: username
                }
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            // Store the role in localStorage so it persists through OAuth redirect
            localStorage.setItem('pendingRole', role || userType);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/callback`,
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    
    return (

        <div className="login-page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 px-4 py-4 mx-2">
            <div className="text-center mb-4 animate-[fadeIn_1s_ease-in]">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r  from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-2 leading-tight px-4">
                    {isRegister ? 'Register' : (userType === 'student' ? 'Student Login' : 'Teacher Login')}
                </h1>
            </div>

            <div className="w-full max-w-4xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-6 mb-4">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-lg sm:text-xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label htmlFor="username" className="block text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-lg sm:text-xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 text-lg sm:text-xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label htmlFor="role" className="block text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-lg sm:text-xl border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors"
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

                <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-4 my-4">
                        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                        <span className="text-lg text-gray-500 font-semibold">OR</span>
                        <div className="flex-1 h-1 bg-gray-300 rounded"></div>
                    </div>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-4 bg-white border-2 border-red-500 text-gray-700 text-lg sm:text-xl font-semibold py-3 px-4 rounded-2xl shadow-lg hover:bg-red-50"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <span>Continue with Google</span>
                    </button>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-4 bg-white border-2 border-purple-600 text-gray-700 text-lg sm:text-xl font-semibold py-3 px-4 rounded-2xl shadow-lg hover:bg-purple-50"
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        <span>{isRegister ? 'Back to Login' : 'Create an Account'}</span>
                    </button>
                </div>

                <div className="flex gap-4 w-full mt-4">
                    <button
                        type="button"
                        className="w-full cursor-pointer text-lg sm:text-xl font-semibold bg-white border-2 border-pink-500 text-pink-500 py-3 px-4 rounded-2xl shadow-lg"
                        onClick={onBack}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="text-xl">←</span>
                            <span>Back to Home</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
