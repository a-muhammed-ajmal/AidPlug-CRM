
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, User, Shield, LogOut, KeyRound, Eye, EyeOff, X, TrendingUp, Users, DollarSign, Calendar, Activity, Settings, Bell } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import SkeletonLoader from '../common/SkeletonLoader';

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

// Mock data for account statistics - in a real app, this would come from APIs
const getAccountStats = () => ({
    totalClients: 45,
    activeDeals: 12,
    monthlyRevenue: 250000,
    completedTasks: 28,
    upcomingMeetings: 5,
    conversionRate: 68
});

const getRecentActivity = () => [
    { id: 1, type: 'deal', action: 'Closed deal with Ahmed Al-Rashid', time: '2 hours ago', amount: 'AED 150,000', icon: '💰' },
    { id: 2, type: 'client', action: 'Added new client Fatima Al-Zahra', time: '1 day ago', icon: '👤' },
    { id: 3, type: 'task', action: 'Completed follow-up call', time: '2 days ago', icon: '✅' },
    { id: 4, type: 'meeting', action: 'Scheduled meeting with John Smith', time: '3 days ago', icon: '📅' },
];

export default function AccountPage() {
    const { profile, isLoading } = useUserProfile();
    const { signOut } = useAuth();
    const { showConfirmation } = useUI();
    const navigate = useNavigate();
    const [showChangePassword, setShowChangePassword] = useState(false);

    const stats = getAccountStats();
    const recentActivity = getRecentActivity();

    const handleSignOut = () => {
        showConfirmation('Sign Out', 'Are you sure you want to sign out?', signOut);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center space-x-4">
                    <SkeletonLoader className="w-20 h-20 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <SkeletonLoader className="h-6 w-3/4" />
                        <SkeletonLoader className="h-4 w-1/2" />
                        <SkeletonLoader className="h-4 w-1/4" />
                    </div>
                </div>
                <SkeletonLoader className="h-24 rounded-xl" />
                <SkeletonLoader className="h-14 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative flex items-center space-x-4">
                    <div className="w-24 h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-4 border-white border-opacity-30">
                        {profile?.photo_url ? <img src={profile.photo_url} alt="User" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-white" />}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                        <p className="text-blue-100">{profile?.designation || 'Banking Sales Professional'}</p>
                        <p className="text-sm text-blue-100 mt-1">{profile?.company_name || 'Company not specified'}</p>
                        <button
                            onClick={() => navigate('/account/edit')}
                            className="mt-3 inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-opacity-30 transition-all duration-200"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                            <p className="text-sm text-gray-600">Total Clients</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeDeals}</p>
                            <p className="text-sm text-gray-600">Active Deals</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">AED {stats.monthlyRevenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Monthly Revenue</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcomingMeetings}</p>
                            <p className="text-sm text-gray-600">Upcoming Meetings</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                            <p className="text-sm text-gray-600">Tasks Completed</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                            <p className="text-sm text-gray-600">Conversion Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-blue-600" />
                        Recent Activity
                    </h3>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex items-start space-x-3">
                                <div className="text-lg flex-shrink-0">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{activity.action}</p>
                                    {activity.amount && <p className="text-sm text-green-600 font-medium">{activity.amount}</p>}
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                                    →
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-gray-600" />
                            Account Settings
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <button
                            onClick={() => navigate('/account/edit')}
                            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Edit3 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Edit Profile</span>
                            </div>
                            <span className="text-gray-400">→</span>
                        </button>

                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <KeyRound className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium">Change Password</span>
                            </div>
                            <span className="text-gray-400">→</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <Bell className="w-5 h-5 mr-2 text-gray-600" />
                            Preferences
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Email Notifications</span>
                            <button className="w-10 h-6 bg-gray-200 rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform duration-200"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Push Notifications</span>
                            <button className="w-10 h-6 bg-blue-600 rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform duration-200"></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Mobile Sync</span>
                            <button className="w-10 h-6 bg-blue-600 rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform duration-200"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sign Out */}
            <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center py-3 px-4 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                    </button>
                </div>
            </div>
            
            {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
        </div>
    );
}