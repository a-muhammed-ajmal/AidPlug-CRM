import React from 'react';
import {
  Briefcase,
  MoreVertical,
  Edit3,
  Trash2,
  Building,
  Folder,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { useDeals } from '../../hooks/useDeals';
import { Lead } from '../../types';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';
import { useUI } from '../../contexts/UIContext';
import { useAuth } from '../../contexts/AuthContext';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

export const LeadCard = React.memo(({ lead, onEdit }: LeadCardProps) => {
  const { user } = useAuth();
  const { deleteLead, updateLead } = useLeads();
  const { createDeal } = useDeals();
  const { showConfirmation, addNotification, logActivity } = useUI();

  const getStatusColor = (status: Lead['qualification_status']) => {
    const colors = {
      appointment_booked: 'bg-purple-100 text-purple-800',
      warm: 'bg-orange-100 text-orange-800',
      qualified: 'bg-blue-100 text-blue-800',
    };
    return colors[status || 'warm'] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyIcon = (urgency: Lead['urgency_level']) => {
    if (urgency === 'high')
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    if (urgency === 'medium')
      return <Clock className="w-3 h-3 text-orange-500" />;
    return null;
  };

  const handleDelete = () => {
    showConfirmation(
      'Delete Lead?',
      'This action cannot be undone. Are you sure you want to permanently delete this lead?',
      () => {
        deleteLead.mutate(lead.id, {
          onSuccess: () =>
            addNotification(
              'Lead Deleted',
              `Lead "${lead.full_name}" has been removed.`
            ),
          onError: (e) => addNotification('Error', (e as Error).message),
        });
      }
    );
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

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;

    if (value === 'convert') {
      showConfirmation(
        'Convert to Deal?',
        `This will create a new deal for "${lead.full_name}" and remove this lead. Are you sure?`,
        handleConvert
      );
    } else {
      handleStatusChange(value as 'warm' | 'qualified' | 'appointment_booked');
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 active:scale-98">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3
                className="font-semibold text-gray-900 text-base truncate"
                title={lead.full_name}
              >
                {lead.full_name}
              </h3>
              {getUrgencyIcon(lead.urgency_level)}
            </div>
            <p className="text-sm text-gray-600 flex items-center truncate">
              <Briefcase className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
              <span title={lead.company_name || 'N/A'}>
                {lead.company_name || 'N/A'}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(lead.qualification_status)}`}
            >
              {lead.qualification_status?.replace(/_/g, ' ') || 'N/A'}
            </span>
            <DropdownMenu
              trigger={<MoreVertical className="w-4 h-4 text-gray-500" />}
              children={
                <>
                  <DropdownMenuItem
                    onClick={() => onEdit(lead)}
                    icon={<Edit3 className="w-4 h-4 mr-2" />}
                    children="Edit"
                  />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    icon={<Trash2 className="w-4 h-4 mr-2" />}
                    className="text-red-600"
                    children="Delete"
                  />
                </>
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700 border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={lead.bank_name || ''}>
              {lead.bank_name || 'N/A'}
            </span>
          </div>
          <div className="flex items-center">
            <Folder className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={lead.product || ''}>
              {lead.product || 'N/A'}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>
              {lead.monthly_salary
                ? `${(lead.monthly_salary / 1000).toFixed(0)}K AED`
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={lead.location || ''}>
              {lead.location || 'N/A'}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-2 space-y-2">
        <div className="relative">
          <select
            defaultValue=""
            onChange={handleActionChange}
            className="w-full appearance-none py-2 pl-3 pr-8 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            aria-label="Lead Actions"
          >
            <option value="" disabled>
              Change Status...
            </option>
            <option value="warm">Warm</option>
            <option value="qualified">Qualified</option>
            <option value="appointment_booked">Appointment</option>
            <option
              value="convert"
              className="font-medium text-green-700 bg-green-50"
            >
              Convert to Deal
            </option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (lead.phone)
                window.location.href = `tel:${lead.phone.replace(/\s/g, '')}`;
            }}
            disabled={!lead.phone}
            className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50"
            aria-label="Call lead"
          >
            <Phone className="w-3.5 h-3.5 mr-1" /> Call
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (lead.email) window.location.href = `mailto:${lead.email}`;
            }}
            disabled={!lead.email}
            className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50"
            aria-label="Email lead"
          >
            <Mail className="w-3.5 h-3.5 mr-1" /> Email
          </button>
        </div>
      </div>
    </div>
  );
});

export default LeadCard;
