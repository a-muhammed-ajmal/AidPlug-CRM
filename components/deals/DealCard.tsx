import React from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Deal } from '../../types';
import { useDeals } from '../../hooks/useDeals';

interface DealCardProps {
  deal: Deal;
  onUpdateStage: ReturnType<typeof useDeals>['updateStage'];
}

// FIX: Changed to React.FC to correctly type component props, resolving the issue
// where the 'key' prop was being incorrectly flagged as an error by TypeScript.
const DealCard: React.FC<DealCardProps> = ({ deal, onUpdateStage }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-800 mb-2">{deal.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{deal.client_name}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span className="font-semibold">AED {deal.amount.toLocaleString()}</span>
        </div>

        {deal.expected_close_date && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
          </div>
        )}

        {deal.probability && (
          <div className="flex items-center space-x-2 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{deal.probability}% probability</span>
          </div>
        )}
      </div>

      {deal.product_type && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {deal.product_type}
          </span>
        </div>
      )}
    </div>
  );
};

export default DealCard;
