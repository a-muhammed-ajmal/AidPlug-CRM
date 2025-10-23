
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

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <>
        <div className="md:col-span-2 mt-4 first:mt-0">
            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">{title}</h3>
        </div>
        {children}
    </>
);

const FormInput = ({ label, children, required }: { label: string, children: React.ReactNode, required?: boolean }) => (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
);

const SelectInput = ({ id, name, value, onChange, options, required }: { id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], required?: boolean }) => (
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
    photo_url: initialData?.photo_url || '',
    dob: initialData?.dob ? initialData.dob.split('T')[0] : '',
    nationality: initialData?.nationality || '',
    emirates_id: initialData?.emirates_id || '',
    passport: initialData?.passport || '',
    emirate: initialData?.emirate || '',
    visa_status: initialData?.visa_status || '',
    company_name: initialData?.company_name || '',
    designation: initialData?.designation || '',
    monthly_salary: initialData?.monthly_salary?.toString() || '',
    client_since: initialData?.client_since ? initialData.client_since.split('T')[0] : '',
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
        dob: formData.dob || null,
        client_since: formData.client_since || null,
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
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">{mode === 'add' ? 'Add New Client' : 'Edit Client'}</h1>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
            <main className="p-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
                    <Section title="Personal Details" children={<>
                      <FormInput label="Full Name" required children={<input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Phone" children={<input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Email" children={<input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Photo URL" children={<input type="text" name="photo_url" value={formData.photo_url} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Date of Birth" children={<input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Nationality" children={<input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    </>} />
                    
                    {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
                    <Section title="Identification & Residency" children={<>
                      <FormInput label="Emirates ID" children={<input type="text" name="emirates_id" value={formData.emirates_id} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Passport Number" children={<input type="text" name="passport" value={formData.passport} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Emirate" children={<SelectInput id="emirate" name="emirate" value={formData.emirate} onChange={handleChange} options={UAE_EMIRATES} />} />
                      <FormInput label="Visa Status" children={<SelectInput id="visa_status" name="visa_status" value={formData.visa_status} onChange={handleChange} options={VISA_STATUS_OPTIONS} />} />
                    </>} />
                    
                    {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
                    <Section title="Employment & Relationship" children={<>
                      <FormInput label="Company Name" children={<input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Designation" children={<input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Monthly Salary (AED)" children={<input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Client Since" children={<input type="date" name="client_since" value={formData.client_since} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Relationship Status" required children={<SelectInput id="relationship_status" name="relationship_status" value={formData.relationship_status} onChange={handleChange} options={['active', 'inactive']} required />} />
                    </>} />
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