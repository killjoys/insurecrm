import type { ClientRepository } from './clientRepository.js';
import type { Client, CreateClientDto, UpdateClientDto } from '../types.js';

/**
 * Database-backed implementation of ClientRepository.
 *
 * This is a stub — replace the body of each method with real DB queries
 * (e.g. using knex, prisma, typeorm, or raw pg/mysql2) when you're ready
 * to connect to a real database.
 *
 * Example with a hypothetical `db` query builder:
 *
 *   async findAll() {
 *     return db('clients').select('*').orderBy('created_at', 'desc');
 *   }
 */
export class DbClientRepository implements ClientRepository {
  // constructor(private readonly db: any) {}
  // Pass your DB connection/pool/ORM instance via the constructor.

  async findAll(): Promise<Client[]> {
    // TODO: Replace with real query
    // return this.db('clients').select('*').orderBy('created_at', 'desc');
    throw new Error(
      'DbClientRepository.findAll() is not implemented. ' +
      'Connect a real database and replace this stub.',
    );
  }

  async findById(id: string): Promise<Client | null> {
    // TODO: Replace with real query
    // return this.db('clients').where({ id }).first() ?? null;
    throw new Error(
      `DbClientRepository.findById(${id}) is not implemented.`,
    );
  }

  async search(query: string): Promise<Client[]> {
    // TODO: Replace with real query
    // return this.db('clients')
    //   .where('name', 'ilike', `%${query}%`)
    //   .orWhere('phone', 'like', `%${query}%`)
    //   .orWhere('email', 'ilike', `%${query}%`);
    throw new Error(
      `DbClientRepository.search(${query}) is not implemented.`,
    );
  }

  async create(_dto: CreateClientDto): Promise<Client> {
    // TODO: Replace with real query
    // const [client] = await this.db('clients').insert({ ...dto }).returning('*');
    // return client;
    throw new Error(
      'DbClientRepository.create() is not implemented.',
    );
  }

  async update(id: string, _dto: UpdateClientDto): Promise<Client | null> {
    // TODO: Replace with real query
    // const [client] = await this.db('clients').where({ id }).update({ ...dto }).returning('*');
    // return client ?? null;
    throw new Error(
      `DbClientRepository.update(${id}) is not implemented.`,
    );
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Replace with real query
    // const count = await this.db('clients').where({ id }).del();
    // return count > 0;
    throw new Error(
      `DbClientRepository.delete(${id}) is not implemented.`,
    );
  }
}
