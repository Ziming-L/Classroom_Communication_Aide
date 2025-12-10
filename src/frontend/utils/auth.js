import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(url, options = {}) {
    // Don't add auth token to login/register endpoints
    const isAuthEndpoint = url.includes('/api/auth/login') || url.includes('/api/auth/register');
    if (!isAuthEndpoint) {
        // Get fresh token from Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        // If we have a session, inject the fresh access token
        if (session?.access_token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${session.access_token}`
            };
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data.message || data.error || 'Something went wrong';
        console.error("Request failed:", errorMsg, "Full response:", data);
        throw new Error(errorMsg);
    }
    return data;
}

export async function loginUser(credentials) {
    return request('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
}

export async function registerUser(userInfo) {
    const { email, username, password, role } = userInfo;

    // Create Supabase auth
    const userResponse = await request('/api/auth/register-local', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, role }),
    });

    return userResponse;
}

export default request;