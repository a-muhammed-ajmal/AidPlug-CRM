
import React, { useState } from 'react';
import { Phone, Mail, Building, MoreVertical, Trash2, Edit } from 'lucide-react';
import { useLeads } from '../../hooks/useLeads';
import { Lead } from '../../types';

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  const { deleteLead } = useLeads();
  const [showMenu, setShowMenu] = useState(false);

  const statusColors: { [key: string]: string } = {
    warm: 'bg-yellow-100 text-yellow-700',
    qualified: 'bg-green-100 text-green-700',
    appointment_booked: 'bg-blue-100 text-blue-700',
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(lead.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {showMenu && (
        <div className="absolute top-12 right-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 w-36">
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      <div className="space-y-3 pr-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{lead.full_name}</h3>
          {lead.qualification_status && (
            <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${statusColors[lead.qualification_status]}`}>
              {lead.qualification_status.replace('_', ' ').toUpperCase()}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.company_name && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{lead.company_name}</span>
            </div>
          )}
        </div>

        {lead.loan_amount_requested && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">Loan Amount Requested</p>
            <p className="text-lg font-semibold text-gray-800">
              AED {lead.loan_amount_requested.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
