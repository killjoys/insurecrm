import type { ClientRepository } from './clientRepository.js';
import type { Client, CreateClientDto, UpdateClientDto } from '../types.js';
import prisma from '../db.js';

export class DbClientRepository implements ClientRepository {
  async findAll(): Promise<Client[]> {
    const rows = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map(toClient);
  }

  async findById(id: string): Promise<Client | null> {
    const row = await prisma.client.findUnique({ where: { id } });
    return row ? toClient(row) : null;
  }

  async search(query: string): Promise<Client[]> {
    const rows = await prisma.client.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return rows.map(toClient);
  }

  async create(dto: CreateClientDto): Promise<Client> {
    const row = await prisma.client.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email ?? '',
        idCard: dto.idCard ?? '',
        dateOfBirth: dto.dateOfBirth ?? '',
        address: dto.address ?? '',
        tier: dto.tier ?? 'Standard',
        createdAt: new Date().toISOString().split('T')[0],
        notes: dto.notes ?? '',
      },
    });
    return toClient(row);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client | null> {
    try {
      const row = await prisma.client.update({
        where: { id },
        data: Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
      });
      return toClient(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.client.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

function toClient(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    idCard: row.idCard,
    dateOfBirth: row.dateOfBirth,
    address: row.address,
    tier: row.tier,
    createdAt: row.createdAt,
    notes: row.notes,
  };
}
