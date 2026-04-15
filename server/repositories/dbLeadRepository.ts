import type { LeadRepository } from './leadRepository.js';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '../types.js';
import prisma from '../db.js';

export class DbLeadRepository implements LeadRepository {
  async findAll(): Promise<Lead[]> {
    const rows = await prisma.lead.findMany({ orderBy: { updatedAt: 'desc' } });
    return rows.map(toLead);
  }

  async findById(id: string): Promise<Lead | null> {
    const row = await prisma.lead.findUnique({ where: { id } });
    return row ? toLead(row) : null;
  }

  async search(query: string): Promise<Lead[]> {
    const rows = await prisma.lead.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return rows.map(toLead);
  }

  async create(dto: CreateLeadDto): Promise<Lead> {
    const now = new Date().toISOString().split('T')[0];
    const row = await prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email ?? '',
        source: dto.source ?? '',
        stage: dto.stage ?? 'New',
        interest: dto.interest ?? 'Life',
        notes: dto.notes ?? '',
        createdAt: now,
        updatedAt: now,
      },
    });
    return toLead(row);
  }

  async update(id: string, dto: UpdateLeadDto): Promise<Lead | null> {
    try {
      const data: any = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined));
      data.updatedAt = new Date().toISOString().split('T')[0];
      const row = await prisma.lead.update({ where: { id }, data });
      return toLead(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.lead.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

function toLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    source: row.source,
    stage: row.stage,
    interest: row.interest,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    convertedToClientId: row.convertedToClientId ?? undefined,
  };
}
