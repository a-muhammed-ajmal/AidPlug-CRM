import { createCrudService } from './baseService';
import { Lead, Database } from '../types';

type LeadInsert = Database['public']['Tables']['leads']['Insert'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export const leadsService = createCrudService<Lead, LeadInsert, LeadUpdate>(
  'leads'
);
