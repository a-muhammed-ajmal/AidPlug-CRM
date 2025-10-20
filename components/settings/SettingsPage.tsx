import React, { useState } from 'react';
import { User, Bell, Mail, Smartphone, Calendar, Edit3 } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserPreferences } from '../../hooks/useUserPreferences';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import UserFormModal from './UserFormModal';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? 'transform translate-x-6' : 'transform translate-x-0.5'}`}></div>
    </button>
);

export default function SettingsPage() {
    const { profile, isLoading: profileLoading } = useUserProfile();
    const { preferences, updatePreferences, isLoading: prefsLoading } = useUserPreferences();
    const { salesCycle, updateSalesCycle, isLoading: cycleLoading } = useSalesCycle();
    const [isEditingUser, setIsEditingUser] = useState(false);

    const handlePrefChange = (key: 'push_notifications' | 'email_notifications' | 'mobile_sync') => {
        if (preferences) {
            updatePreferences({ [key]: !preferences[key] });
        }
    };
    
    const handleCycleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(salesCycle) {
            updateSalesCycle({ ...salesCycle, [e.target.name]: e.target.value });
        }
    };
    
    if (profileLoading || prefsLoading || cycleLoading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {profile?.photo_url ? <img src={profile.photo_url} alt="User" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{profile?.full_name}</h3>
                        <p className="text-sm text-gray-600">{profile?.designation || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{profile?.email}</p>
                    </div>
                </div>
                <button onClick={() => setIsEditingUser(true)} className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b flex items-center space-x-3"><Calendar className="w-5 h-5 text-gray-600" /><h3 className="font-semibold text-gray-900">Sales Cycle</h3></div>
                <div className="p-4 space-y-4">
                    <div><label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" id="start_date" name="start_date" value={salesCycle?.start_date || ''} onChange={handleCycleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" /></div>
                    <div><label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" id="end_date" name="end_date" value={salesCycle?.end_date || ''} onChange={handleCycleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" /></div>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Preferences</h3></div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><Bell className="w-5 h-5 text-gray-600" /><span className="font-medium">Push Notifications</span></div><Toggle enabled={preferences?.push_notifications ?? true} onChange={() => handlePrefChange('push_notifications')} /></div>
                    <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-gray-600" /><span className="font-medium">Email Notifications</span></div><Toggle enabled={preferences?.email_notifications ?? false} onChange={() => handlePrefChange('email_notifications')} /></div>
                    <div className="flex items-center justify-between"><div className="flex items-center space-x-3"><Smartphone className="w-5 h-5 text-gray-600" /><span className="font-medium">Mobile Sync</span></div><Toggle enabled={preferences?.mobile_sync ?? true} onChange={() => handlePrefChange('mobile_sync')} /></div>
                </div>
            </div>
            
            {isEditingUser && profile && <UserFormModal initialData={profile} onClose={() => setIsEditingUser(false)} />}
        </div>
    );
}
