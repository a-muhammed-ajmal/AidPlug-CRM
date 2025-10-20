import React, { useState, useMemo } from 'react';
import { Edit3, User, Shield, Smartphone, Clock, CheckCircle, TrendingUp, List, Users, FileText, Briefcase, LogOut } from 'lucide-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { useLeads } from '../../hooks/useLeads';
import { mockActivity } from '../../lib/constants';
import UserFormModal from '../settings/UserFormModal';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

const AccountActivityFeed = () => {
    const getActivityIcon = (type: string) => {
        const icons: { [key: string]: React.ReactNode } = {
            lead_add: <Users className="w-4 h-4 text-white" />, deal_update: <Briefcase className="w-4 h-4 text-white" />, task_complete: <CheckCircle className="w-4 h-4 text-white" />, client_add: <User className="w-4 h-4 text-white" />, note_add: <FileText className="w-4 h-4 text-white" />,
        };
        const colors: { [key: string]: string } = {
            lead_add: 'bg-green-500', deal_update: 'bg-blue-500', task_complete: 'bg-orange-500', client_add: 'bg-purple-500', note_add: 'bg-gray-500',
        };
        return <div className={`w-8 h-8 ${colors[type] || 'bg-gray-500'} rounded-full flex items-center justify-center flex-shrink-0`}>{icons[type]}</div>;
    };
    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
             <div className="space-y-4">
                {mockActivity.map(item => (<div key={item.id} className="flex items-center space-x-3">{getActivityIcon(item.type)}<div className="flex-1"><p className="text-sm font-medium text-gray-900">{item.text}</p><p className="text-xs text-gray-500">{item.time}</p></div></div>))}
             </div>
        </div>
    );
};

const AccountPerformance = () => {
    const { salesCycle } = useSalesCycle();
    const { deals } = useDeals();
    const { tasks } = useTasks();
    const { leads } = useLeads();

    const performanceMetrics = useMemo(() => {
        if (!salesCycle) return { dealsClosed: 0, revenueGenerated: 0, taskCompletionRate: 0, newLeads: 0 };

        const cycleStartDate = new Date(salesCycle.start_date);
        const cycleEndDate = new Date(salesCycle.end_date);
        cycleEndDate.setHours(23, 59, 59, 999);

        const dealsInCycle = deals.filter(deal => {
            if (!deal.completed_date) return false;
            const completedDate = new Date(deal.completed_date);
            return deal.stage === 'completed' && completedDate >= cycleStartDate && completedDate <= cycleEndDate;
        });
        const revenue = dealsInCycle.reduce((sum, deal) => sum + deal.amount, 0);
        const completedTasks = tasks.filter(t => t.status === 'completed').length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return { dealsClosed: dealsInCycle.length, revenueGenerated: revenue, taskCompletionRate: completionRate, newLeads: leads.length };
    }, [leads, deals, tasks, salesCycle]);

    const MetricCard = ({icon, title, value, color}: {icon: React.ReactNode, title: string, value: string | number, color: string}) => (
        <div className={`bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3`}>
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>{icon}</div>
            <div><p className="text-xs text-gray-500">{title}</p><p className="text-lg font-bold text-gray-900">{value}</p></div>
        </div>
    );
    
    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">This Sales Cycle</h3>
            <div className="grid grid-cols-2 gap-4">
                <MetricCard icon={<CheckCircle className="w-5 h-5 text-white" />} title="Deals Closed" value={performanceMetrics.dealsClosed} color="bg-green-500" />
                <MetricCard icon={<TrendingUp className="w-5 h-5 text-white" />} title="Revenue (AED)" value={`${(performanceMetrics.revenueGenerated / 1000).toFixed(0)}k`} color="bg-blue-500" />
                <MetricCard icon={<Users className="w-5 h-5 text-white" />} title="New Leads" value={performanceMetrics.newLeads} color="bg-purple-500" />
                <MetricCard icon={<List className="w-5 h-5 text-white" />} title="Task Completion" value={`${performanceMetrics.taskCompletionRate}%`} color="bg-orange-500" />
            </div>
        </div>
    );
};

const AccountSecurity = () => {
    const [twoFactor, setTwoFactor] = useState(false);
    const SecurityItem = ({icon, title, description, action}: {icon: React.ReactNode, title: string, description: string, action: React.ReactNode}) => (<div className="flex items-center justify-between py-3 border-b last:border-b-0"><div className="flex items-center space-x-3">{icon}<div><p className="font-medium text-gray-800">{title}</p><p className="text-sm text-gray-500">{description}</p></div></div><div>{action}</div></div>);
    const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (<button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? 'transform translate-x-6' : 'transform translate-x-0.5'}`}></div></button>);

    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
            <SecurityItem icon={<Shield className="w-5 h-5 text-gray-500" />} title="Password" description="Last changed 3 months ago" action={<button className="text-sm font-medium text-blue-600 hover:underline">Change</button>} />
            <SecurityItem icon={<Smartphone className="w-5 h-5 text-gray-500" />} title="Two-Factor Authentication" description={twoFactor ? "Enabled" : "Disabled"} action={<Toggle enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />} />
            <SecurityItem icon={<Clock className="w-5 h-5 text-gray-500" />} title="Login History" description="Check recent login activity" action={<button className="text-sm font-medium text-blue-600 hover:underline">View</button>} />
        </div>
    );
};

export default function AccountPage() {
    const { profile, isLoading } = useUserProfile();
    const { signOut } = useAuth();
    const { showConfirmation } = useUI();
    const [accountSubTab, setAccountSubTab] = useState('activity');
    const [isEditingUser, setIsEditingUser] = useState(false);

    const handleSignOut = () => {
        showConfirmation(
            'Sign Out',
            'Are you sure you want to sign out?',
            () => {
                signOut();
            }
        );
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
                    <button onClick={() => setIsEditingUser(true)} className="mt-2 text-sm font-medium text-blue-600 hover:underline flex items-center"><Edit3 className="w-3 h-3 mr-1" /> Edit Profile</button>
                </div>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setAccountSubTab('activity')} className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${accountSubTab === 'activity' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Activity</button>
                <button onClick={() => setAccountSubTab('performance')} className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${accountSubTab === 'performance' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Performance</button>
                <button onClick={() => setAccountSubTab('security')} className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${accountSubTab === 'security' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Security</button>
            </div>

            <div>
                {accountSubTab === 'activity' && <AccountActivityFeed />}
                {accountSubTab === 'performance' && <AccountPerformance />}
                {accountSubTab === 'security' && <AccountSecurity />}
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-sm"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </button>
            </div>

            {isEditingUser && profile && <UserFormModal initialData={profile} onClose={() => setIsEditingUser(false)} />}
        </div>
    );
}