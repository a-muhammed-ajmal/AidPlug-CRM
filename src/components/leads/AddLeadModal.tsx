import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useDeals } from '../../hooks/useDeals';
import { useAuth } from '../../hooks/useAuth';
import { Lead } from '../../types';
import { useUI } from '../../contexts/UIContextDefinitions';
import {
  UAE_BANK_NAMES,
  EIB_CREDIT_CARDS,
  PRODUCT_TYPES,
  UAE_EMIRATES,
} from '../../lib/constants';

interface AddLeadModalProps {
  onClose: () => void;
  initialData?: Lead | null;
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="md:col-span-2 mt-4 first:mt-0">
    <h3 className="text-base font-semibold text-gray-800 border-b pb-2 mb-4">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const FormInput = ({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <div className={className}>
    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
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
  placeholder,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
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
      <option value="" disabled>
        {placeholder || 'Select...'}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

const ToggleInput = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      ></div>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="hidden"
    />
  </label>
);

export default function AddLeadModal({
  onClose,
  initialData,
}: AddLeadModalProps) {
  const { createLead, updateLead, deleteLead } = useLeads();
  const { createDeal } = useDeals();
  const { user } = useAuth();
  const { addNotification, showConfirmation } = useUI();

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    company_name: initialData?.company_name || '',
    phone: initialData?.phone?.replace('+971', '').trim() || '',
    email: initialData?.email || '',
    location: initialData?.location || 'Dubai',
    bank_name: initialData?.bank_name || 'Emirates Islamic Bank',
    product_type: initialData?.product_type || 'Credit Card',
    product: initialData?.product || 'RTA Credit Card',
    stage: initialData?.stage || 'warm',
    monthly_salary: initialData?.monthly_salary?.toString() || '',
    salary_variations: initialData?.salary_variations || false,
    existing_cards: initialData?.existing_cards || false,
    cards_duration: initialData?.cards_duration || '',
    total_credit_limit: initialData?.total_credit_limit?.toString() || '',
    has_emi: initialData?.has_emi || false,
    emi_amount: initialData?.emi_amount?.toString() || '',
    applied_recently: initialData?.applied_recently || false,
    documents_available: initialData?.documents_available || [],
    create_task: false,
  });

  const [loading, setLoading] = useState(false);
  const mode = initialData ? 'edit' : 'add';

  const [availableProducts, setAvailableProducts] = useState(
    EIB_CREDIT_CARDS.map((card) => card.name)
  );

  useEffect(() => {
    let newProducts: string[] = [];
    if (
      formData.bank_name === 'Emirates Islamic Bank' &&
      formData.product_type === 'Credit Card'
    ) {
      newProducts = EIB_CREDIT_CARDS.map((card) => card.name);
    } else if (formData.product_type === 'Account Opening') {
      newProducts = ['Personal Account', 'Business Account'];
    }
    setAvailableProducts(newProducts);
    setFormData((prev) => ({
      ...prev,
      product: newProducts.includes(prev.product)
        ? prev.product
        : newProducts[0] || '',
    }));
  }, [formData.bank_name, formData.product_type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocChange = (doc: string) => {
    setFormData((prev) => {
      const newDocs = prev.documents_available.includes(doc)
        ? prev.documents_available.filter((d) => d !== doc)
        : [...prev.documents_available, doc];
      return { ...prev, documents_available: newDocs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification('Authentication Error', 'You must be logged in.');
      return;
    }
    setLoading(true);

    const leadData: Omit<
      Lead,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'last_contact_date'
      | 'referral_source'
      | 'product_interest'
      | 'urgency_level'
    > & { user_id: string } = {
      full_name: formData.full_name,
      phone: `+971 ${formData.phone}`,
      company_name: formData.company_name,
      email: formData.email || null,
      loan_amount_requested: 0,
      stage: formData.stage,
      location: formData.location,
      bank_name: formData.bank_name,
      product_type: formData.product_type,
      product: formData.product,
      monthly_salary: parseInt(formData.monthly_salary, 10) || null,
      salary_months: null,
      salary_variations: formData.salary_variations,
      existing_cards: formData.existing_cards,
      cards_duration: formData.existing_cards ? formData.cards_duration : null,
      total_credit_limit: formData.existing_cards
        ? parseInt(formData.total_credit_limit, 10) || null
        : null,
      has_emi: formData.has_emi,
      emi_amount: formData.has_emi
        ? parseInt(formData.emi_amount, 10) || null
        : null,
      applied_recently: formData.applied_recently,
      documents_available: formData.documents_available,
      employment_years: null,
      existing_loans: null,
      user_id: user.id,
    };

    if (mode === 'add') {
      createLead.mutate(leadData, {
        onSuccess: () => {
          addNotification(
            'Lead Created',
            `${formData.full_name} has been saved.`
          );
          onClose();
        },
        onError: (err: Error) => {
          addNotification('Error', err.message);
        },
        onSettled: () => setLoading(false),
      });
    } else {
      updateLead.mutate(
        { id: initialData!.id, updates: leadData },
        {
          onSuccess: () => {
            addNotification(
              'Lead Updated',
              `${formData.full_name} has been saved.`
            );
            onClose();
          },
          onError: (err: Error) => {
            addNotification('Error', err.message);
          },
          onSettled: () => setLoading(false),
        }
      );
    }
  };

  const allDocuments = [
    'Emirates ID Original',
    'Passport Clear Photo',
    'Salary Certificate (for listed companies) or Labor Contract / Offer Letter (for freezone companies)',
    'Payslips (Last 3 months for listed companies, or 1 payslip for freezone companies)',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl transform transition-transform animate-slide-up flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">
            {mode === 'add' ? 'Add New Lead' : 'Edit Lead'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Section
                title="Personal & Product Info"
                children={
                  <>
                    <FormInput
                      label="Full Name"
                      children={
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Company Name"
                      children={
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Mobile Number"
                      children={
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-gray-200 border rounded-l-lg">
                            +971
                          </span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                              if (value.startsWith('971')) {
                                value = value.slice(3); // Remove +971 prefix
                              } else if (
                                value.startsWith('0') &&
                                value.length === 10
                              ) {
                                value = value.slice(1); // Remove leading 0
                              }
                              if (value.length > 9) value = value.slice(0, 9); // Limit to 9 digits
                              setFormData((prev) => ({
                                ...prev,
                                phone: value,
                              }));
                            }}
                            className="w-full bg-gray-50 border p-3 rounded-r-lg"
                            placeholder="50 123 4567"
                          />
                        </div>
                      }
                    />
                    <FormInput
                      label="Email Address"
                      children={
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Location"
                      children={
                        <SelectInput
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          options={UAE_EMIRATES}
                        />
                      }
                    />
                    <FormInput
                      label="Bank Applying"
                      children={
                        <SelectInput
                          id="bank_name"
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                          options={UAE_BANK_NAMES}
                        />
                      }
                    />
                    <FormInput
                      label="Product Type"
                      children={
                        <SelectInput
                          id="product_type"
                          name="product_type"
                          value={formData.product_type}
                          onChange={handleChange}
                          options={PRODUCT_TYPES}
                        />
                      }
                    />
                    {availableProducts.length > 0 && (
                      <FormInput
                        label="Product"
                        children={
                          <SelectInput
                            id="product"
                            name="product"
                            value={formData.product}
                            onChange={handleChange}
                            options={availableProducts}
                          />
                        }
                      />
                    )}
                    <FormInput
                      label="Stage"
                      children={
                        <SelectInput
                          id="stage"
                          name="stage"
                          value={formData.stage || 'warm'}
                          onChange={(e) => setFormData((prev) => ({ ...prev, stage: e.target.value as "warm" | "qualified" | "appointment_booked" }))}
                          options={['warm', 'qualified', 'appointment_booked']}
                          placeholder="Select Stage"
                        />
                      }
                    />
                  </>
                }
              />

              <Section
                title="Salary Information"
                children={
                  <>
                    <FormInput
                      label="Monthly Salary (AED)"
                      children={
                        <input
                          type="number"
                          name="monthly_salary"
                          value={formData.monthly_salary}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      className="md:col-span-2"
                      label=""
                      children={
                        <ToggleInput
                          label="Any variations in salary during the last 3 months?"
                          checked={formData.salary_variations}
                          onChange={(v) => handleToggle('salary_variations', v)}
                        />
                      }
                    />
                    {formData.salary_variations && (
                      <div className="md:col-span-2 -mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded-md flex items-center">
                        <Info className="w-4 h-4 mr-2" /> Please provide last
                        three months payslips to confirm the reason for
                        variations.
                      </div>
                    )}
                  </>
                }
              />

              <Section
                title="Credit History"
                children={
                  <>
                    <FormInput
                      className="md:col-span-2"
                      label=""
                      children={
                        <ToggleInput
                          label="Are you currently using any credit cards?"
                          checked={formData.existing_cards}
                          onChange={(v) => handleToggle('existing_cards', v)}
                        />
                      }
                    />
                    {formData.existing_cards && (
                      <>
                        <FormInput
                          label="Using cards since?"
                          children={
                            <input
                              type="text"
                              name="cards_duration"
                              value={formData.cards_duration}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border p-3 rounded-lg"
                              placeholder="e.g., 2 years"
                            />
                          }
                        />
                        <FormInput
                          label="Total credit limit of cards"
                          children={
                            <input
                              type="number"
                              name="total_credit_limit"
                              value={formData.total_credit_limit}
                              onChange={handleChange}
                              className="w-full bg-gray-50 border p-3 rounded-lg"
                            />
                          }
                        />
                      </>
                    )}
                    <FormInput
                      className="md:col-span-2"
                      label=""
                      children={
                        <ToggleInput
                          label="Are you currently paying any EMI for any type of loan (personal, business, auto, housing, etc.)?"
                          checked={formData.has_emi}
                          onChange={(v) => handleToggle('has_emi', v)}
                        />
                      }
                    />
                    {formData.has_emi && (
                      <FormInput
                        label="Total EMI Amount (AED)"
                        children={
                          <input
                            type="number"
                            name="emi_amount"
                            value={formData.emi_amount}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border p-3 rounded-lg"
                          />
                        }
                      />
                    )}
                  </>
                }
              />

              <Section
                title="Application & Documents"
                children={
                  <>
                    <FormInput
                      className="md:col-span-2"
                      label=""
                      children={
                        <ToggleInput
                          label="Have you applied for the same bank/product within the last 60 days?"
                          checked={formData.applied_recently}
                          onChange={(v) => handleToggle('applied_recently', v)}
                        />
                      }
                    />
                    <FormInput
                      className="md:col-span-2"
                      label=""
                      children={
                        <ToggleInput
                          label="Create a Task"
                          checked={formData.create_task || false}
                          onChange={(v) => handleToggle('create_task', v)}
                        />
                      }
                    />
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Documents Available
                      </label>
                      <div className="space-y-2">
                        {allDocuments.map((doc) => (
                          <label
                            key={doc}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.documents_available.includes(
                                doc
                              )}
                              onChange={() => handleDocChange(doc)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{doc}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </main>
          <footer className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex space-x-3">
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => {
                    if (initialData) {
                      showConfirmation(
                        'Delete Lead',
                        `Are you sure you want to delete "${initialData.full_name}"? This action cannot be undone.`,
                        () => {
                          deleteLead.mutate(initialData.id, {
                            onSuccess: () => {
                              addNotification(
                                'Lead Deleted',
                                `${initialData.full_name} has been deleted.`
                              );
                              onClose();
                            },
                            onError: (err: Error) => {
                              addNotification('Error', err.message);
                            },
                          });
                        }
                      );
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all active:scale-95 shadow"
                >
                  Delete Lead
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (initialData) {
                    showConfirmation(
                      'Convert Lead to Deal',
                      `Are you sure you want to convert "${initialData.full_name}" to a deal? This will move the lead to the deals pipeline.`,
                      () => {
                        const newDeal = {
                          title: `${initialData.product || 'Deal'} - ${initialData.full_name}`,
                          amount:
                            initialData.loan_amount_requested ||
                            (initialData.monthly_salary || 0) * 3 ||
                            50000,
                          stage: 'application_processing' as const,
                          client_name: initialData.full_name,
                          expected_close_date: new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split('T')[0],
                          probability: 25,
                          product_type: initialData.product
                            ?.toLowerCase()
                            .replace(/ /g, '_'),
                          user_id: user!.id,
                          application_number: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
                          bdi_number: `BDI-${Math.floor(10000 + Math.random() * 90000)}`,
                        };

                        createDeal.mutate(newDeal, {
                          onSuccess: () => {
                            addNotification(
                              'Lead Converted',
                              `${initialData.full_name} is now a deal.`
                            );
                            deleteLead.mutate(initialData.id);
                            onClose();
                          },
                          onError: (e: Error) =>
                            addNotification('Conversion Failed', e.message),
                        });
                      }
                    );
                  }
                }}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all active:scale-95 shadow"
              >
                Convert to Deal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50"
              >
                {loading
                  ? 'Saving...'
                  : mode === 'add'
                    ? 'Save Lead'
                    : 'Update Lead'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
