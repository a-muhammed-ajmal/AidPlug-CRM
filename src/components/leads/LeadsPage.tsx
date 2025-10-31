import { Filter, Plus, Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../../contexts/UIContextDefinitions';
import { useLeads } from '../../hooks/useLeads';
import { Lead } from '../../types';
import EmptyState from '../common/EmptyState';
import SkeletonLoader from '../common/SkeletonLoader';
import AddLeadModal from './AddLeadModal';
import LeadCard from './LeadCard';
import LeadFilterModal from './LeadFilterModal';

type LeadStatusFilter = 'all' | NonNullable<Lead['qualification_status']>;
type LeadUrgencyFilter = 'all' | NonNullable<Lead['urgency_level']>;

interface LeadFilters {
  urgency: LeadUrgencyFilter;
  salaryRange: [number, number];
  products: string[];
}

export default function LeadsPage() {
  const { setTitle } = useUI();
  useEffect(() => {
    setTitle('Leads');
  }, [setTitle]);
  const location = useLocation();
  const { leads, isLoading } = useLeads();
  const [showAddModal, setShowAddModal] = useState(
    location.state?.showAddModal || false
  );
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] =
    useState<LeadStatusFilter>('all');

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const initialLeadFilters = useMemo<LeadFilters>(
    () => ({
      urgency: 'all',
      salaryRange: [0, 100000],
      products: [],
    }),
    []
  );
  const [leadFilters, setLeadFilters] = useState(initialLeadFilters);
  const [appliedLeadFilters, setAppliedLeadFilters] =
    useState(initialLeadFilters);

  const isFilterApplied = useMemo(() => {
    return (
      JSON.stringify(appliedLeadFilters) !== JSON.stringify(initialLeadFilters)
    );
  }, [appliedLeadFilters, initialLeadFilters]);

  useEffect(() => {
    if (location.state?.showAddModal) {
      setShowAddModal(true);
    }
  }, [location.state]);

  const handleOpenFilterModal = () => {
    setLeadFilters(appliedLeadFilters);
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedLeadFilters(leadFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFiltersInModal = () => {
    setLeadFilters(initialLeadFilters);
  };

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter((lead) => {
      const searchMatch =
        searchQuery === '' ||
        lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const statusMatch =
        leadStatusFilter === 'all' ||
        lead.qualification_status === leadStatusFilter;

      const urgencyMatch =
        appliedLeadFilters.urgency === 'all' ||
        lead.urgency_level === appliedLeadFilters.urgency;
      const salaryMatch =
        (lead.monthly_salary || 0) >= appliedLeadFilters.salaryRange[0];
      const productMatch =
        appliedLeadFilters.products.length === 0 ||
        appliedLeadFilters.products.some((p) =>
          lead.product_interest?.includes(p)
        );

      return (
        searchMatch &&
        statusMatch &&
        urgencyMatch &&
        salaryMatch &&
        productMatch
      );
    });
  }, [searchQuery, leadStatusFilter, appliedLeadFilters, leads]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search/Filter Skeleton */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <SkeletonLoader className="h-10 w-full" />
          <div className="flex space-x-1 mt-4">
            <SkeletonLoader className="h-10 flex-1" />
            <SkeletonLoader className="h-10 flex-1" />
            <SkeletonLoader className="h-10 flex-1" />
            <SkeletonLoader className="h-10 flex-1" />
          </div>
        </div>
        {/* Card Skeletons */}
        <div className="space-y-4">
          <SkeletonLoader className="h-40 rounded-xl" />
          <SkeletonLoader className="h-40 rounded-xl" />
          <SkeletonLoader className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingLead(null);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowAddModal(true);
  };


  return (
    <div className="relative pb-20">
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={handleOpenFilterModal}
              className="relative p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter
                className={`w-4 h-4 transition-colors ${isFilterApplied ? 'text-blue-600' : 'text-gray-600'}`}
              />
              {isFilterApplied && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {(
              [
                'all',
                'warm',
                'qualified',
                'appointment_booked',
              ] as LeadStatusFilter[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => setLeadStatusFilter(status)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all ${
                  leadStatusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status === 'appointment_booked'
                  ? 'Appointment'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
              />
            ))
          ) : (
            <EmptyState
              icon={<Users className="w-12 h-12 text-gray-300" />}
              title="No Leads Found"
              message="Try adjusting your search or filters, or add a new lead."
            />
          )}
        </div>
      </div>
      <button
        onClick={() => {
          setEditingLead(null);
          setShowAddModal(true);
        }}
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all active:scale-90"
        aria-label="Add new lead"
      >
        <Plus className="w-7 h-7" />
      </button>

      {(showAddModal || editingLead) && (
        <AddLeadModal onClose={handleCloseModal} initialData={editingLead} />
      )}

      <LeadFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={leadFilters}
        setFilters={setLeadFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFiltersInModal}
      />
    </div>
  );
}
