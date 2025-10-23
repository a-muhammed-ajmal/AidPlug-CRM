
import React from 'react';
import { Phone, Mail, DollarSign, User, Briefcase } from 'lucide-react';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
}

const ClientCard = React.memo(({ client, onClick }: ClientCardProps) => {
  return (
    <div 
      onClick={() => onClick(client)}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {client.photo_url ? (
                <img src={client.photo_url} alt={client.full_name} className="w-full h-full object-cover" />
            ) : (
                <User className="w-6 h-6 text-gray-400" />
            )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base">{client.full_name}</h3>
          <p className="text-sm text-gray-600">{client.designation}</p>
          <p className="text-xs text-gray-500 mt-1">{client.company_name}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
            <span>{client.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center text-gray-700">
            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
            <span className="truncate">{client.email || 'N/A'}</span>
        </div>
        <div className="flex items-center text-gray-700">
            <DollarSign className="w-3.5 h-3.5 mr-2 text-gray-400" />
            <span>AED {client.monthly_salary?.toLocaleString() || 'N/A'} / month</span>
        </div>
      </div>
    </div>
  );
});

export default ClientCard;
