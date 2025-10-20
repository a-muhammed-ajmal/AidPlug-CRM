
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useAuth } from '../../contexts/AuthContext';
import { Lead } from '../../types';

interface AddLeadModalProps {
  onClose: () => void;
}

type FormData = {
  full_name: string;
  phone: string;
  email: string;
  company_name: string;
  monthly_salary: string;
  loan_amount_requested: string;
  qualification_status: Lead['qualification_status'];
  urgency_level: Lead['urgency_level'];
  bank_name: string;
  product_type: string;
}

export default function AddLeadModal({ onClose }: AddLeadModalProps) {
  const { createLead } = useLeads();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone: '',
    email: '',
    company_name: '',
    monthly_salary: '',
    loan_amount_requested: '',
    qualification_status: 'warm',
    urgency_level: 'medium',
    bank_name: '',
    product_type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        alert('You must be logged in to create a lead.');
        return;
    }
    setLoading(true);

    try {
      const leadData = {
        ...formData,
        user_id: user.id,
        monthly_salary: formData.monthly_salary ? parseFloat(formData.monthly_salary) : null,
        loan_amount_requested: formData.loan_amount_requested ? parseFloat(formData.loan_amount_requested) : null,
        last_contact_date: new Date().toISOString().split('T')[0],
      };
      
      // We need to type cast because the service expects non-string numeric fields
      createLead(leadData as any);
      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+971 50 123 4567" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary (AED)</label>
            <input type="number" name="monthly_salary" value={formData.monthly_salary} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="15000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount Requested (AED)</label>
            <input type="number" name="loan_amount_requested" value={formData.loan_amount_requested} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="100000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Status</label>
            <select name="qualification_status" value={formData.qualification_status || 'warm'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="warm">Warm</option>
              <option value="qualified">Qualified</option>
              <option value="appointment_booked">Appointment Booked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <select name="urgency_level" value={formData.urgency_level || 'medium'} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Emirates NBD" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <input type="text" name="product_type" value={formData.product_type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Personal Loan" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{loading ? 'Adding...' : 'Add Lead'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
