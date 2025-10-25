import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  Edit3,
  Mail,
  MoreVertical,
  Phone,
  Trash2
} from 'lucide-react';
import React from 'react';
import { Deal } from '../../types';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';

interface DealCardProps {
  deal: Deal;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

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

const DealCard = React.memo(
  ({ deal, onView, onEdit, onDelete }: DealCardProps) => {
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
      e.stopPropagation();
      action();
    };

    const handleCall = () => {
      if (deal.mobile_number)
        window.location.href = `tel:${deal.mobile_number.replace(/\s/g, '')}`;
    };
    const handleEmail = () => {
      if (deal.email_address)
        window.location.href = `mailto:${deal.email_address}`;
    };
    const handleWhatsApp = () => {
      if (deal.whatsapp_number) {
        const whatsappNumber = deal.whatsapp_number.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
      }
    };

    return (
      <div
        onClick={() => onView(deal)}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer active:scale-95"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <h4 className="font-semibold text-gray-800">{deal.client_name}</h4>
            <p
              className="text-sm text-gray-600 mt-1 truncate"
              title={deal.title}
            >
              {deal.title}
            </p>
          </div>
          <DropdownMenu
            trigger={<MoreVertical className="w-4 h-4 text-gray-500" />}
            children={
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(deal);
                  }}
                  icon={<Edit3 className="w-4 h-4 mr-2" />}
                  children="Edit"
                />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(deal);
                  }}
                  icon={<Trash2 className="w-4 h-4 mr-2" />}
                  className="text-red-600"
                  children="Delete"
                />
              </>
            }
          />
        </div>

        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <Building className="w-3.5 h-3.5 flex-shrink-0" />
            <span
              className="truncate"
              title={`${deal.designation} at ${deal.company_name}`}
            >
              {deal.designation} at {deal.company_name}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium">
              AED {deal.monthly_salary?.toLocaleString() || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate" title={deal.product || undefined}>
              {deal.product}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Submitted:{' '}
              {new Date(deal.created_at || Date.now()).toLocaleDateString(
                'en-GB',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }
              )}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={(e) => handleActionClick(e, handleCall)}
              disabled={!deal.mobile_number}
              className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
            </button>
            <button
              onClick={(e) => handleActionClick(e, handleWhatsApp)}
              disabled={!deal.whatsapp_number}
              className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <WhatsAppIcon /> <span className="ml-1.5">WhatsApp</span>
            </button>
            <button
              onClick={(e) => handleActionClick(e, handleEmail)}
              disabled={!deal.email_address}
              className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default DealCard;
