import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';
import { authStorage } from './authStorage';

// The Supabase URL and Key are hardcoded here because this environment does not
// support Vite's import.meta.env for loading environment variables.
// WARNING: For a real production environment, these should be replaced with a
// secure method of providing secrets.
const supabaseUrl = 'https://ojxfbxxstafxhqkuuvdk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGZieHhzdGFmeGhxa3V1dmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NjUyNjYsImV4cCI6MjA3NjM0MTI2Nn0.R2RHI6P1uewf4dNUgk3AWO8BZg0ViYrL32MVkfgldmI';

if (!supabaseUrl || !supabaseAnonKey) {
  // This is a safeguard in case the hardcoded values are accidentally removed.
  throw new Error('Supabase URL or anonymous key is missing in the configuration.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});