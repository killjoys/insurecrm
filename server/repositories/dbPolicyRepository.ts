import type { PolicyRepository } from './policyRepository.js';
import type { Policy, CreatePolicyDto, UpdatePolicyDto } from '../types.js';
import prisma from '../db.js';

export class DbPolicyRepository implements PolicyRepository {
  async findAll(): Promise<Policy[]> {
    const rows = await prisma.policy.findMany({ orderBy: { renewalDate: 'asc' } });
    return rows.map(toPolicy);
  }

  async findById(id: string): Promise<Policy | null> {
    const row = await prisma.policy.findUnique({ where: { id } });
    return row ? toPolicy(row) : null;
  }

  async findByClientId(clientId: string): Promise<Policy[]> {
    const rows = await prisma.policy.findMany({ where: { clientId } });
    return rows.map(toPolicy);
  }

  async search(query: string): Promise<Policy[]> {
    const rows = await prisma.policy.findMany({
      where: {
        OR: [
          { clientName: { contains: query, mode: 'insensitive' } },
          { policyNumber: { contains: query, mode: 'insensitive' } },
          { planName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return rows.map(toPolicy);
  }

  async create(dto: CreatePolicyDto): Promise<Policy> {
    const row = await prisma.policy.create({
      data: {
        clientId: dto.clientId,
        clientName: dto.clientName,
        policyNumber: dto.policyNumber,
        category: dto.category as any,
        lifeSubtype: dto.lifeSubtype ?? null,
        provider: dto.provider,
        planName: dto.planName,
        premium: dto.premium,
        premiumFrequency: dto.premiumFrequency,
        sumInsured: dto.sumInsured,
        status: dto.status ?? 'Pending',
        effectiveDate: dto.effectiveDate,
        renewalDate: dto.renewalDate,
        maturityDate: dto.maturityDate ?? null,
        notes: dto.notes ?? '',
      },
    });
    return toPolicy(row);
  }

  async update(id: string, dto: UpdatePolicyDto): Promise<Policy | null> {
    try {
      const row = await prisma.policy.update({
        where: { id },
        data: Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
      });
      return toPolicy(row);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.policy.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

function toPolicy(row: any): Policy {
  return {
    id: row.id,
    clientId: row.clientId,
    clientName: row.clientName,
    policyNumber: row.policyNumber,
    category: row.category,
    lifeSubtype: row.lifeSubtype ?? undefined,
    provider: row.provider,
    planName: row.planName,
    premium: row.premium,
    premiumFrequency: row.premiumFrequency,
    sumInsured: row.sumInsured,
    status: row.status,
    effectiveDate: row.effectiveDate,
    renewalDate: row.renewalDate,
    maturityDate: row.maturityDate ?? undefined,
    notes: row.notes,
  };
}
