import React from 'react';
import { CheckCircle, Circle, Clock, Calendar, Trash2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
}

// FIX: Changed to React.FC to correctly type component props, resolving the issue
// where the 'key' prop was being incorrectly flagged as an error by TypeScript.
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleComplete, deleteTask } = useTasks();

  const priorityColors: { [key: string]: string } = {
    urgent: 'border-red-300',
    high: 'border-orange-300',
    medium: 'border-yellow-300',
    low: 'border-green-300',
  };

  const priorityTagColors: { [key: string]: string } = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const typeIcons: { [key: string]: string } = {
    call: '📞',
    meeting: '👥',
    documentation: '📄',
    verification: '✓',
    follow_up: '🔄',
  };

  const isOverdue = new Date(task.due_date) < new Date(new Date().toDateString()) && task.status === 'pending';

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${priorityColors[task.priority || 'low']}`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => toggleComplete({ id: task.id, status: task.status })}
          className="mt-1 flex-shrink-0"
        >
          {task.status === 'completed' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-gray-800 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {typeIcons[task.type || 'call']} {task.title}
            </h3>
            <button
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  deleteTask(task.id);
                }
              }}
              className="text-gray-400 hover:text-red-600 ml-2 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mt-1 break-words">{task.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
              isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.due_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
              {isOverdue && <span className="font-semibold ml-1">OVERDUE</span>}
            </div>

            {task.time && (
              <div className="flex items-center space-x-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                <span>{task.time}</span>
              </div>
            )}

            {task.priority && (
                <span className={`text-xs font-medium px-2 py-1 rounded ${priorityTagColors[task.priority]}`}>
                {task.priority.toUpperCase()}
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
