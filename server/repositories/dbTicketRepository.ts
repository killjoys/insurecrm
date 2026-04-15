import type { TicketRepository } from './ticketRepository.js';
import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../types.js';
import prisma from '../db.js';

export class DbTicketRepository implements TicketRepository {
  async findAll(): Promise<Ticket[]> {
    const rows = await prisma.ticket.findMany({ orderBy: { updatedAt: 'desc' } });
    return rows.map(toTicket);
  }

  async findById(id: string): Promise<Ticket | null> {
    const row = await prisma.ticket.findUnique({ where: { id } });
    return row ? toTicket(row) : null;
  }

  async search(query: string): Promise<Ticket[]> {
    const rows = await prisma.ticket.findMany({
      where: {
        OR: [
          { subject: { contains: query, mode: 'insensitive' } },
          { clientName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return rows.map(toTicket);
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const now = new Date().toISOString().split('T')[0];
    const row = await prisma.ticket.create({
      data: {
        clientId: dto.clientId,
        clientName: dto.clientName,
        subject: dto.subject,
        description: dto.description ?? '',
        priority: dto.priority ?? 'Medium',
        status: dto.status ?? 'Open',
        createdAt: now,
        updatedAt: now,
      },
    });
    return toTicket(row);
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket | null> {
    try {
      const data: any = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined));
      data.updatedAt = new Date().toISOString().split('T')[0];
      const row = await prisma.ticket.update({ where: { id }, data });
      return toTicket(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.ticket.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

function toTicket(row: any): Ticket {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.clientName,
    subject: row.subject,
    description: row.description,
    priority: row.priority,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
