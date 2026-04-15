import type { TaskRepository } from './taskRepository.js';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types.js';
import prisma from '../db.js';

export class DbTaskRepository implements TaskRepository {
  async findAll(): Promise<Task[]> {
    const rows = await prisma.task.findMany({ orderBy: { dueDate: 'asc' } });
    return rows.map(toTask);
  }

  async findById(id: string): Promise<Task | null> {
    const row = await prisma.task.findUnique({ where: { id } });
    return row ? toTask(row) : null;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const row = await prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
        dueDate: dto.dueDate,
        completed: dto.completed ?? false,
        relatedClientId: dto.relatedClientId ?? null,
        relatedClientName: dto.relatedClientName ?? null,
      },
    });
    return toTask(row);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    try {
      const row = await prisma.task.update({
        where: { id },
        data: Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
      });
      return toTask(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

function toTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.dueDate,
    completed: row.completed,
    relatedClientId: row.relatedClientId ?? undefined,
    relatedClientName: row.relatedClientName ?? undefined,
  };
}
