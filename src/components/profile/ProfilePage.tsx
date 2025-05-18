import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  User,
  Building2,
  Briefcase,
  Mail,
  Bell,
  Moon,
  Sun,
  Upload,
  Save,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    email: user?.email || '',
    fullName: '',
    jobTitle: '',
    department: '',
    organization: '',
    theme: 'light',
    notificationPreferences: {
      email: true,
      desktop: true,
      documentUpdates: true,
      securityAlerts: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setProfile(prev => ({
        ...prev,
        avatarUrl: urlData.publicUrl
      }));

      await supabase
        .from('user_profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', user?.id);

      setSuccess('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.fullName,
          job_title: profile.jobTitle,
          department: profile.department,
          organization: profile.organization,
          theme: profile.theme,
          notification_preferences: profile.notificationPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-6 space-y-6"
    >
      <h1 className="text-2xl font-serif font-semibold text-gray-800">Profile Settings</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded relative">
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div
                {...getRootProps()}
                className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 ${
                  isDragActive ? 'border-primary-500' : 'border-gray-200'
                }`}
              >
                <input {...getInputProps()} />
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-900">{profile.fullName || 'Your Name'}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.jobTitle}
                    onChange={e => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={e => setProfile(prev => ({ ...prev, department: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.organization}
                    onChange={e => setProfile(prev => ({ ...prev, organization: e.target.value }))}
                    className="pl-10 block w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={profile.theme === 'light'}
                      onChange={() => setProfile(prev => ({ ...prev, theme: 'light' }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <Sun size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Light Theme</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={profile.theme === 'dark'}
                      onChange={() => setProfile(prev => ({ ...prev, theme: 'dark' }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <Moon size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Dark Theme</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.notificationPreferences.email}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        notificationPreferences: {
                          ...prev.notificationPreferences,
                          email: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <Mail size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Email Notifications</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.notificationPreferences.desktop}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        notificationPreferences: {
                          ...prev.notificationPreferences,
                          desktop: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <Bell size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Desktop Notifications</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.notificationPreferences.documentUpdates}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        notificationPreferences: {
                          ...prev.notificationPreferences,
                          documentUpdates: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <FileText size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Document Updates</span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profile.notificationPreferences.securityAlerts}
                      onChange={e => setProfile(prev => ({
                        ...prev,
                        notificationPreferences: {
                          ...prev.notificationPreferences,
                          securityAlerts: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <Shield size={16} className="ml-2 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-700">Security Alerts</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save size={16} className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;