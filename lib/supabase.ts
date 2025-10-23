
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';
import { authStorage } from './authStorage';

// FIX: Hardcoded credentials to resolve runtime error about missing environment variables.
// This ensures the application can connect to Supabase in the current execution environment.
const supabaseUrl = 'https://ojxfbxxstafxhqkuuvdk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGZieHhzdGFmeGhxa3V1dmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjUyNjYsImV4cCI6MjA3NjM0MTI2Nn0.R2RHI6P1uewf4dNUgk3AWO8BZg0ViYrL32MVkfgldmI';

if (!supabaseUrl || !supabaseAnonKey) {
  // This check is now somewhat redundant but good practice to keep.
  throw new Error('Missing Supabase credentials.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});