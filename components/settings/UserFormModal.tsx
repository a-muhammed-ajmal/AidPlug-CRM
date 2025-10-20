import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUI } from '../../contexts/UIContext';
import { Database } from '../../types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface UserFormModalProps {
    initialData: UserProfile;
    onClose: () => void;
}

export default function UserFormModal({ initialData, onClose }: UserFormModalProps) {
    const { updateProfile } = useUserProfile();
    const { addNotification } = useUI();
    const [formData, setFormData] = useState({
        full_name: initialData.full_name || '',
        designation: initialData.designation || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        updateProfile(formData, {
            onSuccess: () => {
                addNotification('Profile Updated', 'Your details have been saved.');
                onClose();
            },
            onError: (err) => {
                addNotification('Error', (err as Error).message);
                setLoading(false);
            },
            onSettled: () => {
                setLoading(false);
            }
        });
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end sm:items-center animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl shadow-xl animate-slide-up">
                <header className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-lg font-bold">Edit Profile</h1>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                    </main>
                    <footer className="p-4 bg-gray-50 border-t">
                        <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}