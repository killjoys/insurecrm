import type { Policy } from '../types';
import { createCrudApi } from './api';

type CreatePolicy = Omit<Policy, 'id'>;
type UpdatePolicy = Partial<CreatePolicy>;

export const policiesApi = createCrudApi<Policy, CreatePolicy, UpdatePolicy>('policies');
