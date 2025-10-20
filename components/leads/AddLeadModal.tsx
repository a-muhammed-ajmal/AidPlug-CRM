
import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useAuth } from '../../contexts/AuthContext';
import { useClients } from '../../hooks/useClients';
import { Lead } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { UAE_BANK_NAMES, EIB_CREDIT_CARDS, PRODUCT_TYPES, UAE_EMIRATES, mockReferrals } from '../../lib/constants';

interface AddLeadModalProps {
  onClose: () => void;
  initialData?: Lead | null;
}

// FIX: Moved component definitions outside the main component function to prevent re-creation on every render.
// This resolves an issue where input fields would lose focus on mobile devices after typing a single character.
const FormInput = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
);

const SelectInput = ({ id, name, value, onChange, options }: { id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }) => (
    <div className="relative">
      <select id={id} name={name} value={value} onChange={onChange} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10">
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);


export default function AddLeadModal({ onClose, initialData }: AddLeadModalProps) {
  const { createLead, updateLead } = useLeads();
  const { user } = useAuth();
  const { addNotification } = useUI();
  const { clients } = useClients();
  
  const [loading, setLoading] = useState(false);
  const mode = initialData ? 'edit' : 'add';

  const [formData, setFormData] = useState({
    fullName: initialData?.full_name || '',
    email: initialData?.email || '',
    company: initialData?.company_name || '',
    location: initialData?.location || 'Dubai',
    mobile: initialData?.phone.replace('+971', '').trim() || '',
    salary: initialData?.monthly_salary?.toString() || '',
    bank: initialData?.bank_name || 'Emirates Islamic Bank',
    productType: initialData?.product_type || 'Credit Card',
    // FIX: EIB_CREDIT_CARDS contains objects, so we need to use the `name` property.
    product: initialData?.product || EIB_CREDIT_CARDS[0].name,
    referral: initialData?.referral_source || '',
  });

  // FIX: EIB_CREDIT_CARDS contains objects, map to strings for the select input.
  const [availableProducts, setAvailableProducts] = useState(EIB_CREDIT_CARDS.map(card => card.name));
  const [isProductDropdownVisible, setIsProductDropdownVisible] = useState(true);
  
  const referralOptions = useMemo(() => {
    const clientsAsReferrals = clients.map(c => ({ id: `client-${c.id}`, name: c.full_name, type: 'Client' }));
    return [...clientsAsReferrals, ...mockReferrals];
  }, [clients]);

  useEffect(() => {
    let newProducts: string[] = [];
    let dropdownVisible = false;

    if (formData.bank === 'Emirates Islamic Bank' && formData.productType === 'Credit Card') {
      // FIX: Map the array of objects to an array of strings.
      newProducts = EIB_CREDIT_CARDS.map(card => card.name);
      dropdownVisible = true;
    } else if (formData.productType === 'Account Opening') {
      newProducts = ['Personal Account', 'Business Account'];
      dropdownVisible = true;
    }

    setAvailableProducts(newProducts);
    setIsProductDropdownVisible(dropdownVisible);

    setFormData(prev => ({
      ...prev,
      product: dropdownVisible ? (newProducts[0] || '') : prev.productType
    }));
  }, [formData.bank, formData.productType]);

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
    if (!formData.fullName || !formData.mobile) {
      alert('Please fill in Full Name and Mobile Number.');
      return;
    }
    setLoading(true);

    const leadData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: `+971 ${formData.mobile}`,
        company_name: formData.company,
        monthly_salary: parseInt(formData.salary, 10) || null,
        loan_amount_requested: 0,
        product_interest: [formData.product.toLowerCase().replace(/ /g, '_')],
        qualification_status: initialData?.qualification_status || "warm",
        last_contact_date: new Date().toISOString().split('T')[0],
        urgency_level: initialData?.urgency_level || "medium",
        location: formData.location,
        referral_source: formData.referral || "Manual Entry",
        bank_name: formData.bank,
        product_type: formData.productType,
        product: formData.product,
        user_id: user.id,
    };
    
    const mutation = mode === 'add' ? createLead : (data: any) => updateLead({ id: initialData!.id, updates: data });

    mutation(leadData as any, {
        onSuccess: () => {
            addNotification(
                mode === 'add' ? 'Lead Created' : 'Lead Updated',
                `${formData.fullName} has been saved.`
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
          <h1 className="text-lg font-bold text-gray-900">{mode === 'add' ? 'Add New Lead' : 'Edit Lead'}</h1>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
            <main className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                    {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
                    <FormInput label="Full Name*" children={<input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    <FormInput label="Email" children={<input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" placeholder="example@email.com" />} />
                    <FormInput label="Company Name" children={<input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    <FormInput label="Location" children={<SelectInput id="location" name="location" value={formData.location} onChange={handleChange} options={UAE_EMIRATES} />} />
                    <FormInput label="Mobile Number*" children={<div className="flex"><span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">+971</span><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 p-3" placeholder="50 123 4567" /></div>} />
                    <FormInput label="Monthly Salary (AED)" children={<input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                    <FormInput label="Bank Applying" children={<SelectInput id="bank" name="bank" value={formData.bank} onChange={handleChange} options={UAE_BANK_NAMES} />} />
                    <FormInput label="Product Type" children={<SelectInput id="productType" name="productType" value={formData.productType} onChange={handleChange} options={PRODUCT_TYPES} />} />
                    {isProductDropdownVisible && (<FormInput label="Product" children={<SelectInput id="product" name="product" value={formData.product} onChange={handleChange} options={availableProducts} />} />)}
                    <FormInput label="Referral" children={<input type="text" name="referral" value={formData.referral} onChange={handleChange} placeholder="Type name or select from list..." className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />} />
                </div>
            </main>
            <footer className="p-4 border-t border-gray-200">
                <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50">
                    {loading ? 'Saving...' : (mode === 'add' ? 'Save Lead' : 'Update Lead')}
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};
