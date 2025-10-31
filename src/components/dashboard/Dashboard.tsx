import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle as CheckCircleIcon,
  Clock,
  Edit3,
  Gift,
  List,
  Plus,
  Star,
  Trash2,
  User,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../contexts/UIContextDefinitions';
import { Activity } from '../../contexts/UIContextDefinitions';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { useTasks } from '../../hooks/useTasks';
import { useSalesCycle } from '../../hooks/useSalesCycle';
import QuickActionButton from '../common/QuickActionButton';
import SkeletonLoader from '../common/SkeletonLoader';
import { Task } from '../../types';

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
      style={{ backgroundColor: color }}
      className="text-white p-3 relative h-20 flex items-center justify-center"
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
  const { showConfirmation, addNotification } = useUI();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const displayedTasks = pendingTasks.slice(0, 5);

  const { updateTask, deleteTask } = useTasks();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCompleteTask = (task: Task) => {
    updateTask.mutate({
      id: task.id,
      updates: { status: 'completed' },
    });
    setSelectedTask(null);
  };

  const handleDeleteTask = (task: Task) => {
    showConfirmation(
      'Delete Task?',
      'Are you sure you want to delete this task?',
      () => {
        deleteTask.mutate(task.id, {
          onSuccess: () => {
            addNotification(
              'Task Deleted',
              `"${task.title}" has been removed.`
            );
            setSelectedTask(null);
          },
        });
      }
    );
  };

  const handleCall = () => {
    // For now, we'll use a placeholder since tasks don't have direct client contact info
    // In a real implementation, you'd fetch client data based on related_to_id
    alert('Call functionality would open phone dialer with client number');
  };

  const handleWhatsApp = () => {
    // For now, we'll use a placeholder since tasks don't have direct client contact info
    alert('WhatsApp functionality would open WhatsApp with client number');
  };

  const handleEmail = () => {
    // For now, we'll use a placeholder since tasks don't have direct client contact info
    alert('Email functionality would open email client with client address');
  };

  return (
    <>
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
                className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <List className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{`Due: ${new Date(task.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${task.priority === 'urgent' ? 'bg-red-100 text-red-800' : task.priority === 'high' ? 'bg-orange-100 text-orange-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
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

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Task Details
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">
                  {selectedTask.title}
                </h4>
                {selectedTask.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTask.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(selectedTask.due_date).toLocaleDateString(
                      'en-GB'
                    )}
                  </span>
                </div>
                {selectedTask.time && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedTask.time}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${selectedTask.priority === 'urgent' ? 'bg-red-100 text-red-800' : selectedTask.priority === 'high' ? 'bg-orange-100 text-orange-800' : selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                >
                  {selectedTask.priority?.toUpperCase() || 'LOW'}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${selectedTask.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {selectedTask.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <button
                  onClick={() => handleCompleteTask(selectedTask)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() =>
                    navigate('/tasks', { state: { editTask: selectedTask } })
                  }
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteTask(selectedTask)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <button
                  onClick={handleCall}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  📞 <span>Call</span>
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  💬 <span>WhatsApp</span>
                </button>
                <button
                  onClick={handleEmail}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  ✉️ <span>Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
  const daysRemaining =
    salesCycle && salesCycle.end_date
      ? (() => {
          const today = new Date();
          const endDate = new Date(salesCycle.end_date);
          today.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          const diffTime = endDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return Math.max(0, diffDays);
        })()
      : 0;

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
          color="#5d5dff"
          icon={<Briefcase size={56} />}
        />
        <DashboardKPICard
          title="Days Remaining"
          value={daysRemaining}
          color="#ff5d5d"
          icon={<Clock size={56} />}
        />
        <DashboardKPICard
          title="Done Successfully"
          value={doneSuccessfully}
          color="#5dff5d"
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
            icon={<Plus className="w-6 h-6 text-white" />}
            title="New Lead"
            subtitle="Add Prospect"
            colorClass="bg-blue-500"
          />
          <QuickActionButton
            onClick={() =>
              navigate('/tasks', { state: { showAddModal: true } })
            }
            icon={<Plus className="w-6 h-6 text-white" />}
            title="Add Task"
            subtitle="New Task"
            colorClass="bg-green-500"
          />
          <QuickActionButton
            onClick={() =>
              navigate('/clients', { state: { showAddModal: true } })
            }
            icon={<User className="w-6 h-6 text-white" />}
            title="Add Client"
            subtitle="New Account"
            colorClass="bg-purple-500"
          />
          <QuickActionButton
            onClick={() =>
              navigate('/deals', { state: { showAddModal: true } })
            }
            icon={<Briefcase className="w-6 h-6 text-white" />}
            title="New Deal"
            subtitle="Add Journey"
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
            {activities
              .filter((activity: Activity) => {
                const activityDate = new Date(activity.timestamp);
                const now = new Date();
                const diffInHours =
                  (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);
                // Filter for very important updates only
                const importantTypes = [
                  'lead_convert',
                  'deal_stage_update',
                  'task_complete',
                ];
                return (
                  diffInHours <= 24 && importantTypes.includes(activity.type)
                );
              })
              .slice(0, 5)
              .map((item: Activity) => (
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
