
import React from 'react';
import { Phone, Mail, Building, DollarSign } from 'lucide-react';
import { Client } from '../../types';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-semibold text-lg">
            {client.full_name.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {client.full_name}
          </h3>
          <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
            client.relationship_status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {client.relationship_status}
          </span>

          <div className="mt-3 space-y-2 text-sm">
            {client.phone && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.company_name && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{client.company_name}</span>
              </div>
            )}
          </div>

          {client.total_loan_amount && client.total_loan_amount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600">Total Loan:</span>
                <span className="text-sm font-semibold text-gray-800">
                  AED {client.total_loan_amount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
