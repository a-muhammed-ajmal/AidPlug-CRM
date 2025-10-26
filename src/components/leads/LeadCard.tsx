import React from 'react';
import {
  Briefcase,
  MoreVertical,
  Folder,
  DollarSign,
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  Eye,
  Zap,
} from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useDeals } from '../../hooks/useDeals';
import { Lead } from '../../types';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = React.memo(({ lead }: LeadCardProps) => {
  const { user } = useAuth();
  const { deleteLead, updateLead } = useLeads();
  const { createDeal } = useDeals();
  const { showConfirmation, addNotification, logActivity } = useUI();

  const getStatusColor = (status: Lead['qualification_status']) => {
    const colors = {
      appointment_booked: 'bg-purple-100 text-purple-800 border-purple-500',
      warm: 'bg-orange-100 text-orange-800 border-orange-500',
      qualified: 'bg-green-100 text-green-800 border-green-600',
    };
    return colors[status || 'warm'] || 'bg-gray-100 text-gray-800 border-gray-500';
  };



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
    <div className={`bg-white border rounded-xl hover:shadow-md transition-all border-l-4 ${getStatusColor(lead.qualification_status).split(' ')[3] || 'border-gray-500'}`}>
      <div className="p-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3
                className="font-semibold text-gray-900 text-base flex items-center"
                title={lead.full_name}
              >
                {lead.full_name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <Briefcase className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
              <span title={lead.company_name || 'N/A'}>
                {lead.company_name || 'N/A'}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.phone)
                  window.location.href = `tel:${lead.phone.replace(/\s/g, '')}`;
              }}
              disabled={!lead.phone}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Call"
            >
              <Phone className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (lead.phone) window.location.href = `https://wa.me/${lead.phone.replace(/\s/g, '')}`;
              }}
              disabled={!lead.phone}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle menu logic would go here
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              {/* Menu would be implemented here */}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              <span>
                {lead.monthly_salary
                  ? `${(lead.monthly_salary / 1000).toFixed(0)}K AED`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{lead.phone ? lead.phone.substring(4) : 'N/A'}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex items-center space-x-2">
              <Folder className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate" title={lead.product || ''}>
                {lead.product || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate" title={lead.location || ''}>
                {lead.location || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-3">
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
                handleStatusChange(value as 'warm' | 'qualified' | 'appointment_booked');
              }
              e.target.value = lead.qualification_status || 'warm';
            }}
            className={`w-full appearance-none text-xs font-bold pl-3 pr-8 py-1.5 rounded-md border ${getStatusColor(lead.qualification_status)} focus:outline-none`}
          >
            <option value="warm">Warm</option>
            <option value="qualified">Qualified</option>
            <option value="appointment_booked">Appointment</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
        </div>
      </div>
      <div className="border-t border-gray-100 p-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            // View details logic would go here
          }}
          className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          Details
        </button>
        <button
          onClick={() => {
            showConfirmation(
              'Convert to Deal?',
              `This will create a new deal for "${lead.full_name}" and remove this lead. Are you sure?`,
              handleConvert
            );
          }}
          className="flex items-center justify-center py-2 px-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-semibold"
        >
          <Zap className="w-3.5 h-3.5 mr-1" />
          To Deal
        </button>
      </div>
    </div>
  );
});

export default LeadCard;
