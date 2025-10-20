
import React from 'react';
import DealCard from './DealCard';
import { Deal } from '../../types';
import { Stage } from './DealsPage';

interface DealColumnProps {
  stage: Stage;
  deals: Deal[];
  onViewDeal: (deal: Deal) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (deal: Deal) => void;
}

// FIX: Change to React.FC to correctly handle framework-specific props like 'key'.
const DealColumn: React.FC<DealColumnProps> = ({ stage, deals, onViewDeal, onEditDeal, onDeleteDeal }) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-80 h-full flex flex-col snap-center border rounded-xl overflow-hidden shadow-sm">
      <div className={`${colorClasses[stage.color]} p-3`}>
        <h3 className="font-semibold text-sm">{stage.label}</h3>
        <p className="text-xs mt-1">{deals.length} deals</p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-grow p-3 bg-gray-50">
        {deals.map((deal) => (
          <DealCard 
            key={deal.id} 
            deal={deal} 
            onView={onViewDeal}
            onEdit={onEditDeal}
            onDelete={onDeleteDeal}
          />
        ))}
      </div>
    </div>
  );
};

export default DealColumn;
