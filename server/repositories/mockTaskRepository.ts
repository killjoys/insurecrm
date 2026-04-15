import type { TaskRepository } from './taskRepository.js';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types.js';

const seedTasks: Task[] = [
  { id: 'task1', title: 'โทรติดตาม ลีดคุณกิตติ', description: 'ติดต่อลีดใหม่ สนใจประกันชีวิตสะสมทรัพย์', dueDate: '2026-02-10', completed: false, relatedClientName: 'กิตติ สุขสันต์' },
  { id: 'task2', title: 'ส่งใบเสนอราคาให้คุณรัตนา', description: 'ส่งใบเสนอราคา MTL D Health ทาง Line', dueDate: '2026-02-10', completed: false, relatedClientName: 'รัตนา ดวงแก้ว' },
  { id: 'task3', title: 'ติดตามเอกสารเคลม คุณสุภาพร', description: 'ตรวจสอบเอกสารเคลม OPD ส่งให้ AIA', dueDate: '2026-02-10', completed: true, relatedClientId: 'c2', relatedClientName: 'สุภาพร จันทร์ศรี' },
  { id: 'task4', title: 'ติดตามการ reinstate กรมธรรม์คุณอรุณ', description: 'ส่งเอกสาร reinstate ให้ไทยประกันชีวิต', dueDate: '2026-02-10', completed: false, relatedClientId: 'c6', relatedClientName: 'อรุณ พิมพ์ทอง' },
  { id: 'task5', title: 'เตรียมเอกสารต่ออายุ ชุดเดือน มี.ค.', description: 'รวบรวมกรมธรรม์ที่ต้องต่ออายุในเดือนมีนาคม', dueDate: '2026-02-11', completed: false },
];

export class MockTaskRepository implements TaskRepository {
  private tasks: Task[] = [...seedTasks];
  private nextId = 100;

  async findAll(): Promise<Task[]> { return [...this.tasks]; }
  async findById(id: string): Promise<Task | null> { return this.tasks.find((t) => t.id === id) ?? null; }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task: Task = {
      id: `task${this.nextId++}`,
      title: dto.title,
      description: dto.description ?? '',
      dueDate: dto.dueDate,
      completed: dto.completed ?? false,
      relatedClientId: dto.relatedClientId,
      relatedClientName: dto.relatedClientName,
    };
    this.tasks.push(task);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task | null> {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updated: Task = { ...this.tasks[idx], ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)) };
    this.tasks[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}
