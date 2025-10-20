
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';

interface AddTaskModalProps {
  onClose: () => void;
}

type FormData = {
  title: string;
  description: string;
  type: NonNullable<Task['type']>;
  priority: NonNullable<Task['priority']>;
  due_date: string;
  time: string;
};

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { createTask } = useTasks();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'call',
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0],
    time: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create a task.");
      return;
    }
    setLoading(true);

    try {
      // FIX: Add missing nullable properties to satisfy the TaskInsert type.
      const taskData = {
        ...formData,
        user_id: user.id,
        status: 'pending' as const,
        estimated_duration: null,
        related_to_id: null,
        related_to_type: null,
      };
      createTask(taskData);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Call client about loan application" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Additional details..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="call">📞 Call</option>
              <option value="meeting">👥 Meeting</option>
              <option value="documentation">📄 Documentation</option>
              <option value="verification">✓ Verification</option>
              <option value="follow_up">🔄 Follow Up</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time (Optional)</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'Adding...' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
