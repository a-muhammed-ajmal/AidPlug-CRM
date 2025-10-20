import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

// FIX: Updated the Supabase URL and Anon Key with the credentials provided by the user
// to resolve the "Failed to fetch" errors. In a typical Vite project, these would be
// loaded from environment variables.
const supabaseUrl = 'https://ojxfbxxstafxhqkuuvdk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGZieHhzdGFmeGhxa3V1dmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjUyNjYsImV4cCI6MjA3NjM0MTI2Nn0.R2RHI6P1uewf4dNUgk3AWO8BZg0ViYrL32MVkfgldmI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
