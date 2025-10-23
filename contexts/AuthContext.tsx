import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthError, AuthResponse, Session, User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { authStorage } from '../lib/authStorage';

// FIX: Corrected the return type for updateUserPassword to match the UserResponse from Supabase.
type UserResponse = { data: { user: User | null }, error: AuthError | null };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string, remember: boolean) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: AuthError | null }>;
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

// FIX: Changed to React.FC to resolve issue with children prop type inference.
export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    // The user profile is now created automatically by a database trigger.
    // The 'full_name' is passed in the 'data' option and used by the trigger.
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (response.error) throw response.error;
    
    return response;
  };

  // FIX: Added explicit return type and refactored to return the whole response object to fix type incompatibility.
  const signIn = async (email: string, password: string, remember: boolean): Promise<AuthResponse> => {
    authStorage.setPersistence(remember);
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (response.error) throw response.error;
    return response;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem('rememberedEmail');
    if (error) throw error;
    return { error };
  };

  const sendPasswordResetEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/reset-password`,
    });
    if (error) throw error;
    return { error };
  };

  const updateUserPassword = async (password: string): Promise<UserResponse> => {
    const response = await supabase.auth.updateUser({ password });
    if (response.error) throw response.error;
    return response;
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updateUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};