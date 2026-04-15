import type { PolicyRepository } from './policyRepository.js';
import type { Policy, CreatePolicyDto, UpdatePolicyDto } from '../types.js';

/** Database-backed stub. Replace method bodies with real queries. */
export class DbPolicyRepository implements PolicyRepository {
  async findAll(): Promise<Policy[]> { throw new Error('DbPolicyRepository.findAll() not implemented'); }
  async findById(_id: string): Promise<Policy | null> { throw new Error('DbPolicyRepository.findById() not implemented'); }
  async findByClientId(_clientId: string): Promise<Policy[]> { throw new Error('DbPolicyRepository.findByClientId() not implemented'); }
  async search(_query: string): Promise<Policy[]> { throw new Error('DbPolicyRepository.search() not implemented'); }
  async create(_dto: CreatePolicyDto): Promise<Policy> { throw new Error('DbPolicyRepository.create() not implemented'); }
  async update(_id: string, _dto: UpdatePolicyDto): Promise<Policy | null> { throw new Error('DbPolicyRepository.update() not implemented'); }
  async delete(_id: string): Promise<boolean> { throw new Error('DbPolicyRepository.delete() not implemented'); }
}
