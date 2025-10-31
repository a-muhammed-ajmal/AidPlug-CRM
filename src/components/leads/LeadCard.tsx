import React from 'react';
import { Phone, Mail, Building, Briefcase, ChevronDown } from 'lucide-react';
import { Lead } from '../../types';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';
import { useLeads } from '../../hooks/useLeads';

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const Avatar = ({ name }: { name: string }) => {
  const initials = getInitials(name);
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
  ];
  const color = colors[Math.abs(hashCode(name)) % colors.length];

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${color} flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

const getStageColor = (stage: string | null) => {
  switch (stage) {
    case 'warm':
      return 'bg-yellow-100 text-yellow-800';
    case 'qualified':
      return 'bg-blue-100 text-blue-800';
    case 'appointment_booked':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStageLabel = (stage: string | null) => {
  switch (stage) {
    case 'warm':
      return 'Warm';
    case 'qualified':
      return 'Qualified';
    case 'appointment_booked':
      return 'Appointment';
    default:
      return 'Not Set';
  }
};

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.495 1.932 6.22l-1.023 3.744 3.845-1.004zm-3.837 1.387l.494.296c1.695 1.011 3.58 1.574 5.63 1.576 6.245 0 11.33-5.084 11.332-11.33.001-6.247-5.085-11.332-11.334-11.332-6.245 0-11.331 5.085-11.333 11.331.001 2.431.792 4.78 2.215 6.64l.43.586-1.24 4.545 4.66-1.219z" />
  </svg>
);

const LeadCard = React.memo(({ lead, onEdit }: LeadCardProps) => {
  const { updateLead } = useLeads();

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleStageChange = (newStage: string) => {
    updateLead.mutate({
      id: lead.id,
      updates: { qualification_status: newStage as Lead['qualification_status'] },
    });
  };

  const handleCall = () => {
    if (lead.phone)
      window.location.href = `tel:${lead.phone.replace(/\s/g, '')}`;
  };
  const handleEmail = () => {
    if (lead.email)
      window.location.href = `mailto:${lead.email}`;
  };
  const handleWhatsApp = () => {
    if (lead.phone) {
      const whatsappNumber = lead.phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-98">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Avatar name={lead.full_name} />
          <div className="flex-1 min-w-0">
            <h4
              className="font-bold text-gray-900 truncate text-sm md:text-base"
              title={lead.full_name}
            >
              {lead.full_name}
            </h4>
            <p
              className="text-xs text-gray-500 truncate"
              title={lead.company_name || 'N/A'}
            >
              {lead.company_name || 'No Company'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <DropdownMenu
            trigger={
              <button className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStageColor(lead.qualification_status)}`}>
                <span className="hidden sm:inline">{getStageLabel(lead.qualification_status)}</span>
                <span className="sm:hidden">{getStageLabel(lead.qualification_status).charAt(0)}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            }
          >
            <DropdownMenuItem onClick={() => handleStageChange('warm')}>
              Warm
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStageChange('qualified')}>
              Qualified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStageChange('appointment_booked')}>
              Appointment
            </DropdownMenuItem>
          </DropdownMenu>
          <button
            onClick={(e) => handleActionClick(e, () => onEdit(lead))}
            className="p-1 -mr-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700 my-3 border-t border-gray-100 pt-3">
        <div className="flex items-center text-xs">
          <Building className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate" title={lead.bank_name || ''}>
            {lead.bank_name || 'N/A'}
          </span>
        </div>
        <div className="flex items-center text-xs">
          <Briefcase className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate" title={lead.product || ''}>
            {lead.product || 'N/A'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={(e) => handleActionClick(e, handleCall)}
          disabled={!lead.phone}
          className="flex items-center justify-center py-2 px-1 md:px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="w-3.5 h-3.5 mr-1 md:mr-1.5" />
          <span className="hidden sm:inline">Call</span>
        </button>
        <button
          onClick={(e) => handleActionClick(e, handleWhatsApp)}
          disabled={!lead.phone}
          className="flex items-center justify-center py-2 px-1 md:px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <WhatsAppIcon />
          <span className="ml-1 md:ml-1.5 hidden sm:inline">WhatsApp</span>
        </button>
        <button
          onClick={(e) => handleActionClick(e, handleEmail)}
          disabled={!lead.email}
          className="flex items-center justify-center py-2 px-1 md:px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail className="w-3.5 h-3.5 mr-1 md:mr-1.5" />
          <span className="hidden sm:inline">Email</span>
        </button>
      </div>
    </div>
  );
});

export default LeadCard;
