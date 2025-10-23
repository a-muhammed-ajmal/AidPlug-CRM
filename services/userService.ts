import { supabase } from '../lib/supabase';
import { Database } from '../types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

export const userService = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message || error);
      throw new Error('Failed to load user profile.');
    }
  },
  updateProfile: async (userId: string, updates: UserProfileUpdate): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating user profile:', error.message || error);
      throw new Error('Failed to update user profile.');
    }
  },
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || ({ user_id: userId, push_notifications: true, email_notifications: false, mobile_sync: true } as UserPreferences);
    } catch (error: any) {
      console.error('Error fetching user preferences:', error.message || error);
      throw new Error('Failed to load user preferences.');
    }
  },
  updatePreferences: async (userId: string, updates: UserPreferencesUpdate): Promise<UserPreferences> => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ ...updates, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating user preferences:', error.message || error);
      throw new Error('Failed to update user preferences.');
    }
  }
};