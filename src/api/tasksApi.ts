import type { Task } from '../types';
import { createCrudApi } from './api';

type CreateTask = Omit<Task, 'id'>;
type UpdateTask = Partial<CreateTask>;

export const tasksApi = createCrudApi<Task, CreateTask, UpdateTask>('tasks');
