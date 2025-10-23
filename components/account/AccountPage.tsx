
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, User, Shield, LogOut, KeyRound, Eye, EyeOff, X } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';

// New component for changing password
const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const { updateUserPassword } = useAuth();
    const { addNotification } = useUI();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await updateUserPassword(password);
            addNotification('Success', 'Your password has been updated.');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end sm:items-center animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl shadow-xl animate-slide-up">
                <header className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-lg font-bold">Change Password</h1>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
                        <div>
                            <label className="text-sm font-medium">New Password</label>
                            <div className="relative mt-1">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 pr-10 border rounded-md" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                            <PasswordStrengthIndicator password={password} onValidationChange={setIsPasswordValid} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                    </main>
                    <footer className="p-4 bg-gray-50 border-t">
                        <button type="submit" disabled={loading || !isPasswordValid || password !== confirmPassword} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default function AccountPage() {
    const { profile, isLoading } = useUserProfile();
    const { signOut } = useAuth();
    const { showConfirmation } = useUI();
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleSignOut = () => {
        showConfirmation('Sign Out', 'Are you sure you want to sign out?', signOut);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profile?.photo_url ? <img src={profile.photo_url} alt="User" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-white" />}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{profile?.full_name}</h2>
                    <p className="text-sm text-gray-600">{profile?.designation || 'N/A'}</p>
                    <button onClick={() => navigate('/account/edit')} className="mt-2 text-sm font-medium text-blue-600 hover:underline flex items-center"><Edit3 className="w-3 h-3 mr-1" /> Edit Profile</button>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b"><h3 className="font-semibold text-gray-900">Security</h3></div>
                <div className="p-4">
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-3">
                            <KeyRound className="w-5 h-5 text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-800">Password</p>
                                <p className="text-sm text-gray-500">Change your password regularly</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => setShowChangePassword(true)} className="text-sm font-medium text-blue-600 hover:underline">Change</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button onClick={handleSignOut} className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-sm">
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </button>
            </div>
            
            {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
        </div>
    );
}
