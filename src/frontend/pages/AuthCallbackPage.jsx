import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {

  const navigate = useNavigate();

  // State variables
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [oauthData, setOauthData] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
          const response = await fetch('http://localhost:5100/api/auth/oauth', {
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
            console.log('AuthCallback: User needs registration, showing form');
            setNeedsRegistration(true);
            setOauthData({
              auth_uid: result.auth_uid,
              email: result.email,
              session: session
            });
            return;
          }

          // Existing user - log them in
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('supabaseSession', JSON.stringify(session));

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
        // Email already in use for a non-OAuth account or other issue
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);


  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create user in database
      console.log('CompleteRegistration: Sending request to create-user');
      const response = await fetch('http://localhost:5100/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_uid: oauthData.auth_uid,
          username: username,
          role: role,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to complete registration';
        try {
          const data = await response.json();
          console.error('CompleteRegistration: Backend error:', data);
          errorMessage = data.message || errorMessage;
        } catch (parseErr) {
          console.error('CompleteRegistration: Could not parse error response:', parseErr);
          const text = await response.text();
          console.error('CompleteRegistration: Error response text:', text);
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      // Get a new token
      const { data: { session } } = await supabase.auth.getSession();

      localStorage.setItem('token', session.access_token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
      localStorage.setItem('supabaseSession', JSON.stringify(session));

      // Navigate based on role
      if (role === 'student') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
    } catch (err) {
      console.error('CompleteRegistration: Registration completion error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (needsRegistration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-200 px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent mb-4">
            Complete Your Registration
          </h1>
          <p className="text-xl text-gray-600">Please enter information to complete user registration!</p>
        </div>

        <div className="w-full max-w-2xl bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8">

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleCompleteRegistration} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-2xl font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={oauthData?.email || ''}
                disabled
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-2xl font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-6 py-4 text-xl border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-2xl font-semibold text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-xl font-semibold bg-white border-2 border-blue-500 text-blue-500 py-4 px-6 rounded-xl shadow-lg hover:bg-blue-50 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
