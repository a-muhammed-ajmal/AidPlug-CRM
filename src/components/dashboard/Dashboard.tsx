import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle as CheckCircleIcon,
  Clock,
  Gift,
  List,
  Plus,
  Star,
  User,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI, Activity } from '../../contexts/UIContext';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import QuickActionButton from '../common/QuickActionButton';
import SkeletonLoader from '../common/SkeletonLoader';

// Reusable component from the monolithic file, now placed here for dashboard use
const DashboardKPICard = ({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-lg shadow-sm overflow-hidden bg-white flex flex-col">
    <div
      className={`${color} text-white p-3 relative h-20 flex items-center justify-center`}
    >
      <div className="absolute -right-1 -bottom-1 opacity-20 text-white">
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
    <div className="p-3 flex-grow flex items-center justify-center">
      <p className="text-sm text-gray-700 font-medium leading-tight text-center">
        {title}
      </p>
    </div>
  </div>
);

const ThingsToDo = () => {
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const displayedTasks = pendingTasks.slice(0, 5);

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <List className="w-5 h-5 mr-2 text-purple-600" />
          Things to Get Done
        </h3>
        {tasks.length > 5 && (
          <button
            onClick={() => navigate('/tasks')}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            See all
          </button>
        )}
      </div>

      {displayedTasks.length > 0 ? (
        <div className="space-y-3">
          {displayedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <List className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {task.title}
                </p>
                <p className="text-xs text-gray-500">{`Due: ${new Date(task.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <CheckCircleIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">All tasks completed!</p>
        </div>
      )}
    </div>
  );
};

interface Event {
  id: string;
  type: 'Birthday' | 'Anniversary';
  date: Date;
  clientName: string;
  years: number | null;
}

const UpcomingEvents = () => {
  const { clients } = useClients();
  const events: Event[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  clients.forEach((client) => {
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
      if (
        anniversaryDate >= today &&
        anniversaryDate <= sevenDaysFromNow &&
        years > 0
      ) {
        events.push({
          id: `a-${client.id}`,
          type: 'Anniversary',
          date: anniversaryDate,
          clientName: client.full_name,
          years: years,
        });
      }
    }
  });

  const sortedEvents = events.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <Award className="w-5 h-5 mr-2 text-orange-600" />
        Upcoming Events
      </h3>
      {sortedEvents.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  event.type === 'Birthday'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {event.type === 'Birthday' ? (
                  <Gift className="w-4 h-4" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {event.clientName}
                </p>
                <p className="text-xs text-gray-500">
                  {event.type === 'Anniversary'
                    ? `${event.years} Year Anniversary`
                    : 'Birthday'}
                </p>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {event.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
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
  const { setTitle } = useUI();

  // Set the page title when this component mounts
  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);
  const navigate = useNavigate();
  const { activities } = useUI();
  const { deals, isLoading: dealsLoading } = useDeals();
  const { salesCycle } = useSalesCycle();

  const activeDeals = deals.filter(
    (d) => !['completed', 'unsuccessful'].includes(d.stage || '')
  ).length;

  // Calculate days remaining from today until end of sales cycle
  const daysRemaining = salesCycle && salesCycle.end_date ? (() => {
    const today = new Date();
    const endDate = new Date(salesCycle.end_date);
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  })() : 0;

  const doneSuccessfully = deals.filter((d) => d.stage === 'completed').length;

  const timeSince = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    if (seconds < 10) return 'just now';
    return Math.floor(seconds) + 's ago';
  };

  const getActivityIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      lead_add: <Users className="w-4 h-4 text-white" />,
      lead_update: <Users className="w-4 h-4 text-white" />,
      lead_delete: <Users className="w-4 h-4 text-white" />,
      lead_convert: <Users className="w-4 h-4 text-white" />,
      client_add: <User className="w-4 h-4 text-white" />,
      deal_add: <Briefcase className="w-4 h-4 text-white" />,
      deal_stage_update: <Briefcase className="w-4 h-4 text-white" />,
      deal_delete: <Briefcase className="w-4 h-4 text-white" />,
      task_add: <List className="w-4 h-4 text-white" />,
      task_complete: <CheckCircleIcon className="w-4 h-4 text-white" />,
    };
    const colorMap: { [key: string]: string } = {
      lead_add: 'bg-green-500',
      lead_update: 'bg-blue-500',
      lead_delete: 'bg-red-500',
      lead_convert: 'bg-purple-500',
      client_add: 'bg-indigo-500',
      deal_add: 'bg-green-500',
      deal_stage_update: 'bg-blue-500',
      deal_delete: 'bg-red-500',
      task_add: 'bg-yellow-500',
      task_complete: 'bg-green-500',
    };
    return (
      <div
        className={`w-8 h-8 ${colorMap[type] || 'bg-gray-500'} rounded-full flex items-center justify-center flex-shrink-0`}
      >
        {iconMap[type]}
      </div>
    );
  };

  if (dealsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <SkeletonLoader className="h-28 rounded-lg" />
          <SkeletonLoader className="h-28 rounded-lg" />
          <SkeletonLoader className="h-28 rounded-lg" />
        </div>
        <SkeletonLoader className="h-48 rounded-xl" />
        <SkeletonLoader className="h-40 rounded-xl" />
        <SkeletonLoader className="h-40 rounded-xl" />
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
          icon={<CheckCircleIcon size={56} />}
        />
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton
            onClick={() =>
              navigate('/leads', { state: { showAddModal: true } })
            }
            icon={<Plus className="w-5 h-5 text-white" />}
            title="New Lead"
            subtitle="ADD PROSPECT"
            colorClass="bg-blue-500"
          />
          <QuickActionButton
            onClick={() => navigate('/tasks')}
            icon={<List className="w-5 h-5 text-white" />}
            title="View Tasks"
            subtitle="CHECK TASKS"
            colorClass="bg-green-500"
          />
          <QuickActionButton
            onClick={() =>
              navigate('/clients', { state: { showAddModal: true } })
            }
            icon={<User className="w-5 h-5 text-white" />}
            title="Add Client"
            subtitle="NEW ACCOUNT"
            colorClass="bg-purple-500"
          />
          <QuickActionButton
            onClick={() =>
              navigate('/deals', { state: { showAddModal: true } })
            }
            icon={<Briefcase className="w-5 h-5 text-white" />}
            title="New Deal"
            subtitle="ADD JOURNEY"
            colorClass="bg-orange-500"
          />
        </div>
      </div>

      <ThingsToDo />

      <UpcomingEvents />

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-green-600" />
          Recent Activity
        </h3>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 5).map((item: Activity) => (
              <div key={item.id} className="flex items-center space-x-3">
                {getActivityIcon(item.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.message}
                  </p>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {timeSince(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Zap className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              Your recent activities will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
