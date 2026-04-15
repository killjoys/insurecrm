import type { Client } from '../types';
import { createCrudApi } from './api';

type CreateClient = Omit<Client, 'id' | 'createdAt'>;
type UpdateClient = Partial<CreateClient>;

export const clientsApi = createCrudApi<Client, CreateClient, UpdateClient>('clients');

// Re-export individual functions for backward compatibility
export const fetchClients = clientsApi.fetchAll;
export const fetchClient = clientsApi.fetchById;
export const createClient = clientsApi.create;
export const updateClient = clientsApi.update;
export const deleteClient = clientsApi.remove;
