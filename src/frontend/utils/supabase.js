import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage
    storage: window.localStorage,
    // Automatically refresh tokens before expiration
    autoRefreshToken: true,
    // Persist session across page refreshes
    persistSession: true,
    // Detect session from URL hash (for OAuth redirects)
    detectSessionInUrl: true
  }
});
