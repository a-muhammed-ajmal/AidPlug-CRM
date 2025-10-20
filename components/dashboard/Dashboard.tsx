
import React from 'react';
import { Users, TrendingUp, DollarSign, CheckSquare } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useTasks } from '../../hooks/useTasks';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import KPICard from './KPICard';
import TaskList from './TaskList';

export default function Dashboard() {
  const { leads, isLoading: leadsLoading } = useLeads();
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { clients, isLoading: clientsLoading } = useClients();
  const { deals, isLoading: dealsLoading } = useDeals();

  if (leadsLoading || tasksLoading || clientsLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(task => task.due_date === today && task.status === 'pending');

  const qualifiedLeads = leads.filter(l => l.qualification_status === 'qualified').length;
  const activeDeals = deals.filter(d => d.stage !== 'completed' && d.stage !== 'unsuccessful').length;

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">Here's your overview for today</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <KPICard
          icon={Users}
          label="Total Leads"
          value={leads.length}
          color="blue"
        />
        <KPICard
          icon={TrendingUp}
          label="Active Clients"
          value={clients.length}
          color="green"
        />
        <KPICard
          icon={DollarSign}
          label="Active Deals"
          value={activeDeals}
          color="yellow"
        />
        <KPICard
          icon={CheckSquare}
          label="Today's Tasks"
          value={todayTasks.length}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Tasks</h3>
        <TaskList tasks={todayTasks} />
      </div>
    </div>
  );
}
