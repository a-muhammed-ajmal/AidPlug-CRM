import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { useClients } from '../../hooks/useClients';
import { Briefcase, Clock, CheckCircle, Zap, Plus, List, User, Upload, Activity, Award, Gift, Star, Calendar } from 'lucide-react';
import QuickActionButton from '../common/QuickActionButton';
import { useUI } from '../../contexts/UIContext';
import { mockActivity } from '../../lib/constants';
import StatusUpdates from './StatusUpdates';

// Reusable component from the monolithic file, now placed here for dashboard use
const DashboardKPICard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: React.ReactNode }) => (
  <div className="rounded-lg shadow-sm overflow-hidden bg-white flex flex-col">
    <div className={`${color} text-white p-3 relative h-20 flex items-center justify-center`}>
      <div className="absolute -right-1 -bottom-1 opacity-20 text-white">
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="p-3 flex-grow flex items-center justify-center">
      <p className="text-sm text-gray-700 font-medium leading-tight text-center">{title}</p>
    </div>
  </div>
);

const ThingsToDo = () => {
    const navigate = useNavigate();
    const { tasks } = useTasks();
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const displayedTasks = pendingTasks.slice(0, 5);

    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
            <List className="w-5 h-5 mr-2 text-purple-600" />
            Things to Get Done
            </h3>
            {tasks.length > 5 && (
                <button onClick={() => navigate('/tasks')} className="text-sm font-medium text-blue-600 hover:underline">
                    See all
                </button>
            )}
        </div>

        {displayedTasks.length > 0 ? (
            <div className="space-y-3">
            {displayedTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <List className="w-4 h-4" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{`Due: ${new Date(task.due_date).toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}`}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>{task.priority}</span>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">All tasks completed!</p>
            </div>
        )}
        </div>
    );
};

const UpcomingEvents = () => {
    const { clients } = useClients();
    const events: any[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    clients.forEach(client => {
        if (client.dob) {
            const birthDate = new Date(client.dob);
            birthDate.setFullYear(today.getFullYear());
            if (birthDate >= today && birthDate <= sevenDaysFromNow) {
                events.push({
                id: `b-${client.id}`,
                type: 'Birthday',
                date: birthDate,
                clientName: client.full_name,
                years: null,
                });
            }
        }
        if (client.client_since) {
            const anniversaryDate = new Date(client.client_since);
            const years = today.getFullYear() - anniversaryDate.getFullYear();
            anniversaryDate.setFullYear(today.getFullYear());
            if (anniversaryDate >= today && anniversaryDate <= sevenDaysFromNow && years > 0) {
                events.push({
                id: `a-${client.id}`,
                type: 'Anniversary',
                date: anniversaryDate,
                clientName: client.full_name,
                years: years
                });
            }
        }
    });

    const sortedEvents = events.sort((a, b) => a.date - b.date);

    return (
        <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            Upcoming Events
        </h3>
        {sortedEvents.length > 0 ? (
            <div className="space-y-3">
            {sortedEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    event.type === 'Birthday' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                    {event.type === 'Birthday' ? <Gift className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{event.clientName}</p>
                    <p className="text-xs text-gray-500">
                    {event.type === 'Anniversary' ? `${event.years} Year Anniversary` : 'Birthday'}
                    </p>
                </div>
                <span className="text-xs font-medium text-gray-600">
                    {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-4">
            <Calendar className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No upcoming events.</p>
            </div>
        )}
        </div>
    );
};


export default function Dashboard() {
    const navigate = useNavigate();
    const { addNotification } = useUI();
    const { deals, isLoading: dealsLoading } = useDeals();

    const activeDeals = deals.filter(d => !['completed', 'unsuccessful'].includes(d.stage || '')).length;
    // Note: sales cycle logic will be implemented in settings/account pages
    const daysRemaining = 15; // Placeholder
    const doneSuccessfully = deals.filter(d => d.stage === 'completed').length;

    if (dealsLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
                <DashboardKPICard 
                    title="Deals Processing" 
                    value={activeDeals}
                    color="bg-red-500" 
                    icon={<Briefcase size={56} />} 
                />
                <DashboardKPICard 
                    title="Days Remaining" 
                    value={daysRemaining} 
                    color="bg-orange-500" 
                    icon={<Clock size={56} />} 
                />
                <DashboardKPICard 
                    title="Done Successfully" 
                    value={doneSuccessfully}
                    color="bg-green-500" 
                    icon={<CheckCircle size={56} />} 
                />
            </div>

            <div className="bg-white rounded-xl p-4 border shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <QuickActionButton
                        onClick={() => navigate('/leads', { state: { showAddModal: true } })}
                        icon={<Plus className="w-5 h-5 text-white" />}
                        title="New Lead"
                        subtitle="Onboard new prospect"
                        colorClass="bg-blue-500"
                    />
                    <QuickActionButton
                        onClick={() => navigate('/tasks', { state: { showAddModal: true } })}
                        icon={<List className="w-5 h-5 text-white" />}
                        title="New Task"
                        subtitle="Add to your to-do"
                        colorClass="bg-green-500"
                    />
                    <QuickActionButton
                        onClick={() => navigate('/clients', { state: { showAddModal: true } })}
                        icon={<User className="w-5 h-5 text-white" />}
                        title="Add Client"
                        subtitle="Register new account"
                        colorClass="bg-purple-500"
                    />
                    <QuickActionButton
                        onClick={() => addNotification('Feature Coming Soon', 'Lead form sharing will be available in a future update.')}
                        icon={<Upload className="w-5 h-5 text-white" />}
                        title="Share Form"
                        subtitle="Collect lead information"
                        colorClass="bg-orange-500"
                    />
                </div>
            </div>
            
            <ThingsToDo />
            
            <UpcomingEvents />

            <div className="bg-white rounded-xl p-4 border shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity
                </h3>
                <div className="space-y-4">
                {mockActivity.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                           <Activity className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.text}</p>
                        </div>
                        <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                ))}
                </div>
            </div>

            <StatusUpdates />
        </div>
    );
}