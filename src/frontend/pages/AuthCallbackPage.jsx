import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AuthCallbackPage() {

    const navigate = useNavigate();

    // State variables
    const [error, setError] = useState(null);

    // Trigger OAuth handling
    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                navigate('/login');
                return;
            }
            if (session) {
                // Sync OAuth user with your backend
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/oauth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: session.user.email,
                            provider: session.user.app_metadata.provider,
                            providerId: session.user.id,
                        }),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('AuthCallback: Backend error:', errorData);
                        throw new Error(errorData.message || 'Failed to sync user with backend');
                    }
                    const result = await response.json();
                    // Check if user needs to complete registration
                    if (result.needsRegistration) {
                        console.log('AuthCallback: User needs registration, navigating to finish-registration');
                        navigate('/finish-registration', {
                            state: {
                                auth_uid: result.auth_uid,
                                email: result.email,
                                session: session,
                                role: 'student'
                            }
                        });
                        return;
                    }
                    // Existing user
                    localStorage.setItem('user', JSON.stringify(result.user));
                    // Navigate based on user role
                    if (result.user.role === 'student') {
                        console.log('AuthCallback: Navigating to /student');
                        navigate('/student');
                    } else {
                        console.log('AuthCallback: Navigating to /teacher');
                        navigate('/teacher');
                    }
                } catch (err) {
                    console.error('AuthCallback: OAuth sync error:', err);
                    setError('Failed to authenticate: ' + err.message);
                }
            } else {
                // Email already in use
                navigate('/login');
            }
        };
        handleAuthCallback();
    }, [navigate]);


    return (
        <div className=" bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 flex flex-col items-center justify-center h-screen">
            <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-6 leading-tight px-4">Authenticating...</p>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
