import type { LeadRepository } from './leadRepository.js';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '../types.js';

/** Database-backed stub. Replace method bodies with real queries. */
export class DbLeadRepository implements LeadRepository {
  async findAll(): Promise<Lead[]> { throw new Error('DbLeadRepository.findAll() not implemented'); }
  async findById(_id: string): Promise<Lead | null> { throw new Error('DbLeadRepository.findById() not implemented'); }
  async search(_query: string): Promise<Lead[]> { throw new Error('DbLeadRepository.search() not implemented'); }
  async create(_dto: CreateLeadDto): Promise<Lead> { throw new Error('DbLeadRepository.create() not implemented'); }
  async update(_id: string, _dto: UpdateLeadDto): Promise<Lead | null> { throw new Error('DbLeadRepository.update() not implemented'); }
  async delete(_id: string): Promise<boolean> { throw new Error('DbLeadRepository.delete() not implemented'); }
}
