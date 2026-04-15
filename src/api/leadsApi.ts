import type { Lead } from '../types';
import { createCrudApi } from './api';

type CreateLead = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateLead = Partial<CreateLead>;

export const leadsApi = createCrudApi<Lead, CreateLead, UpdateLead>('leads');
