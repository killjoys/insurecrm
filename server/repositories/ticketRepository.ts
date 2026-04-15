import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../types.js';

export interface TicketRepository {
  findAll(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  search(query: string): Promise<Ticket[]>;
  create(dto: CreateTicketDto): Promise<Ticket>;
  update(id: string, dto: UpdateTicketDto): Promise<Ticket | null>;
  delete(id: string): Promise<boolean>;
}
