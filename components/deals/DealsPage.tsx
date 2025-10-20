
import React, { useState, useEffect, ComponentType } from 'react';
import { Plus, X, Edit3, DollarSign, Calendar, TrendingUp, Briefcase, ChevronDown } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';
import DealColumn from './DealColumn';
import { Deal } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';
import { KANBAN_STAGES } from '../../lib/constants';

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
  amount: 0,
  // FIX: Widened the type of 'stage' to allow any valid deal stage, not just the default.
  stage: 'application_processing' as Deal['stage'],
  expected_close_date: new Date().toISOString().split('T')[0],
  probability: 10,
};

// Use title property from KANBAN_STAGES
const stageOptions = KANBAN_STAGES.map(s => ({ value: s.id, label: s.title }));

const DetailItem = ({ icon: Icon, label, value }: { icon: ComponentType<any>, label: string, value: string | number | null }) => (
    <div className="flex items-start space-x-3">
        <div className="bg-gray-100 p-2 rounded-lg mt-1"><Icon className="w-4 h-4 text-gray-600" /></div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value || 'N/A'}</p>
        </div>
    </div>
  );

const FormInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        {children}
    </div>
  );

// FIX: Moved DealModal outside of DealsPage component to prevent re-renders and fix type errors.
function DealModal({ isOpen, onClose, initialData, initialMode = 'view' }: DealModalProps) {
  const { createDeal, updateDeal } = useDeals();
  const { user } = useAuth();
  const { addNotification } = useUI();
  
  const [mode, setMode] = useState(initialData ? initialMode : 'edit');
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        client_name: initialData.client_name || '',
        amount: initialData.amount || 0,
        stage: initialData.stage || 'application_processing',
        expected_close_date: initialData.expected_close_date ? initialData.expected_close_date.split('T')[0] : new Date().toISOString().split('T')[0],
        probability: initialData.probability || 10,
      });
      setMode(initialMode);
    } else {
      setFormData(defaultFormData);
      setMode('edit');
    }
  }, [initialData, initialMode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumberField = name === 'amount' || name === 'probability';
    setFormData(prev => ({ ...prev, [name]: isNumberField ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addNotification('Authentication Error', 'You must be logged in.');
      return;
    }
    setLoading(true);

    const dealData = { ...formData, user_id: user.id };
    
    const mutation = initialData 
      ? (data: any) => updateDeal({ id: initialData!.id, updates: data })
      : createDeal;

    mutation(dealData, {
      onSuccess: () => {
        addNotification(initialData ? 'Deal Updated' : 'Deal Created', `${formData.title} has been saved.`);
        onClose();
      },
      onError: (err) => addNotification('Error', (err as Error).message),
      onSettled: () => setLoading(false)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end animate-fade-in sm:items-center">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-bold text-gray-900">
            {mode === 'edit' ? (initialData ? 'Edit Deal' : 'Add New Deal') : (initialData?.title || 'Deal Details')}
          </h1>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
        </header>
        
        {mode === 'view' && initialData ? (
            <>
                <main className="p-6 overflow-y-auto space-y-4">
                    <DetailItem icon={Briefcase} label="Client" value={initialData.client_name} />
                    <DetailItem icon={DollarSign} label="Amount" value={`AED ${initialData.amount.toLocaleString()}`} />
                    <DetailItem icon={Calendar} label="Expected Close" value={initialData.expected_close_date ? new Date(initialData.expected_close_date).toLocaleDateString() : null} />
                    <DetailItem icon={TrendingUp} label="Probability" value={`${initialData.probability || 0}%`} />
                    <DetailItem icon={ChevronDown} label="Stage" value={stageOptions.find(s => s.value === initialData.stage)?.label || 'N/A'} />
                </main>
                <footer className="p-4 bg-gray-50 border-t">
                    <button onClick={() => setMode('edit')} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow flex items-center justify-center">
                        <Edit3 className="w-4 h-4 mr-2" /> Edit Deal
                    </button>
                </footer>
            </>
        ) : (
            <form onSubmit={handleSubmit}>
                <main className="p-6 overflow-y-auto space-y-4">
                    {/* FIX: Explicitly pass children prop to avoid TypeScript error. */}
                    <FormInput label="Deal Title*" children={
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />
                    } />
                    <FormInput label="Client Name*" children={
                        <input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />
                    } />
                    <FormInput label="Amount (AED)*" children={
                        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />
                    } />
                    <FormInput label="Stage" children={
                        <div className="relative">
                            <select name="stage" value={formData.stage} onChange={handleChange} className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10">{stageOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    } />
                    <FormInput label="Expected Close Date" children={
                        <input type="date" name="expected_close_date" value={formData.expected_close_date} onChange={handleChange} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3" />
                    } />
                    <FormInput label={`Probability: ${formData.probability}%`} children={
                        <input type="range" name="probability" value={formData.probability} onChange={handleChange} min="0" max="100" step="5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    } />
                </main>
                <footer className="p-4 bg-gray-50 border-t">
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95 shadow disabled:opacity-50">
                        {loading ? 'Saving...' : (initialData ? 'Update Deal' : 'Save Deal')}
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
  const { deals, isLoading, deleteDeal } = useDeals();
  const { showConfirmation, addNotification } = useUI();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const stages: Stage[] = [
    { id: 'application_processing', label: 'Application Processing', color: 'blue' },
    { id: 'verification_needed', label: 'Verification Needed', color: 'yellow' },
    { id: 'activation_needed', label: 'Activation Needed', color: 'purple' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'unsuccessful', label: 'Unsuccessful', color: 'red' },
  ];

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
  
  const handleAddNewDeal = () => {
    setSelectedDeal(null);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (deal: Deal) => {
    showConfirmation(
      'Delete Deal?',
      `Are you sure you want to permanently delete the deal "${deal.title}"? This action cannot be undone.`,
      () => {
        deleteDeal(deal.id, {
          onSuccess: () => addNotification('Deal Deleted', `The deal has been successfully removed.`),
          onError: (error) => addNotification('Error', (error as Error).message || 'Failed to delete deal.'),
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0 px-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Deals Pipeline</h2>
          <p className="text-gray-600 text-sm mt-1">{deals.length} active deals</p>
        </div>
        <button 
          onClick={handleAddNewDeal}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow overflow-x-auto snap-x snap-mandatory scroll-p-4 -mx-4 mt-4">
        <div className="flex space-x-4 h-full px-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage === stage.id);
            return (
              <DealColumn
                key={stage.id}
                stage={stage}
                deals={stageDeals}
                onViewDeal={handleViewDeal}
                onEditDeal={handleEditDeal}
                onDeleteDeal={handleDeleteDeal}
              />
            );
          })}
        </div>
      </div>

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
