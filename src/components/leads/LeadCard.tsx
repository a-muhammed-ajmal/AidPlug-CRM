import React from 'react';
import {
  User,
  Building2,
  DollarSign,
  Briefcase,
  CreditCard,
  Edit,
  TrendingUp,
  Trash2,
  Phone,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { Lead } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: Lead['qualification_status']) => void;
  onConvertToDeal: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onEdit,
  onDelete,
  onStatusChange,
  onConvertToDeal,
}) => {
  const getStatusInfo = (status: Lead['qualification_status']) => {
    switch (status) {
      case 'warm':
        return {
          color: 'bg-orange-500',
          text: 'Warm',
          ring: 'focus:ring-orange-500',
          bgBorder: 'bg-orange-50 border-orange-300 text-orange-700',
        };
      case 'qualified':
        return {
          color: 'bg-blue-500',
          text: 'Qualified',
          ring: 'focus:ring-blue-500',
          bgBorder: 'bg-blue-50 border-blue-300 text-blue-700',
        };
      case 'appointment_booked':
        return {
          color: 'bg-purple-500',
          text: 'Appointment',
          ring: 'focus:ring-purple-500',
          bgBorder: 'bg-purple-50 border-purple-300 text-purple-700',
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'N/A',
          ring: 'focus:ring-gray-500',
          bgBorder: 'bg-gray-50 border-gray-300 text-gray-700',
        };
    }
  };

  const statusInfo = getStatusInfo(lead.qualification_status);

  const formatWhatsAppNumber = (mobile: string | null) => {
    return mobile?.replace(/[^0-9]/g, '') || '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
      <div className={`h-1.5 ${statusInfo.color}`}></div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            {lead.full_name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lead.company_name}</span>
          </div>
        </div>

        <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              Salary
            </span>
            <span className="font-semibold text-gray-900">
              AED {lead.monthly_salary?.toLocaleString() || 'N/A'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Bank
            </span>
            <span className="font-medium text-gray-900 text-xs">
              {lead.bank_name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Product
            </span>
            <span className="font-medium text-gray-900 text-xs">
              {lead.product}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">Status</label>
          <select
            value={lead.qualification_status || ''}
            onChange={(e) =>
              onStatusChange(
                lead.id,
                e.target.value as Lead['qualification_status']
              )
            }
            className={`w-full px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all focus:ring-2 ${statusInfo.bgBorder} ${statusInfo.ring}`}
          >
            <option value="warm">🔥 Warm</option>
            <option value="qualified">✅ Qualified</option>
            <option value="appointment_booked">📅 Appointment</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
            title="Call"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={`https://wa.me/${formatWhatsAppNumber(lead.whatsapp_number)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all"
            title="WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-all"
            title="Email"
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onConvertToDeal(lead)}
            className="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            To Deal
          </button>
        </div>

        <button
          onClick={() => onDelete(lead.id)}
          className="w-full mt-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Delete Lead
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
