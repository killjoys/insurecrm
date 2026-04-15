import type { TaskRepository } from './taskRepository.js';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types.js';

/** Database-backed stub. Replace method bodies with real queries. */
export class DbTaskRepository implements TaskRepository {
  async findAll(): Promise<Task[]> { throw new Error('DbTaskRepository.findAll() not implemented'); }
  async findById(_id: string): Promise<Task | null> { throw new Error('DbTaskRepository.findById() not implemented'); }
  async create(_dto: CreateTaskDto): Promise<Task> { throw new Error('DbTaskRepository.create() not implemented'); }
  async update(_id: string, _dto: UpdateTaskDto): Promise<Task | null> { throw new Error('DbTaskRepository.update() not implemented'); }
  async delete(_id: string): Promise<boolean> { throw new Error('DbTaskRepository.delete() not implemented'); }
}
