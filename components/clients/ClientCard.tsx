

import React from 'react';
import { Phone, Mail, DollarSign, User, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { Client } from '../../types';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';

// A simple SVG icon for WhatsApp
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.495 1.932 6.22l-1.023 3.744 3.845-1.004zm-3.837 1.387l.494.296c1.695 1.011 3.58 1.574 5.63 1.576 6.245 0 11.33-5.084 11.332-11.33.001-6.247-5.085-11.332-11.334-11.332-6.245 0-11.331 5.085-11.333 11.331.001 2.431.792 4.78 2.215 6.64l.43.586-1.24 4.545 4.66-1.219z"/>
    </svg>
);

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const ClientCard = React.memo(({ client, onClick, onEdit, onDelete }: ClientCardProps) => {

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleCall = () => { if (client.phone) window.location.href = `tel:${client.phone}`; };
  const handleEmail = () => { if (client.email) window.location.href = `mailto:${client.email}`; };
  const handleWhatsApp = () => {
    if (client.whatsapp_number) {
      const whatsappNumber = client.whatsapp_number.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    }
  };

  return (
    <div 
      onClick={() => onClick(client)}
      className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {client.photo_url ? (
                        <img src={client.photo_url} alt={client.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate" title={client.full_name}>{client.full_name}</h3>
                    <p className="text-sm text-gray-600 truncate" title={`${client.designation} at ${client.company_name}`}>{client.designation} at {client.company_name}</p>
                    <div className="text-sm text-gray-700 mt-1 flex items-center">
                        <DollarSign className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        <span className="font-medium">AED {client.monthly_salary?.toLocaleString() || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <DropdownMenu trigger={<MoreVertical className="w-4 h-4 text-gray-500" />} children={
              <>
                <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onEdit(client))} icon={<Edit3 className="w-4 h-4 mr-2" />} children="Edit" />
                <DropdownMenuItem onClick={(e) => handleActionClick(e, () => onDelete(client.id))} icon={<Trash2 className="w-4 h-4 mr-2" />} className="text-red-600" children="Delete" />
              </>
            } />
        </div>
      </div>
      <div className="border-t border-gray-100 px-2 py-2">
        <div className="grid grid-cols-3 gap-1">
            <button onClick={(e) => handleActionClick(e, handleCall)} disabled={!client.phone} className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <Phone className="w-3.5 h-3.5 mr-1.5" /> Call
            </button>
            <button onClick={(e) => handleActionClick(e, handleWhatsApp)} disabled={!client.whatsapp_number} className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <WhatsAppIcon /> <span className="ml-1.5">WhatsApp</span>
            </button>
            <button onClick={(e) => handleActionClick(e, handleEmail)} disabled={!client.email} className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                <Mail className="w-3.5 h-3.5 mr-1.5" /> Email
            </button>
        </div>
      </div>
    </div>
  );
});

export default ClientCard;
