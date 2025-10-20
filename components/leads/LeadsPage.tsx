
import React, { useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';
import { Lead } from '../../types';

type FilterStatus = 'all' | Lead['qualification_status'];

export default function LeadsPage() {
  const { leads, isLoading } = useLeads();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || lead.qualification_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filterOptions: FilterStatus[] = ['all', 'warm', 'qualified', 'appointment_booked'];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads</h2>
          <p className="text-gray-600 text-sm mt-1">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filterOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No leads found</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Add your first lead
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
