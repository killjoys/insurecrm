import type { Client, CreateClientDto, UpdateClientDto } from '../types.js';

/**
 * Repository interface for Client data access.
 * Implementations can be swapped based on environment:
 *   - MockClientRepository  → local development (in-memory)
 *   - DbClientRepository    → production (real database)
 */
export interface ClientRepository {
  findAll(): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  search(query: string): Promise<Client[]>;
  create(dto: CreateClientDto): Promise<Client>;
  update(id: string, dto: UpdateClientDto): Promise<Client | null>;
  delete(id: string): Promise<boolean>;
}
