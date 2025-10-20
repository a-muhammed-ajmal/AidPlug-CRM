
import React from 'react';
import { Plus } from 'lucide-react';
import { useDeals } from '../../hooks/useDeals';
import DealColumn from './DealColumn';
import { Deal } from '../../types';

export interface Stage {
  id: NonNullable<Deal['stage']>;
  label: string;
  color: 'blue' | 'yellow' | 'purple' | 'green' | 'red';
}

export default function DealsPage() {
  const { deals, isLoading, updateStage } = useDeals();

  const stages: Stage[] = [
    { id: 'application_processing', label: 'Application Processing', color: 'blue' },
    { id: 'verification_needed', label: 'Verification Needed', color: 'yellow' },
    { id: 'activation_needed', label: 'Activation Needed', color: 'purple' },
    { id: 'completed', label: 'Completed', color: 'green' },
    { id: 'unsuccessful', label: 'Unsuccessful', color: 'red' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Deals Pipeline</h2>
          <p className="text-gray-600 text-sm mt-1">{deals.length} active deals</p>
        </div>
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow overflow-x-auto">
        <div className="flex space-x-4 pb-4 h-full">
          {stages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage === stage.id);
            return (
              <DealColumn
                key={stage.id}
                stage={stage}
                deals={stageDeals}
                onUpdateStage={updateStage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
