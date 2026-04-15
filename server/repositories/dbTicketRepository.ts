import type { TicketRepository } from './ticketRepository.js';
import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../types.js';

/** Database-backed stub. Replace method bodies with real queries. */
export class DbTicketRepository implements TicketRepository {
  async findAll(): Promise<Ticket[]> { throw new Error('DbTicketRepository.findAll() not implemented'); }
  async findById(_id: string): Promise<Ticket | null> { throw new Error('DbTicketRepository.findById() not implemented'); }
  async search(_query: string): Promise<Ticket[]> { throw new Error('DbTicketRepository.search() not implemented'); }
  async create(_dto: CreateTicketDto): Promise<Ticket> { throw new Error('DbTicketRepository.create() not implemented'); }
  async update(_id: string, _dto: UpdateTicketDto): Promise<Ticket | null> { throw new Error('DbTicketRepository.update() not implemented'); }
  async delete(_id: string): Promise<boolean> { throw new Error('DbTicketRepository.delete() not implemented'); }
}
