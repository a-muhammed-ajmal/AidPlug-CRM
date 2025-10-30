import {
  Briefcase,
  Building,
  Calendar,
  ChevronDown,
  DollarSign,
  Edit3,
  Hash,
  Plus,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../contexts/UIContextDefinitions';
import { useDeals } from '../../hooks/useDeals';
import {
  EIB_CREDIT_CARDS,
  KANBAN_STAGES,
  PRODUCT_TYPES,
  UAE_BANK_NAMES,
} from '../../lib/constants';
import { Deal } from '../../types';
import SkeletonLoader from '../common/SkeletonLoader';
import DealColumn from './DealColumn';

// --- DealModal Component Definition ---

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Deal | null;
  initialMode?: 'view' | 'edit';
}

const defaultFormData = {
  title: '',
  client_name: '',
  company_name: '',
  designation: '',
  monthly_salary: '',
  bank_applying: 'Emirates Islamic Bank',
  product_type: 'Credit Card',
  product: EIB_CREDIT_CARDS[0].name,
  mobile_number: '',
  email_address: '',
  whatsapp_number: '',
  amount: '',
  stage: 'application_processing' as Deal['stage'],
  expected_close_date: new Date().toISOString().split('T')[0],
  completed_date: '',
  application_number: '',
  bdi_number: '',
  aecb_score: '',
};

const stageOptions = KANBAN_STAGES.map((s) => ({
  value: s.id,
  label: s.title,
}));

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null;
}) => (
  <div className="flex items-start space-x-3">
    <div className="bg-gray-100 p-2 rounded-lg mt-1">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <div className="md:col-span-2 mt-4 first:mt-0">
      <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
        {title}
      </h3>
    </div>
    {children}
  </>
);

const FormInput = ({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
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

function DealModal({
  isOpen,
  onClose,
  initialData,
  initialMode = 'view',
}: DealModalProps) {
  const { createDeal, updateDeal } = useDeals();
  const { user } = useAuth();
  const { addNotification } = useUI();

  const [mode, setMode] = useState(initialData ? initialMode : 'edit');
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState(
    EIB_CREDIT_CARDS.map((card) => card.name)
  );

  useEffect(() => {
    let newProducts: string[] = [];
    if (
      formData.bank_applying === 'Emirates Islamic Bank' &&
      formData.product_type === 'Credit Card'
    ) {
      newProducts = EIB_CREDIT_CARDS.map((card) => card.name);
    } else if (formData.product_type === 'Account Opening') {
      newProducts = ['Personal Account', 'Business Account'];
    }
    setAvailableProducts(newProducts);
    if (!newProducts.includes(formData.product)) {
      setFormData((prev) => ({ ...prev, product: newProducts[0] || '' }));
    }
  }, [formData.bank_applying, formData.product_type, formData.product]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        client_name: initialData.client_name || '',
        amount: String(initialData.amount || ''),
        stage: initialData.stage || 'application_processing',
        expected_close_date: initialData.expected_close_date
          ? initialData.expected_close_date.split('T')[0]
          : new Date().toISOString().split('T')[0],
        completed_date: initialData.completed_date
          ? initialData.completed_date.split('T')[0]
          : '',
        application_number: initialData.application_number || '',
        bdi_number: initialData.bdi_number || '',
        company_name: initialData.company_name || '',
        designation: initialData.designation || '',
        monthly_salary: String(initialData.monthly_salary || ''),
        bank_applying: initialData.bank_applying || 'Emirates Islamic Bank',
        product_type: initialData.product_type || 'Credit Card',
        product: initialData.product || '',
        mobile_number:
          initialData.mobile_number?.replace('+971', '').trim() || '',
        email_address: initialData.email_address || '',
        whatsapp_number: initialData.whatsapp_number || '',
        aecb_score: String(initialData.aecb_score || ''),
      });
      setMode(initialMode);
    } else {
      setFormData(defaultFormData);
      setMode('edit');
    }
  }, [initialData, initialMode, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'product_type' && value === 'Credit Card') {
        newState.amount = '';
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification('Authentication Error', 'You must be logged in.');
      return;
    }
    setLoading(true);

    const dealData = {
      ...formData,
      user_id: user.id,
      amount: parseInt(formData.amount, 10) || 0,
      monthly_salary: parseInt(formData.monthly_salary, 10) || null,
      mobile_number: formData.mobile_number
        ? `+971 ${formData.mobile_number}`
        : null,
      completed_date:
        formData.stage === 'completed' ? formData.completed_date || null : null,
      aecb_score: formData.aecb_score
        ? parseInt(formData.aecb_score, 10)
        : null,
    };

    if (initialData) {
      updateDeal.mutate(
        { id: initialData.id, updates: dealData },
        {
          onSuccess: () => {
            addNotification(
              'Deal Updated',
              `${formData.title} has been saved.`
            );
            onClose();
          },
          onError: (err: Error) => addNotification('Error', err.message),
          onSettled: () => setLoading(false),
        }
      );
    } else {
      createDeal.mutate(dealData, {
        onSuccess: () => {
          addNotification('Deal Created', `${formData.title} has been saved.`);
          onClose();
        },
        onError: (err: Error) => addNotification('Error', err.message),
        onSettled: () => setLoading(false),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">
            {mode === 'edit'
              ? initialData
                ? 'Edit Deal'
                : 'Add New Deal'
              : initialData?.title || 'Deal Details'}
          </h1>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        {mode === 'view' && initialData ? (
          <>
            <main className="flex-1 p-6 overflow-y-auto space-y-4">
              <DetailItem
                icon={Briefcase}
                label="Client"
                value={initialData.client_name}
              />
              {initialData.product_type !== 'Credit Card' && (
                <DetailItem
                  icon={DollarSign}
                  label="Amount"
                  value={`AED ${initialData.amount.toLocaleString()}`}
                />
              )}
              <DetailItem
                icon={Building}
                label="Company"
                value={initialData.company_name}
              />
              <DetailItem
                icon={Briefcase}
                label="Designation"
                value={initialData.designation}
              />
              <DetailItem
                icon={DollarSign}
                label="Salary"
                value={
                  initialData.monthly_salary
                    ? `AED ${initialData.monthly_salary.toLocaleString()}`
                    : null
                }
              />
              <DetailItem
                icon={TrendingUp}
                label="AECB Score"
                value={initialData.aecb_score}
              />
              <DetailItem
                icon={Calendar}
                label="Submission Date"
                value={new Date(
                  initialData.created_at || ''
                ).toLocaleDateString()}
              />
              {initialData.stage === 'completed' ? (
                <DetailItem
                  icon={Calendar}
                  label="Completed Date"
                  value={
                    initialData.completed_date
                      ? new Date(
                          initialData.completed_date
                        ).toLocaleDateString()
                      : 'N/A'
                  }
                />
              ) : (
                <DetailItem
                  icon={Calendar}
                  label="Expected Close"
                  value={
                    initialData.expected_close_date
                      ? new Date(
                          initialData.expected_close_date
                        ).toLocaleDateString()
                      : null
                  }
                />
              )}
              <DetailItem
                icon={Hash}
                label="Application No."
                value={initialData.application_number}
              />
              <DetailItem
                icon={Hash}
                label="BDI No."
                value={initialData.bdi_number}
              />
              <DetailItem
                icon={ChevronDown}
                label="Stage"
                value={
                  stageOptions.find((s) => s.value === initialData.stage)
                    ?.label || 'N/A'
                }
              />
            </main>
            <footer className="p-4 bg-gray-50 border-t flex-shrink-0">
              <button
                onClick={() => setMode('edit')}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow flex items-center justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Edit Deal
              </button>
            </footer>
          </>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col min-h-0"
          >
            <main className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <Section
                title="Application Details"
                children={
                  <>
                    <FormInput
                      label="Application Number"
                      children={
                        <input
                          type="text"
                          name="application_number"
                          value={formData.application_number}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="BPM ID"
                      children={
                        <input
                          type="text"
                          name="bdi_number"
                          value={formData.bdi_number}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Status / Stage"
                      children={
                        <SelectInput
                          id="stage"
                          name="stage"
                          value={formData.stage || 'application_processing'}
                          onChange={handleChange}
                          options={stageOptions}
                        />
                      }
                    />
                    {formData.stage === 'completed' ? (
                      <FormInput
                        label="Completed Date"
                        required
                        children={
                          <input
                            type="date"
                            name="completed_date"
                            value={formData.completed_date}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            required
                            className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                          />
                        }
                      />
                    ) : (
                      <FormInput
                        label="Expected Close Date"
                        children={
                          <input
                            type="date"
                            name="expected_close_date"
                            value={formData.expected_close_date}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                          />
                        }
                      />
                    )}
                  </>
                }
              />
              <Section
                title="Client Information"
                children={
                  <>
                    <FormInput
                      label="Full Name"
                      required
                      children={
                        <input
                          type="text"
                          name="client_name"
                          value={formData.client_name}
                          onChange={handleChange}
                          required
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
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
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Designation"
                      children={
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="Monthly Salary (AED)"
                      children={
                        <input
                          type="number"
                          name="monthly_salary"
                          value={formData.monthly_salary}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="AECB Score"
                      children={
                        <input
                          type="number"
                          name="aecb_score"
                          value={formData.aecb_score}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                  </>
                }
              />
              <Section
                title="Product Details"
                children={
                  <>
                    <FormInput
                      label="Bank Applying"
                      children={
                        <SelectInput
                          id="bank_applying"
                          name="bank_applying"
                          value={formData.bank_applying}
                          onChange={handleChange}
                          options={UAE_BANK_NAMES.map((b) => ({
                            value: b,
                            label: b,
                          }))}
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
                          options={PRODUCT_TYPES.map((p) => ({
                            value: p,
                            label: p,
                          }))}
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
                            options={availableProducts.map((p) => ({
                              value: p,
                              label: p,
                            }))}
                          />
                        }
                      />
                    )}
                    {formData.product_type !== 'Credit Card' && (
                      <FormInput
                        label="Amount (AED)"
                        required
                        children={
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                          />
                        }
                      />
                    )}
                  </>
                }
              />
              <Section
                title="Contact Information"
                children={
                  <>
                    <FormInput
                      label="Mobile Number"
                      children={
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                            +971
                          </span>
                          <input
                            type="tel"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-300 p-3 rounded-r-lg"
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
                          name="email_address"
                          value={formData.email_address}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                        />
                      }
                    />
                    <FormInput
                      label="WhatsApp Number"
                      children={
                        <input
                          type="text"
                          name="whatsapp_number"
                          value={formData.whatsapp_number}
                          onChange={handleChange}
                          className="w-full bg-white border border-gray-300 p-3 rounded-lg"
                          placeholder="+9715..."
                        />
                      }
                    />
                  </>
                }
              />
            </main>
            <footer className="p-4 bg-gray-50 border-t flex-shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50"
              >
                {loading
                  ? 'Saving...'
                  : initialData
                    ? 'Update Deal'
                    : 'Save Deal'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}

// --- End of DealModal Component ---

export interface Stage {
  id: NonNullable<Deal['stage']>;
  label: string;
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'red';
}

export default function DealsPage() {
  const { showConfirmation, addNotification, setTitle } = useUI();
  useEffect(() => {
    setTitle('Deals');
  }, [setTitle]);

  const { deals, isLoading, deleteDeal } = useDeals();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [searchQuery, setSearchQuery] = useState('');

  const stages: Stage[] = [
    {
      id: 'application_processing',
      label: 'Application Processing',
      color: 'blue',
    },
    {
      id: 'verification_needed',
      label: 'Verification Needed',
      color: 'yellow',
    },
    { id: 'activation_needed', label: 'Activation Needed', color: 'purple' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'unsuccessful', label: 'Unsuccessful', color: 'red' },
  ];

  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    return deals.filter(
      (deal) =>
        !searchQuery ||
        deal.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deal.company_name &&
          deal.company_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (deal.application_number &&
          deal.application_number
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, deals]);

  const handleViewDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddNewDeal = useCallback(() => {
    setSelectedDeal(null);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    if (location.state?.showAddModal) {
      handleAddNewDeal();
      // Clean up state to prevent modal from re-opening on navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleAddNewDeal]);

  const handleDeleteDeal = (deal: Deal) => {
    showConfirmation(
      'Delete Deal?',
      `Are you sure you want to permanently delete the deal "${deal.title}"? This action cannot be undone.`,
      () => {
        deleteDeal.mutate(deal.id, {
          onSuccess: () =>
            addNotification(
              'Deal Deleted',
              `The deal has been successfully removed.`
            ),
          onError: (error: Error) =>
            addNotification('Error', error.message || 'Failed to delete deal.'),
        });
      }
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeal(null);
  };

  if (isLoading) {
    return (
      <div className="relative flex flex-col h-[calc(100vh-148px)] lg:h-[calc(100vh-110px)]">
        <div className="p-4 bg-gray-50 border-b flex-shrink-0">
          <SkeletonLoader className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex-grow overflow-x-auto kanban-board">
          <div className="flex space-x-4 p-4 h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-80 h-full flex flex-col"
              >
                <SkeletonLoader className="h-16 w-full rounded-t-xl" />
                <div className="space-y-3 p-3 bg-gray-50 flex-grow rounded-b-xl border">
                  <SkeletonLoader className="h-32 w-full rounded-lg" />
                  <SkeletonLoader className="h-32 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100vh-148px)] lg:h-[calc(100vh-110px)]">
      <div className="p-4 bg-gray-50 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals by client, title, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-grow overflow-x-auto kanban-board bg-gray-50">
        <div className="flex space-x-4 p-4 h-full">
          {stages.map((stage) => (
            <DealColumn
              key={stage.id}
              stage={stage}
              deals={filteredDeals.filter((d) => d.stage === stage.id)}
              onViewDeal={handleViewDeal}
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleAddNewDeal}
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-90"
        aria-label="Add new deal"
      >
        <Plus className="w-7 h-7" />
      </button>

      {isModalOpen && (
        <DealModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={selectedDeal}
          initialMode={modalMode}
        />
      )}
    </div>
  );
}
