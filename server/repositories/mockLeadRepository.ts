import type { LeadRepository } from './leadRepository.js';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '../types.js';

const seedLeads: Lead[] = [
  { id: 'l1', name: 'กิตติ สุขสันต์', phone: '087-111-2233', email: 'kitti.s@gmail.com', source: 'Facebook', stage: 'New', interest: 'Life', notes: 'สนใจประกันชีวิตแบบสะสมทรัพย์', createdAt: '2026-02-08', updatedAt: '2026-02-08' },
  { id: 'l2', name: 'มานะ พงศ์พิพัฒน์', phone: '092-333-4455', email: 'mana.p@hotmail.com', source: 'Referral', stage: 'Contacted', interest: 'Motor', notes: 'เพื่อนของคุณสมชาย สนใจประกันรถยนต์ชั้น 1', createdAt: '2026-02-05', updatedAt: '2026-02-07' },
  { id: 'l3', name: 'รัตนา ดวงแก้ว', phone: '063-555-6677', email: 'rattana.d@yahoo.com', source: 'Walk-in', stage: 'Quoted', interest: 'Health', notes: 'ต้องการประกันสุขภาพเหมาจ่าย เสนอ MTL D Health', createdAt: '2026-01-28', updatedAt: '2026-02-06' },
  { id: 'l4', name: 'จิราภา ทองดี', phone: '085-777-8899', email: 'jirapa.t@gmail.com', source: 'Line OA', stage: 'Quoted', interest: 'Life', notes: 'สนใจ Whole Life + Health Rider', createdAt: '2026-01-20', updatedAt: '2026-02-04' },
  { id: 'l5', name: 'ศิริพร แสงทอง', phone: '098-222-3344', email: 'siriporn.s@gmail.com', source: 'Website', stage: 'Closed', interest: 'PA', notes: 'ปิดการขาย PA Plus แปลงเป็นลูกค้าแล้ว', createdAt: '2026-01-10', updatedAt: '2026-01-30', convertedToClientId: 'c8' },
  { id: 'l6', name: 'ชัยวัฒน์ ภูมิใจ', phone: '061-444-5566', email: 'chaiwat.p@outlook.com', source: 'Facebook', stage: 'New', interest: 'Fire', notes: 'สนใจประกันอัคคีภัยคอนโด', createdAt: '2026-02-09', updatedAt: '2026-02-09' },
  { id: 'l7', name: 'ปิยะ สมบัติ', phone: '084-666-7788', email: 'piya.s@gmail.com', source: 'Referral', stage: 'Contacted', interest: 'Health', notes: 'แนะนำจากคุณนภา สนใจประกันสุขภาพครอบครัว', createdAt: '2026-02-03', updatedAt: '2026-02-08' },
  { id: 'l8', name: 'อัญชลี ประสิทธิ์', phone: '097-888-9900', email: 'anchalee.p@gmail.com', source: 'Line OA', stage: 'New', interest: 'Life', notes: 'สอบถามเรื่อง Unit-Linked สำหรับการออม', createdAt: '2026-02-10', updatedAt: '2026-02-10' },
];

export class MockLeadRepository implements LeadRepository {
  private leads: Lead[] = [...seedLeads];
  private nextId = 100;

  async findAll(): Promise<Lead[]> { return [...this.leads]; }

  async findById(id: string): Promise<Lead | null> {
    return this.leads.find((l) => l.id === id) ?? null;
  }

  async search(query: string): Promise<Lead[]> {
    const q = query.toLowerCase();
    return this.leads.filter(
      (l) => l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.email.toLowerCase().includes(q),
    );
  }

  async create(dto: CreateLeadDto): Promise<Lead> {
    const now = new Date().toISOString().split('T')[0];
    const lead: Lead = {
      id: `l${this.nextId++}`,
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? '',
      source: dto.source ?? '',
      stage: dto.stage ?? 'New',
      interest: dto.interest ?? 'Life',
      notes: dto.notes ?? '',
      createdAt: now,
      updatedAt: now,
    };
    this.leads.push(lead);
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto): Promise<Lead | null> {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString().split('T')[0];
    const updated: Lead = {
      ...this.leads[idx],
      ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)),
      updatedAt: now,
    };
    this.leads[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.leads.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    this.leads.splice(idx, 1);
    return true;
  }
}
