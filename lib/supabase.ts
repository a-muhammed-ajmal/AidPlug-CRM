import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';
import { authStorage } from './authStorage';

// Load Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This is a safeguard in case the hardcoded values are accidentally removed.
  throw new Error(
    'Supabase URL or anonymous key is missing in the configuration.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
