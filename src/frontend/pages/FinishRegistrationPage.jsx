import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import Profile from '../components/Profile';
import AvatarSelector from '../components/AvatarSelector';
import ColorSelector from '../components/ColorSelector';

/**
 * FinishRegistrationPage component
 *
 * Renders an interface to complete registration with name, icon, bg-color, role.
 *
 * @returns JSX.Element - the registration page
 */
export default function FinishRegistrationPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get auth data passed from previous page
    const { auth_uid, email, session, role: initialRole } = location.state || {};

    // State variables
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(initialRole || 'student');
    const [displayName, setDisplayName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('../images/user_profile_icon/default_user.png');
    const [selectedColor, setSelectedColor] = useState('#add8e6');
    const [languageCode, setLanguageCode] = useState('en');
    const [schoolName, setSchoolName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Redirect if no auth data
    React.useEffect(() => {
        if (!auth_uid || !email) {
            console.error('Missing required auth data, redirecting to login');
            navigate('/login');
        }
    }, [auth_uid, email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!username.trim()) {
            setError('Please enter a username');
            setLoading(false);
            return;
        }

        if (!displayName.trim()) {
            setError('Please enter your display name');
            setLoading(false);
            return;
        }

        if (role === 'teacher' && !schoolName.trim()) {
            setError('Please enter your school name');
            setLoading(false);
            return;
        }

        try {
            // Create user record with auth_uid, username, and role
            const createUserResponse = await fetch('http://localhost:5100/api/auth/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auth_uid,
                    username,
                    role,
                }),
            });
            let userData;
            if (!createUserResponse.ok) {
                const errorData = await createUserResponse.json();
                // If account already exists, continue to profile creation
                if (errorData.message && errorData.message.includes('already exists')) {
                    console.log('User account already exists, proceeding to profile creation');
                    userData = { user: { user_id: null } };
                } else {
                    throw new Error(errorData.message || 'Failed to create user');
                }
            } else {
                userData = await createUserResponse.json();
            }
            // Get access token from session
            const accessToken = session?.access_token;
            if (!accessToken) {
                throw new Error('No access token available. Please try logging in again.');
            }
            // Create profile with display name, icon, color, and language
            const profileEndpoint = role === 'teacher'? 'http://localhost:5100/api/teachers/create-profile' : 'http://localhost:5100/api/students/create-profile';
            const profilePayload = {
                name: displayName,
                language_code: languageCode,
                icon: selectedIcon,
                icon_bg_color: selectedColor,
            };
            if (role === 'teacher') {
                profilePayload.school_name = schoolName;
            }
            const profileResponse = await fetch(profileEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(profilePayload),
            });
            if (!profileResponse.ok) {
                let errorMessage = 'Failed to create profile';
                try {
                    const errorData = await profileResponse.json();
                    errorMessage = errorData.message || errorMessage;
                    // Add helpful context for common errors
                    if (errorMessage.includes('school_name') && role === 'teacher') {
                        errorMessage = `School name is required for teachers. Please make sure you entered a school name. (${errorMessage})`;
                    }
                } catch (e) {
                    // Response is not JSON (e.g., 404 HTML page)
                    errorMessage = `Failed to create profile (${profileResponse.status})`;
                }
                throw new Error(errorMessage);
            }
            // Store user data
            localStorage.setItem('user', JSON.stringify(userData.user));
            // Ensure Supabase session is set (should already be from signup/OAuth)
            if (session) {
                await supabase.auth.setSession({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token
                });
            }
            // Navigate based on role
            if (role === 'student') {
                navigate('/student');
            } else {
                navigate('/teacher');
            }
        } catch (err) {
            console.error('Profile completion error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 px-4 py-4">
            <div className="text-center mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-1">
                    Complete Your Profile
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Choose your avatar and personalize your account!</p>
            </div>

            <div className="w-full max-w-5xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-4 sm:p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">

                    {/* Profile */}
                    <div className="flex flex-col items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Preview</h2>
                        <Profile
                            image={selectedIcon}
                            color={selectedColor}
                            size={80}
                        />
                        <p className="mt-1 text-sm text-gray-600">{displayName || 'Your Name'}</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email || ''}
                            disabled
                            className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl bg-gray-100"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            maxLength={30}
                            className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                            placeholder="Choose a unique username"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 mb-1">
                            Display Name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            maxLength={50}
                            className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                            placeholder="Enter your display name"
                        />
                    </div>

                    {/* Language Selection */}
                    <div>
                        <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-1">
                            Preferred Language
                        </label>
                        <select
                            id="language"
                            value={languageCode}
                            onChange={(e) => setLanguageCode(e.target.value)}
                            className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>

                    {/* School Name (for teachers only) */}
                    {role === 'teacher' && (
                        <div>
                            <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-1">
                                School Name
                            </label>
                            <input
                                id="schoolName"
                                type="text"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                required
                                maxLength={100}
                                className="w-full px-3 py-2 text-sm border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                                placeholder="Enter your school name"
                            />
                        </div>
                    )}

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Choose Your Avatar
                        </label>
                        <AvatarSelector
                            avatar={selectedIcon}
                            onChange={setSelectedIcon}
                            pathPrefix=""
                            style="max-h-32"
                        />
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Choose Background Color
                        </label>
                        <ColorSelector
                            color={selectedColor}
                            onChange={setSelectedColor}
                            style="max-h-24"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-base font-semibold bg-white border-2 border-blue-500 text-blue-500 py-3 px-4 rounded-xl shadow-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Profile...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
