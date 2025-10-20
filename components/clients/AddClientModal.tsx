import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../contexts/AuthContext';
import { Client } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { UAE_EMIRATES, VISA_STATUS_OPTIONS } from '../../lib/constants';

interface AddClientModalProps {
  onClose: () => void;
  initialData?: Client | null;
}

const FormInput: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
);

const SelectInput: React.FC<{ id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], required?: boolean }> = ({ id, name, value, onChange, options, required }) => (
    <div className="relative">
      <select id={id} name={name} value={value} onChange={onChange} required={required} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10">
        <option value="" disabled>Select...</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);

export default function AddClientModal({ onClose, initialData }: AddClientModalProps) {
  const { createClient, updateClient } = useClients();
  const { user } = useAuth();
  const { addNotification } = useUI();
  
  const [loading, setLoading] = useState(false);
  const mode = initialData ? 'edit' : 'add';

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company_name: initialData?.company_name || '',
    designation: initialData?.designation || '',
    monthly_salary: initialData?.monthly_salary?.toString() || '',
    emirate: initialData?.emirate || '',
    visa_status: initialData?.visa_status || '',
    relationship_status: initialData?.relationship_status || 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification('Authentication Error', 'You must be logged in.');
      return;
    }
    setLoading(true);

    const clientData = {
        ...formData,
        monthly_salary: parseInt(formData.monthly_salary, 10) || null,
        user_id: user.id,
    };
    
    const mutation = mode === 'add' ? createClient : (data: any) => updateClient({ id: initialData!.id, updates: data });

    mutation(clientData as any, {
        onSuccess: () => {
            addNotification(
                mode === 'add' ? 'Client Created' : 'Client Updated',
                `${formData.full_name} has been saved.`
            );
            onClose();
        },
        onError: (err) => {
            addNotification('Error', (err as Error).message);
            setLoading(false);
        },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">{mode === 'add' ? 'Add New Client' : 'Edit Client'}</h1>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
            <main className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                    <FormInput label="Full Name*"><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Email"><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Phone"><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Company Name"><input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Designation"><input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Monthly Salary (AED)"><input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /></FormInput>
                    <FormInput label="Emirate"><SelectInput id="emirate" name="emirate" value={formData.emirate} onChange={handleChange} options={UAE_EMIRATES} /></FormInput>
                    <FormInput label="Visa Status"><SelectInput id="visa_status" name="visa_status" value={formData.visa_status} onChange={handleChange} options={VISA_STATUS_OPTIONS} /></FormInput>
                    <FormInput label="Relationship Status"><SelectInput id="relationship_status" name="relationship_status" value={formData.relationship_status} onChange={handleChange} options={['active', 'inactive']} required /></FormInput>
                </div>
            </main>
            <footer className="p-4 border-t border-gray-200">
                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50">
                    {loading ? 'Saving...' : (mode === 'add' ? 'Save Client' : 'Update Client')}
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};