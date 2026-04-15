import type { TicketRepository } from './ticketRepository.js';
import type { Ticket, CreateTicketDto, UpdateTicketDto } from '../types.js';

const seedTickets: Ticket[] = [
  { id: 't1', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', subject: 'ขอเปลี่ยนผู้รับประโยชน์', description: 'ต้องการเปลี่ยนผู้รับประโยชน์กรมธรรม์ AIA-WL-2023-001', priority: 'Medium', status: 'Open', createdAt: '2026-02-08', updatedAt: '2026-02-08' },
  { id: 't2', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', subject: 'สอบถามสิทธิ์เคลม', description: 'ต้องการเคลม OPD จาก AIA Health Happy ไม่แน่ใจเรื่องเอกสาร', priority: 'High', status: 'In Progress', createdAt: '2026-02-06', updatedAt: '2026-02-09' },
  { id: 't3', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', subject: 'ต้องการ reinstate กรมธรรม์', description: 'กรมธรรม์ TLI-WL-2018-200 ขาดอายุ ลูกค้าต้องการกลับมาจ่ายเบี้ย', priority: 'Urgent', status: 'Open', createdAt: '2026-02-07', updatedAt: '2026-02-07' },
  { id: 't4', clientId: 'c4', clientName: 'นภา ศรีสุข', subject: 'ขอใบรับรองชำระเบี้ยประกัน', description: 'ต้องการใบรับรองสำหรับลดหย่อนภาษี ปี 2025', priority: 'Low', status: 'Resolved', createdAt: '2026-01-20', updatedAt: '2026-02-01' },
  { id: 't5', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', subject: 'แจ้งเคลมอุบัติเหตุ', description: 'เกิดอุบัติเหตุเล็กน้อย ต้องการเคลม PA TIP-PA-2024-055', priority: 'High', status: 'Open', createdAt: '2026-02-09', updatedAt: '2026-02-09' },
];

export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [...seedTickets];
  private nextId = 100;

  async findAll(): Promise<Ticket[]> { return [...this.tickets]; }
  async findById(id: string): Promise<Ticket | null> { return this.tickets.find((t) => t.id === id) ?? null; }

  async search(query: string): Promise<Ticket[]> {
    const q = query.toLowerCase();
    return this.tickets.filter(
      (t) => t.subject.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q),
    );
  }

  async create(dto: CreateTicketDto): Promise<Ticket> {
    const now = new Date().toISOString().split('T')[0];
    const ticket: Ticket = {
      id: `t${this.nextId++}`,
      clientId: dto.clientId,
      clientName: dto.clientName,
      subject: dto.subject,
      description: dto.description ?? '',
      priority: dto.priority ?? 'Medium',
      status: dto.status ?? 'Open',
      createdAt: now,
      updatedAt: now,
    };
    this.tickets.push(ticket);
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<Ticket | null> {
    const idx = this.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString().split('T')[0];
    const updated: Ticket = { ...this.tickets[idx], ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)), updatedAt: now };
    this.tickets[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tickets.splice(idx, 1);
    return true;
  }
}
