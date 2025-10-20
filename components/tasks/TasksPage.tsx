
import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

type FilterOption = 'all' | 'today' | 'pending' | 'completed';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');

  const today = new Date().toISOString().split('T')[0];
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'today') return task.due_date === today;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'pending' ? -1 : 1;
    }
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filterOptions: FilterOption[] = ['all', 'today', 'pending', 'completed'];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
          <p className="text-gray-600 text-sm mt-1">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filterOptions.map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tasks found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
