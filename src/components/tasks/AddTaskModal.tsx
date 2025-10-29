import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { useLeads } from '../../hooks/useLeads';
import { useClients } from '../../hooks/useClients';
import { useDeals } from '../../hooks/useDeals';
import { PostgrestError } from '@supabase/supabase-js';

interface AddTaskModalProps {
  onClose: () => void;
  initialData?: Task | null;
}

const FormInput = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const SelectInput = ({
  id,
  name,
  value,
  onChange,
  options,
  required,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) => (
  <div className="relative">
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

export default function AddTaskModal({
  onClose,
  initialData,
}: AddTaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const { user } = useAuth();
  const { addNotification } = useUI();
  const { leads } = useLeads();
  const { clients } = useClients();
  const { deals } = useDeals();

  const [loading, setLoading] = useState(false);
  const mode = initialData ? 'edit' : 'add';

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'call',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date
      ? initialData.due_date.split('T')[0]
      : new Date().toISOString().split('T')[0],
    time: initialData?.time || '',
    related_to_type: initialData?.related_to_type || '',
    related_to_id: initialData?.related_to_id || '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification('Authentication Error', 'You must be logged in.');
      return;
    }
    setLoading(true);

    const commonData = {
      title: formData.title,
      description: formData.description,
      type: formData.type as NonNullable<Task['type']>,
      priority: formData.priority as NonNullable<Task['priority']>,
      due_date: formData.due_date,
      time: formData.time || null,
      related_to_id: formData.related_to_id || null,
      related_to_type:
        (formData.related_to_type as NonNullable<Task['related_to_type']>) ||
        null,
      user_id: user.id,
    };

    if (mode === 'add') {
      const taskData = {
        ...commonData,
        status: 'pending' as const,
      };
      createTask.mutate(taskData, {
        onSuccess: () => {
          addNotification(
            'Task Created',
            `"${formData.title}" has been added.`
          );
          onClose();
        },
        onError: (err: Error | PostgrestError) =>
          addNotification('Error', err.message),
        onSettled: () => setLoading(false),
      });
    } else if (initialData) {
      updateTask.mutate(
        { id: initialData.id, updates: commonData },
        {
          onSuccess: () => {
            addNotification(
              'Task Updated',
              `"${formData.title}" has been saved.`
            );
            onClose();
          },
          onError: (err: Error | PostgrestError) =>
            addNotification('Error', err.message),
          onSettled: () => setLoading(false),
        }
      );
    }
  };

  const typeOptions = [
    { value: 'call', label: '📞 Call' },
    { value: 'meeting', label: '👥 Meeting' },
    { value: 'documentation', label: '📄 Documentation' },
    { value: 'verification', label: '✓ Verification' },
    { value: 'follow_up', label: '🔄 Follow Up' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const relatedTypeOptions = [
    { value: '', label: 'None' },
    { value: 'lead', label: 'Lead' },
    { value: 'client', label: 'Client' },
    { value: 'deal', label: 'Deal' },
  ];

  const getRelatedOptions = () => {
    switch (formData.related_to_type) {
      case 'lead':
        return leads.map((lead) => ({ value: lead.id, label: lead.full_name }));
      case 'client':
        return clients.map((client) => ({
          value: client.id,
          label: client.full_name,
        }));
      case 'deal':
        return deals.map((deal) => ({ value: deal.id, label: deal.title }));
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">
            {mode === 'add' ? 'Add New Task' : 'Edit Task'}
          </h1>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <FormInput
                label="Task Title*"
                children={
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                  />
                }
              />
              <FormInput
                label="Description"
                children={
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                  />
                }
              />
              <FormInput
                label="Task Type"
                children={
                  <SelectInput
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={typeOptions}
                  />
                }
              />
              <FormInput
                label="Priority"
                children={
                  <SelectInput
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    options={priorityOptions}
                  />
                }
              />
              <FormInput
                label="Related To"
                children={
                  <SelectInput
                    id="related_to_type"
                    name="related_to_type"
                    value={formData.related_to_type}
                    onChange={handleChange}
                    options={relatedTypeOptions}
                  />
                }
              />
              {formData.related_to_type && (
                <FormInput
                  label={`${formData.related_to_type.charAt(0).toUpperCase() + formData.related_to_type.slice(1)} Name`}
                  children={
                    <SelectInput
                      id="related_to_id"
                      name="related_to_id"
                      value={formData.related_to_id}
                      onChange={handleChange}
                      options={getRelatedOptions()}
                    />
                  }
                />
              )}
              <FormInput
                label="Due Date*"
                children={
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                  />
                }
              />
              <FormInput
                label="Time (Optional)"
                children={
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3"
                  />
                }
              />
            </div>
          </main>
          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : mode === 'add'
                  ? 'Save Task'
                  : 'Update Task'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
