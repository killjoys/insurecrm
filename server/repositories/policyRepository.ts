import type { Policy, CreatePolicyDto, UpdatePolicyDto } from '../types.js';

export interface PolicyRepository {
  findAll(): Promise<Policy[]>;
  findById(id: string): Promise<Policy | null>;
  findByClientId(clientId: string): Promise<Policy[]>;
  search(query: string): Promise<Policy[]>;
  create(dto: CreatePolicyDto): Promise<Policy>;
  update(id: string, dto: UpdatePolicyDto): Promise<Policy | null>;
  delete(id: string): Promise<boolean>;
}
