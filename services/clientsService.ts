import { createCrudService } from './baseService';
import { Client, Database } from '../types';

// Define the specific types for this service
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// Create the service with a single function call
export const clientsService = createCrudService<Client, ClientInsert, ClientUpdate>('clients');