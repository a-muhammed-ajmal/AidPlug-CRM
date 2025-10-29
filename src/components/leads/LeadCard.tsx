import React, { useState } from 'react';
import {
  Briefcase,
  Folder,
  DollarSign,
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  Eye,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useDeals } from '../../hooks/useDeals';
import { Lead } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';
import { LeadDetailModal } from './LeadDetailModal';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = React.memo(({ lead }: LeadCardProps) => {
  const { user } = useAuth();
  const { deleteLead, updateLead } = useLeads();
  const { createDeal } = useDeals();
  const { showConfirmation, addNotification, logActivity } = useUI();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: Lead['qualification_status']) => {
    const colors = {
      appointment_booked: 'bg-[#1a68c7] text-white border-[#1a68c7]',
      warm: 'bg-orange-100 text-orange-800 border-orange-500',
      qualified: 'bg-[#74c12d] text-white border-[#74c12d]',
    };
    return (
      colors[status || 'warm'] || 'bg-gray-100 text-gray-800 border-gray-500'
    );
  };

  const hasRecentApplication = lead.applied_recently;

  const handleConvert = () => {
    if (!user) return;
    const newDeal = {
      title: `${lead.product || 'Deal'} - ${lead.full_name}`,
      amount:
        lead.loan_amount_requested || (lead.monthly_salary || 0) * 3 || 50000,
      stage: 'application_processing' as const,
      client_name: lead.full_name,
      expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      probability: 25,
      product_type: lead.product?.toLowerCase().replace(/ /g, '_'),
      user_id: user.id,
      application_number: `APP-${Math.floor(10000 + Math.random() * 90000)}`,
      bdi_number: `BDI-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    createDeal.mutate(newDeal, {
      onSuccess: () => {
        addNotification('Lead Converted', `${lead.full_name} is now a deal.`);
        logActivity(
          'lead_convert',
          `Converted lead "${lead.full_name}" to a deal.`
        );
        deleteLead.mutate(lead.id);
      },
      onError: (e: Error) => addNotification('Conversion Failed', e.message),
    });
  };

  const handleStatusChange = (
    newStatus: 'warm' | 'qualified' | 'appointment_booked'
  ) => {
    updateLead.mutate(
      { id: lead.id, updates: { qualification_status: newStatus } },
      {
        onSuccess: (updatedLead: Lead) =>
          addNotification(
            'Status Updated',
            `${updatedLead.full_name} is now ${newStatus.replace(/_/g, ' ')}.`
          ),
        onError: (e: Error) => addNotification('Update Failed', e.message),
      }
    );
  };

  return (
    <>
      <div
        className={`bg-white border rounded-lg hover:shadow-md transition-all border-l-4 ${getStatusColor(lead.qualification_status).split(' ')[3] || 'border-gray-500'} p-4`}
      >
        {/* 60-day warning banner */}
        {hasRecentApplication && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <span className="text-xs text-yellow-800">
              Applied in last 60 days
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3
                className="font-semibold text-gray-900 text-sm flex items-center"
                title={lead.full_name}
              >
                {lead.full_name}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.qualification_status)}`}
              >
                {lead.qualification_status === 'appointment_booked'
                  ? 'Appointment'
                  : lead.qualification_status === 'qualified'
                    ? 'Qualified'
                    : 'Warm'}
              </span>
            </div>
            <p className="text-xs text-gray-600 flex items-center">
              <Briefcase className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
              <span title={lead.company_name || 'N/A'}>
                {lead.company_name || 'N/A'}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 mb-3">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-gray-400" />
            <span>
              {lead.monthly_salary
                ? `${(lead.monthly_salary / 1000).toFixed(0)}K AED`
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{lead.phone ? lead.phone.replace(/^\+971/, '') : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Folder className="w-3 h-3 text-gray-400" />
            <span className="truncate" title={lead.product || ''}>
              {lead.product || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="truncate" title={lead.location || ''}>
              {lead.location || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-1 col-span-2">
            <Briefcase className="w-3 h-3 text-gray-400" />
            <span className="truncate" title={lead.bank_name || ''}>
              {lead.bank_name || 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.phone)
                  window.location.href = `tel:${lead.phone.replace(/\s/g, '')}`;
              }}
              disabled={!lead.phone}
              className="p-1.5 hover:bg-[#1a68c7]/10 rounded-md transition-colors"
              title="Call"
            >
              <Phone className="w-4 h-4 text-[#1a68c7]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.phone)
                  window.location.href = `https://wa.me/${lead.phone.replace(/\s/g, '')}`;
              }}
              disabled={!lead.phone}
              className="p-1.5 hover:bg-[#74c12d]/10 rounded-md transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#74c12d]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.email) window.location.href = `mailto:${lead.email}`;
              }}
              disabled={!lead.email}
              className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <select
              defaultValue={lead.qualification_status || 'warm'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'convert') {
                  showConfirmation(
                    'Convert to Deal?',
                    `This will create a new deal for "${lead.full_name}" and remove this lead. Are you sure?`,
                    handleConvert
                  );
                } else {
                  handleStatusChange(
                    value as 'warm' | 'qualified' | 'appointment_booked'
                  );
                }
                e.target.value = lead.qualification_status || 'warm';
              }}
              className={`appearance-none text-xs font-medium px-2 py-1 rounded border ${getStatusColor(lead.qualification_status)} focus:outline-none focus:ring-2 focus:ring-[#1a68c7]/20`}
            >
              <option value="warm">Warm</option>
              <option value="qualified">Qualified</option>
              <option value="appointment_booked">Appointment</option>
            </select>
            <ChevronDown className="w-3 h-3 text-current pointer-events-none" />

            <button
              onClick={() => {
                showConfirmation(
                  'Convert to Deal?',
                  `This will create a new deal for "${lead.full_name}" and remove this lead. Are you sure?`,
                  handleConvert
                );
              }}
              className="px-3 py-1 bg-[#74c12d] text-white text-xs font-medium rounded hover:bg-[#62a821] transition-colors"
            >
              To Deal
            </button>
          </div>
        </div>
      </div>

      <LeadDetailModal
        lead={lead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

export default LeadCard;
