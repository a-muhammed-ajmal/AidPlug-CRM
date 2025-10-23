import React, { useState, useMemo } from 'react';
import { Plus, Calendar, List, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import EmptyState from '../common/EmptyState';
import { Task } from '../../types';

type FilterOption = 'all' | 'today' | 'pending' | 'completed';

const TaskKPICard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon: React.ReactNode }) => (
  <div className={`rounded-lg border-l-4 p-4 flex items-center space-x-3 bg-white shadow-sm ${color}`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
    </div>
  </div>
);

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<FilterOption>('all');

  const today = new Date().toISOString().split('T')[0];
  
  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'today') return task.due_date === today;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  }), [tasks, filter, today]);

  const sortedTasks = useMemo(() => [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  }), [filteredTasks]);

  const stats = useMemo(() => ({
      pendingToday: tasks.filter(t => t.due_date === today && t.status === 'pending').length,
      overdue: tasks.filter(t => t.due_date < today && t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks, today]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };
  
  const handleAddNew = () => {
    setEditingTask(null);
    setShowAddModal(true);
  };

  const filterOptions: FilterOption[] = ['all', 'today', 'pending', 'completed'];

  return (
    <div className="relative pb-20">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TaskKPICard
                title="Pending Today"
                value={stats.pendingToday}
                color="border-blue-500"
                icon={<Calendar className="w-8 h-8 text-blue-500" />}
            />
            <TaskKPICard
                title="Overdue"
                value={stats.overdue}
                color="border-red-500"
                icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
            />
            <TaskKPICard
                title="Completed"
                value={stats.completed}
                color="border-green-500"
                icon={<CheckCircle className="w-8 h-8 text-green-500" />}
            />
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {filterOptions.map((filterOption) => (
                <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                    filter === filterOption
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} />
            ))
          ) : (
             <EmptyState
              icon={<List className="w-12 h-12 text-gray-300" />}
              title="No Tasks Found"
              message={filter === 'all' ? "Add your first task to get started." : "Try adjusting your filter."}
            />
          )}
        </div>
      </div>
      
      <button
        onClick={handleAddNew}
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-90"
        aria-label="Add new task"
      >
        <Plus className="w-7 h-7" />
      </button>

      {showAddModal && <AddTaskModal onClose={handleCloseModal} initialData={editingTask} />}
    </div>
  );
}