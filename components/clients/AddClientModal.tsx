
import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../contexts/AuthContext';
import { Client } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { UAE_EMIRATES, UAE_BANK_NAMES, COUNTRIES, GENDERS, EMPLOYMENT_STATUSES } from '../../lib/constants';

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

const SelectInput = ({ id, name, value, onChange, options, required, placeholder }: { id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], required?: boolean, placeholder?: string }) => (
    <div className="relative">
      <select id={id} name={name} value={value} onChange={onChange} required={required} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10">
        <option value="" disabled>{placeholder || 'Select...'}</option>
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
    dob: initialData?.dob ? initialData.dob.split('T')[0] : '',
    gender: initialData?.gender || '',
    nationality: initialData?.nationality || '',
    passport: initialData?.passport || '',
    emirates_id: initialData?.emirates_id || '',
    phone: initialData?.phone?.replace('+971', '').trim() || '',
    email: initialData?.email || '',
    whatsapp_number: initialData?.whatsapp_number || '',
    emirate: initialData?.emirate || '',
    employment_status: initialData?.employment_status || '',
    company_name: initialData?.company_name || '',
    company_website: initialData?.company_website || '',
    company_landline: initialData?.company_landline || '',
    official_email: initialData?.official_email || '',
    designation: initialData?.designation || '',
    monthly_salary: initialData?.monthly_salary?.toString() || '',
    salary_transferred_to: initialData?.salary_transferred_to || '',
    aecb_score: initialData?.aecb_score?.toString() || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        phone: formData.phone ? `+971 ${formData.phone}` : null,
        monthly_salary: parseInt(formData.monthly_salary, 10) || null,
        aecb_score: parseInt(formData.aecb_score, 10) || null,
        dob: formData.dob || null,
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
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">{mode === 'add' ? 'Add New Client' : 'Edit Client'}</h1>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <Section title="Personal Details" children={<>
                      <FormInput label="Full Name" required children={<input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Date of Birth" children={<input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Gender" children={<SelectInput id="gender" name="gender" value={formData.gender} onChange={handleChange} options={GENDERS} />} />
                      <FormInput label="Nationality" children={<><input list="countries" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" /><datalist id="countries">{COUNTRIES.map(c => <option key={c} value={c} />)}</datalist></>} />
                      <FormInput label="Passport Number" children={<input type="text" name="passport" value={formData.passport} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Emirates ID" children={<input type="text" name="emirates_id" value={formData.emirates_id} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    </>} />
                    
                    <Section title="Contact Information" children={<>
                      <FormInput label="Mobile Number" children={<div className="flex"><span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">+971</span><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 p-3" placeholder="50 123 4567" /></div>} />
                      <FormInput label="WhatsApp Number" children={<input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="+9715..." className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Email Address" children={<input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Location" children={<SelectInput id="emirate" name="emirate" value={formData.emirate} onChange={handleChange} options={UAE_EMIRATES} />} />
                    </>} />
                    
                    <Section title="Employment & Financial Details" children={<>
                      <FormInput label="Employment Status" children={<SelectInput id="employment_status" name="employment_status" value={formData.employment_status} onChange={handleChange} options={EMPLOYMENT_STATUSES} />} />
                      <FormInput label="Company Name" children={<input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Website" children={<input type="url" name="company_website" value={formData.company_website} onChange={handleChange} placeholder="https://example.com" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Landline Number" children={<input type="tel" name="company_landline" value={formData.company_landline} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Work Email Address" children={<input type="email" name="official_email" value={formData.official_email} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Designation" children={<input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Monthly Salary (AED)" children={<input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                      <FormInput label="Salary Transferred To" children={<SelectInput id="salary_transferred_to" name="salary_transferred_to" value={formData.salary_transferred_to} onChange={handleChange} options={UAE_BANK_NAMES} placeholder="Select Bank..." />} />
                      <FormInput label="AECB Score" children={<input type="number" name="aecb_score" value={formData.aecb_score} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    </>} />
                </div>
            </main>
            <footer className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50">
                    {loading ? 'Saving...' : (mode === 'add' ? 'Save Client' : 'Update Client')}
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};