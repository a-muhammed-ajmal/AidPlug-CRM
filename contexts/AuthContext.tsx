import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthError, AuthResponse, Session, User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { authStorage } from '../lib/authStorage';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
    try {
      // Step 1: Sign up the user in Supabase Auth.
      const authResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/#/auth/confirm`,
        },
      });

      if (authResponse.error) {
        if (authResponse.error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists.');
        }
        throw authResponse.error;
      }

      if (!authResponse.data.user) {
        throw new Error("Sign up successful, but no user data returned. Cannot create profile.");
      }

      // Step 2: Create a corresponding public profile for the new user.
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authResponse.data.user.id,
          email: email,
          full_name: fullName,
        });

      if (profileError) {
        console.error('Critical Error: Failed to create user profile after sign up:', profileError);
        throw new Error('Your account was created, but we failed to set up your user profile. Please contact support.');
      }
      
      return authResponse;
    } catch (error) {
      console.error('Error during sign up process:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create account. Please try again.');
    }
  };

  const signIn = async (email: string, password: string, remember: boolean): Promise<AuthResponse> => {
    try {
      authStorage.setPersistence(remember);
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (response.error) throw response.error;
      return response;
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Failed to sign in. Please check your credentials.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem('rememberedEmail');
      if (error) throw error;
      return { error };
    } catch (error) {
        console.error('Error signing out:', error);
        throw new Error('Failed to sign out. Please try again.');
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });
      if (error) throw error;
      return { error };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email. Please try again.');
    }
  };

  const updateUserPassword = async (password: string): Promise<UserResponse> => {
    try {
      const response = await supabase.auth.updateUser({ password });
      if (response.error) throw response.error;
      return response;
    } catch (error) {
      console.error('Error updating user password:', error);
      throw new Error('Failed to update password. Please try again.');
    }
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