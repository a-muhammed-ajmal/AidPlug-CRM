import React from 'react';
import { Phone, Mail, Building, DollarSign, MoreVertical, Edit3, Trash2, Briefcase } from 'lucide-react';
import { Client } from '../../types';
import { useClients } from '../../hooks/useClients';
import { useUI } from '../../contexts/UIContext';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

const ClientCard = React.memo(({ client, onEdit }: ClientCardProps) => {
  const { deleteClient } = useClients();
  const { showConfirmation, addNotification } = useUI();

  const handleDelete = () => {
    showConfirmation(
      'Delete Client?',
      `Are you sure you want to permanently delete ${client.full_name}? This action cannot be undone.`,
      () => {
        deleteClient(client.id, {
            onSuccess: () => addNotification('Client Deleted', `${client.full_name} has been removed.`),
            onError: (e) => addNotification('Error', (e as Error).message),
        });
      }
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 active:scale-98">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-base">
                    {client.full_name.charAt(0).toUpperCase()}
                </span>
             </div>
             <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base truncate" title={client.full_name}>{client.full_name}</h3>
                <p className="text-sm text-gray-600 flex items-center truncate">
                  <Briefcase className="w-3 h-3 mr-1.5 text-gray-400 flex-shrink-0" />
                  {client.designation || 'N/A'}
                </p>
             </div>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
              client.relationship_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {client.relationship_status}
            </span>
            <DropdownMenu trigger={<MoreVertical className="w-4 h-4 text-gray-500 ml-2" />}>
                <DropdownMenuItem onClick={() => onEdit(client)} icon={<Edit3 className="w-4 h-4 mr-2" />}>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} icon={<Trash2 className="w-4 h-4 mr-2" />} className="text-red-600">
                    Delete
                </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700 border-t border-gray-100 pt-3">
            <div className="flex items-center">
                <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="truncate" title={client.company_name || ''}>{client.company_name || 'N/A'}</span>
            </div>
            <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span>{client.monthly_salary ? `${(client.monthly_salary / 1000).toFixed(0)}K AED` : 'N/A'}</span>
            </div>
        </div>
      </div>
      <div className="border-t border-gray-100 p-2">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); if (client.phone) window.location.href = `tel:${client.phone.replace(/\s/g, '')}`; }}
            disabled={!client.phone}
            className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50"
            aria-label="Call client"
          >
            <Phone className="w-3.5 h-3.5 mr-1" /> Call
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); if (client.email) window.location.href = `mailto:${client.email}`; }}
            disabled={!client.email}
            className="flex items-center justify-center py-2 px-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-semibold disabled:opacity-50"
            aria-label="Email client"
          >
            <Mail className="w-3.5 h-3.5 mr-1" /> Email
          </button>
        </div>
      </div>
    </div>
  );
});

export default ClientCard;