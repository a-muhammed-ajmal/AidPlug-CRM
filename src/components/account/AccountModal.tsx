import {
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,

  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { useUserProfile } from '../../hooks/useUserProfile';

import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import SkeletonLoader from '../common/SkeletonLoader';

interface AccountModalProps {
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  const { user, updateUserPassword, signOut } = useAuth();
  const { profile, updateProfile, isLoading } = useUserProfile();
  const isUpdating = updateProfile.isPending;
  const { addNotification, showConfirmation } = useUI();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile form state
  const [formData, setFormData] = useState({
    full_name: '',
    designation: '',
    phone: '',
    whatsapp_number: '',
    company_name: '',
    bio: '',
  });




  // Password change state
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        designation: profile.designation || '',
        phone: profile.phone?.replace('+971', '').trim() || '',
        whatsapp_number:
          profile.whatsapp_number?.replace('+971', '').trim() || '',
        company_name: profile.company_name || '',
        bio: profile.bio || '',
      });
      // setAvatarPreview(profile.photo_url || null); // Temporarily disabled
    }
  }, [profile]);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    // Update profile (temporarily removed avatar upload)
    const profileUpdates = {
      ...formData,
      phone: formData.phone ? `+971 ${formData.phone}` : null,
      whatsapp_number: formData.whatsapp_number
        ? `+971 ${formData.whatsapp_number}`
        : null,
      // photo_url: profile.photo_url, // Keep existing photo URL
    };

    updateProfile.mutate(profileUpdates);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      addNotification('Error', 'Passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      await updateUserPassword(passwordData.password);
      addNotification('Success', 'Your password has been updated.');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err: unknown) {
      addNotification('Error', err instanceof Error ? err.message : 'Failed to update password.');
    } finally {
      setChangingPassword(false);
    }
  };



  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">
          <SkeletonLoader className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-bold">My Account</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Security
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="p-6 space-y-6">
                {/* Avatar Section - Temporarily disabled */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profile?.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {profile?.designation || 'No designation'}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      readOnly
                      className="w-full mt-1 p-2 border rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 rounded-l-md">
                        +971
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-r-md bg-gray-50"
                        placeholder="50 123 4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      WhatsApp Number
                    </label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 rounded-l-md">
                        +971
                      </span>
                      <input
                        type="tel"
                        name="whatsapp_number"
                        value={formData.whatsapp_number}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-r-md bg-gray-50"
                        placeholder="55 987 6543"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
              {/* Save Button and Sign Out */}
              <div className="flex justify-between items-center p-4 border-t bg-gray-50 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => showConfirmation('Sign Out', 'Are you sure you want to sign out?', signOut)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isUpdating ? (
                    'Saving...'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6">
              {/* Password Change */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <KeyRound className="w-5 h-5 mr-2" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.password}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full p-2 pr-10 border rounded-md"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <PasswordStrengthIndicator
                      password={passwordData.password}
                      onValidationChange={setIsPasswordValid}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      changingPassword ||
                      !isPasswordValid ||
                      passwordData.password !== passwordData.confirmPassword
                    }
                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {changingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
