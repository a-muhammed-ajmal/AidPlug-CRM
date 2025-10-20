import React from 'react';
import { DollarSign, Calendar, TrendingUp, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import { Deal } from '../../types';
import DropdownMenu, { DropdownMenuItem } from '../common/DropdownMenu';

interface DealCardProps {
  deal: Deal;
  onView: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onView, onEdit, onDelete }) => {
  return (
    <div onClick={() => onView(deal)} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer active:scale-95">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-gray-800">{deal.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{deal.client_name}</p>
        </div>
        <DropdownMenu trigger={<MoreVertical className="w-4 h-4 text-gray-500" />}>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(deal); }} icon={<Edit3 className="w-4 h-4 mr-2" />}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(deal); }} icon={<Trash2 className="w-4 h-4 mr-2" />} className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenu>
      </div>

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
            {/* FIX: Corrected a corrupted line of code that was causing a syntax error. */}
            <TrendingUp className="w-4 h-4" />
            <span>{deal.probability}% Probability</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;