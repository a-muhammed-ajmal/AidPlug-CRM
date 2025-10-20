import React from 'react';
import DealCard from './DealCard';
import { Deal } from '../../types';
import { Stage } from './DealsPage';
import { useDeals } from '../../hooks/useDeals';

interface DealColumnProps {
  stage: Stage;
  deals: Deal[];
  onUpdateStage: ReturnType<typeof useDeals>['updateStage'];
}

// FIX: Changed to React.FC to correctly type component props, resolving the issue
// where the 'key' prop was being incorrectly flagged as an error by TypeScript.
const DealColumn: React.FC<DealColumnProps> = ({ stage, deals, onUpdateStage }) => {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex-shrink-0 w-72 h-full flex flex-col">
      <div className={`${colorClasses[stage.color]} rounded-lg p-3 mb-3 sticky top-0 bg-opacity-95 backdrop-blur-sm`}>
        <h3 className="font-semibold text-sm">{stage.label}</h3>
        <p className="text-xs mt-1">{deals.length} deals</p>
      </div>

      <div className="space-y-3 overflow-y-auto flex-grow pr-1">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onUpdateStage={onUpdateStage} />
        ))}
      </div>
    </div>
  );
};

export default DealColumn;
