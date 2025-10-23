import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Upload, CheckCircle } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { supabase } from '../../lib/supabase';

export default function EditProfilePage() {
    const { user } = useAuth();
    const { profile, updateProfile, isLoading } = useUserProfile();
    const { addNotification } = useUI();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        full_name: '',
        designation: '',
        phone: '',
        whatsapp_number: '',
        company_name: '',
        bio: '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                designation: profile.designation || '',
                phone: profile.phone?.replace('+971', '').trim() || '',
                whatsapp_number: profile.whatsapp_number?.replace('+971', '').trim() || '',
                company_name: profile.company_name || '',
                bio: profile.bio || '',
            });
            setAvatarPreview(profile.photo_url || null);
        }
    }, [profile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile) return;
        setIsSaving(true);
        
        let newAvatarUrl = profile.photo_url;

        try {
            // 1. Upload new avatar if one is selected
            if (avatarFile) {
                const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                newAvatarUrl = urlData.publicUrl;
            }

            // 2. Update user profile data
            const profileUpdates = {
                ...formData,
                phone: formData.phone ? `+971 ${formData.phone}` : null,
                whatsapp_number: formData.whatsapp_number ? `+971 ${formData.whatsapp_number}` : null,
                photo_url: newAvatarUrl,
            };

            updateProfile(profileUpdates, {
                onSuccess: () => {
                    addNotification('Profile Saved', 'Your information has been updated successfully.');
                    navigate('/account');
                },
                onError: (err) => {
                    throw err; // Throw to be caught by outer catch block
                }
            });

        } catch (err: any) {
            addNotification('Save Failed', err.message || 'An error occurred while saving your profile.');
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
         return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Account
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center">
                    {isSaving ? 'Saving...' : <><CheckCircle className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {avatarPreview ? <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-gray-400" />}
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-700">
                            <Upload className="w-4 h-4" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Update Your Profile</h2>
                        <p className="text-sm text-gray-500">Keep your personal details up to date.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-gray-50" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={profile?.email || ''} readOnly className="w-full mt-1 p-2 border rounded-md bg-gray-200 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-gray-50" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md bg-gray-50" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                        <div className="flex mt-1">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 rounded-l-md">+971</span>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-r-md bg-gray-50" placeholder="50 123 4567" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                        <div className="flex mt-1">
                            <span className="inline-flex items-center px-3 text-sm bg-gray-100 border border-r-0 rounded-l-md">+971</span>
                            <input type="tel" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} className="w-full p-2 border rounded-r-md bg-gray-50" placeholder="55 987 6543" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                         <label className="text-sm font-medium text-gray-700">Bio</label>
                         <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell us a bit about yourself..." className="w-full mt-1 p-2 border rounded-md bg-gray-50" />
                    </div>
                </div>
            </div>
        </form>
    );
}