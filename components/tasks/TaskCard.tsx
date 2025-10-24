import React from 'react';
import { CheckCircle, Circle, Clock, Calendar, Trash2, MoreVertical, Edit3 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { useUI } from '../../contexts/UIContext';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';


interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}


const TaskCard = React.memo(({ task, onEdit }: TaskCardProps) => {
  const { toggleComplete, deleteTask } = useTasks();
  const { showConfirmation, addNotification } = useUI();


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


  const today = new Date().toISOString().split('T')[0];
  const isOverdue = task.due_date < today && task.status === 'pending';

  // Format date to DD/MM/YYYY
  const formattedDate = new Date(task.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  
  const handleDelete = () => {
    showConfirmation(
      'Delete Task?',
      'Are you sure you want to delete this task? This action cannot be undone.',
      () => {
        deleteTask(task.id, {
          onSuccess: () => addNotification('Task Deleted', `"${task.title}" has been removed.`),
          onError: (error) => addNotification('Error', (error as Error).message || 'Failed to delete task.'),
        });
      }
    );
  };


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
            <h3 className={`font-semibold text-gray-800 break-words pr-2 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {typeIcons[task.type || 'call']} {task.title}
            </h3>
            <DropdownMenu trigger={<MoreVertical className="w-4 h-4 text-gray-500" />} children={
              <>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(task); }} icon={<Edit3 className="w-4 h-4 mr-2" />} children="Edit" />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); }} icon={<Trash2 className="w-4 h-4 mr-2" />} className="text-red-600" children="Delete" />
              </>
            }/>
          </div>


          {task.description && (
            <p className="text-sm text-gray-600 mt-1 break-words">{task.description}</p>
          )}


          <div className="flex flex-wrap gap-2 mt-3">
            <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
              isOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
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
});


export default TaskCard;