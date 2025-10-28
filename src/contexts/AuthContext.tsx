import { AuthError, AuthResponse, User } from '@supabase/supabase-js';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authStorage } from '../lib/authStorage';
import { supabase } from '../lib/supabase';

// Define a type for the component props for better clarity
type AuthProviderProps = {
  children: ReactNode;
};

type UserResponse = { data: { user: User | null }; error: AuthError | null };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<AuthResponse>;
  signIn: (
    email: string,
    password: string,
    remember: boolean
  ) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  sendPasswordResetEmail: (
    email: string
  ) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (password: string) => Promise<UserResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the current session on initial load
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Auth session check:', { session: !!session, error });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes in authentication state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, { session: !!session });
      setUser(session?.user ?? null);
      // Ensure loading is false once we have auth state
      if (loading) setLoading(false);
    });

    // Cleanup the subscription on component unmount
    return () => subscription.unsubscribe();
  }, []); // Remove loading from deps since we only want this to run once

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse> => {
    // IMPORTANT: Updated redirect URL to work with BrowserRouter
    const redirectTo = `${window.location.origin}/auth/confirm`;

    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: redirectTo,
      },
    });

    if (authResponse.error) throw authResponse.error;
    if (!authResponse.data.user)
      throw new Error('Sign up successful, but no user data returned.');

    // Create a corresponding public profile for the new user.
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authResponse.data.user.id,
        email: email,
        full_name: fullName,
      });

    if (profileError) {
      // This is a critical error state. The auth user exists but the profile doesn't.
      console.error(
        'Critical Error: Failed to create user profile after sign up:',
        profileError
      );
      throw new Error(
        'Your account was created, but we failed to set up your user profile. Please contact support.'
      );
    }

    return authResponse;
  };

  const signIn = async (
    email: string,
    password: string,
    remember: boolean
  ): Promise<AuthResponse> => {
    authStorage.setPersistence(remember);
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // REASON: Re-throw the original Supabase error for specific UI feedback
    if (response.error) throw response.error;
    return response;
  };

  const signOut = async () => {
    localStorage.removeItem('rememberedEmail');
    const { error } = await supabase.auth.signOut();
    // REASON: Re-throw original error if it exists
    if (error) throw error;
    return { error };
  };

  const sendPasswordResetEmail = async (email: string) => {
    // IMPORTANT: Updated redirect URL to work with BrowserRouter
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return { error };
  };

  const updateUserPassword = async (
    password: string
  ): Promise<UserResponse> => {
    const response = await supabase.auth.updateUser({ password });
    if (response.error) throw response.error;
    return response;
  };

  // REASON: Memoize the context value to prevent unnecessary re-renders of consuming components.
  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signOut,
      sendPasswordResetEmail,
      updateUserPassword,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
