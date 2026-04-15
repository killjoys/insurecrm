import type { ClientRepository } from './clientRepository.js';
import type { Client, CreateClientDto, UpdateClientDto } from '../types.js';

// ─── Seed data (same as frontend) ───────────────────────────────────

const seedClients: Client[] = [
  {
    id: 'c1',
    name: 'สมชาย วงศ์สว่าง',
    phone: '081-234-5678',
    email: 'somchai.w@gmail.com',
    idCard: '1-1001-12345-67-8',
    dateOfBirth: '1978-05-12',
    address: '123/4 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    tier: 'VIP',
    createdAt: '2023-01-15',
    notes: 'ลูกค้าระยะยาว มีกรมธรรม์หลายฉบับ',
  },
  {
    id: 'c2',
    name: 'สุภาพร จันทร์ศรี',
    phone: '089-876-5432',
    email: 'supaporn.c@hotmail.com',
    idCard: '1-1002-54321-98-7',
    dateOfBirth: '1985-11-22',
    address: '456 ซ.ลาดพร้าว 71 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230',
    tier: 'VIP',
    createdAt: '2023-03-20',
    notes: 'สนใจประกันสุขภาพและประกันชีวิต',
  },
  {
    id: 'c3',
    name: 'ประเสริฐ แก้วมณี',
    phone: '062-345-6789',
    email: 'prasert.k@yahoo.com',
    idCard: '3-3401-67890-12-3',
    dateOfBirth: '1990-03-08',
    address: '789 ม.5 ต.บางพลี อ.บางพลี จ.สมุทรปราการ 10540',
    tier: 'Standard',
    createdAt: '2024-01-10',
    notes: 'เพิ่งเริ่มซื้อประกัน',
  },
  {
    id: 'c4',
    name: 'นภา ศรีสุข',
    phone: '095-111-2233',
    email: 'napa.s@gmail.com',
    idCard: '1-1003-11122-33-4',
    dateOfBirth: '1982-07-30',
    address: '321 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    tier: 'VIP',
    createdAt: '2022-08-05',
    notes: 'ผู้บริหารบริษัท ต้องการแผนประกันครอบครัว',
  },
  {
    id: 'c5',
    name: 'วิชัย ธรรมชาติ',
    phone: '083-444-5566',
    email: 'wichai.t@outlook.com',
    idCard: '1-1004-44455-66-7',
    dateOfBirth: '1995-12-01',
    address: '55/2 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900',
    tier: 'Standard',
    createdAt: '2024-06-15',
    notes: 'คนรุ่นใหม่ สนใจ Unit-Linked',
  },
  {
    id: 'c6',
    name: 'อรุณ พิมพ์ทอง',
    phone: '086-777-8899',
    email: 'arun.p@gmail.com',
    idCard: '1-1005-77788-99-0',
    dateOfBirth: '1970-02-14',
    address: '88 ซ.อารีย์สัมพันธ์ แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400',
    tier: 'VIP',
    createdAt: '2021-05-20',
    notes: 'ลูกค้าอาวุโส มีกรมธรรม์ชีวิตหลายฉบับ ใกล้ครบกำหนด',
  },
  {
    id: 'c7',
    name: 'ธนพล เจริญกิจ',
    phone: '091-222-3344',
    email: 'thanapol.c@gmail.com',
    idCard: '1-1006-22233-44-5',
    dateOfBirth: '1988-09-18',
    address: '199 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
    tier: 'Standard',
    createdAt: '2024-09-01',
    notes: 'เจ้าของธุรกิจ SME',
  },
  {
    id: 'c8',
    name: 'พิมลรัตน์ สุขสมบูรณ์',
    phone: '064-555-6677',
    email: 'pimonrat.s@gmail.com',
    idCard: '1-1007-55566-77-8',
    dateOfBirth: '1992-04-25',
    address: '77/3 ม.4 ต.บางกะปิ อ.บางกะปิ กรุงเทพฯ 10240',
    tier: 'Standard',
    createdAt: '2025-01-10',
    notes: 'ลูกค้าใหม่ แนะนำโดยคุณสมชาย',
  },
];

/**
 * In-memory mock implementation for local development.
 * Data is seeded on instantiation and lives for the lifetime of the process.
 */
export class MockClientRepository implements ClientRepository {
  private clients: Client[] = [...seedClients];
  private nextId = 100;

  async findAll(): Promise<Client[]> {
    return [...this.clients];
  }

  async findById(id: string): Promise<Client | null> {
    return this.clients.find((c) => c.id === id) ?? null;
  }

  async search(query: string): Promise<Client[]> {
    const q = query.toLowerCase();
    return this.clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }

  async create(dto: CreateClientDto): Promise<Client> {
    const client: Client = {
      id: `c${this.nextId++}`,
      name: dto.name,
      phone: dto.phone,
      email: dto.email ?? '',
      idCard: dto.idCard ?? '',
      dateOfBirth: dto.dateOfBirth ?? '',
      address: dto.address ?? '',
      tier: dto.tier ?? 'Standard',
      createdAt: new Date().toISOString().split('T')[0],
      notes: dto.notes ?? '',
    };
    this.clients.push(client);
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client | null> {
    const idx = this.clients.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const existing = this.clients[idx];
    const updated: Client = {
      ...existing,
      ...Object.fromEntries(
        Object.entries(dto).filter(([, v]) => v !== undefined),
      ),
    };
    this.clients[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.clients.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.clients.splice(idx, 1);
    return true;
  }
}
