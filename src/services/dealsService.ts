import { createCrudService } from './baseService';
import { Deal, Database } from '../types';

type DealInsert = Database['public']['Tables']['deals']['Insert'];
type DealUpdate = Database['public']['Tables']['deals']['Update'];

// Create the base service
const baseDealsService = createCrudService<Deal, DealInsert, DealUpdate>(
  'deals'
);

// Extend the base service with custom methods
export const dealsService = {
  ...baseDealsService,
  updateStage: async (id: string, newStage: Deal['stage']): Promise<Deal> => {
    return baseDealsService.update(id, { stage: newStage });
  },
};
