import { CheckCircle, Circle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { updateTask } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks for today. Well done!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <button
            onClick={() =>
              updateTask.mutate({
                id: task.id,
                updates: {
                  status: task.status === 'completed' ? 'pending' : 'completed',
                },
              })
            }
            className="mt-1"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            <p
              className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}
            >
              {task.title}
            </p>
            {task.time && (
              <p className="text-sm text-gray-600 mt-1">{task.time}</p>
            )}
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs rounded-full cursor-pointer ${
                task.priority === 'urgent'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'high'
                    ? 'bg-orange-100 text-orange-700'
                    : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
              }`}
              onClick={() => {
                // Open task details modal or edit modal
                console.log('Priority clicked for task:', task.id);
              }}
            >
              {task.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
