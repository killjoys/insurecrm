import type { Task, CreateTaskDto, UpdateTaskDto } from '../types.js';

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(dto: CreateTaskDto): Promise<Task>;
  update(id: string, dto: UpdateTaskDto): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
