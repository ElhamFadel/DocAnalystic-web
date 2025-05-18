import { createClient, User, UserResponse } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: profile.fullName,
        job_title: profile.jobTitle,
        department: profile.department,
        organization: profile.organization,
        avatar_url: profile.avatarUrl,
        theme: profile.theme,
        notification_preferences: profile.notificationPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getUserActivity(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
}

export async function updateUserSettings(userId: string, settings: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ settings })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
}

export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
}

export async function logUserActivity(userId: string, action: string, details: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw error;
  }
}