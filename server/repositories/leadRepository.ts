import type { Lead, CreateLeadDto, UpdateLeadDto } from '../types.js';

export interface LeadRepository {
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  search(query: string): Promise<Lead[]>;
  create(dto: CreateLeadDto): Promise<Lead>;
  update(id: string, dto: UpdateLeadDto): Promise<Lead | null>;
  delete(id: string): Promise<boolean>;
}
