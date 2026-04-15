import type { Ticket } from '../types';
import { createCrudApi } from './api';

type CreateTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateTicket = Partial<CreateTicket>;

export const ticketsApi = createCrudApi<Ticket, CreateTicket, UpdateTicket>('tickets');
