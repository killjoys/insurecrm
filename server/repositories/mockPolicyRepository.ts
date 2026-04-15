import type { PolicyRepository } from './policyRepository.js';
import type { Policy, CreatePolicyDto, UpdatePolicyDto } from '../types.js';

const seedPolicies: Policy[] = [
  { id: 'p1', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'AIA-WL-2023-001', category: 'Life', lifeSubtype: 'Whole Life', provider: 'AIA', planName: 'AIA Whole Life Plus', premium: 45000, premiumFrequency: 'Annual', sumInsured: 3000000, status: 'Inforced', effectiveDate: '2023-02-01', renewalDate: '2026-02-01', maturityDate: '2043-02-01', notes: 'แผนคุ้มครองตลอดชีวิต' },
  { id: 'p2', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'TLI-EN-2023-015', category: 'Life', lifeSubtype: 'Endowment', provider: 'ไทยประกันชีวิต', planName: 'ไทยประกัน สะสมทรัพย์ 20/10', premium: 8500, premiumFrequency: 'Monthly', sumInsured: 1000000, status: 'Inforced', effectiveDate: '2023-06-15', renewalDate: '2026-06-15', maturityDate: '2033-06-15', notes: 'ออมทรัพย์ 20 ปี จ่าย 10 ปี' },
  { id: 'p3', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', policyNumber: 'MTL-UL-2024-042', category: 'Life', lifeSubtype: 'Unit-Linked', provider: 'เมืองไทยประกันชีวิต', planName: 'MTL Unit-Linked Growth', premium: 5000, premiumFrequency: 'Monthly', sumInsured: 2000000, status: 'Inforced', effectiveDate: '2024-01-01', renewalDate: '2026-01-01', maturityDate: '2044-01-01', notes: 'ลงทุนผ่านกองทุนรวม' },
  { id: 'p4', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'FWD-TM-2024-088', category: 'Life', lifeSubtype: 'Term', provider: 'FWD', planName: 'FWD Term Life 20', premium: 12000, premiumFrequency: 'Semi-Annual', sumInsured: 5000000, status: 'Inforced', effectiveDate: '2024-03-01', renewalDate: '2026-03-01', maturityDate: '2044-03-01', notes: 'คุ้มครองระยะ 20 ปี สำหรับหัวหน้าครอบครัว' },
  { id: 'p5', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', policyNumber: 'AIA-AN-2020-005', category: 'Life', lifeSubtype: 'Annuity', provider: 'AIA', planName: 'AIA Retirement Plus', premium: 30000, premiumFrequency: 'Quarterly', sumInsured: 4000000, status: 'Inforced', effectiveDate: '2020-05-01', renewalDate: '2026-05-01', maturityDate: '2035-05-01', notes: 'แผนเกษียณอายุ' },
  { id: 'p6', clientId: 'c5', clientName: 'วิชัย ธรรมชาติ', policyNumber: 'KTL-UNI-2025-003', category: 'Life', lifeSubtype: 'Universal Life', provider: 'กรุงไทย-แอกซ่า', planName: 'Universal Life Flexi', premium: 3500, premiumFrequency: 'Monthly', sumInsured: 1500000, status: 'Pending', effectiveDate: '2025-02-01', renewalDate: '2026-02-01', maturityDate: '2055-02-01', notes: 'กรมธรรม์ใหม่ รอพิจารณา' },
  { id: 'p7', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'BLA-HL-2024-120', category: 'Health', provider: 'กรุงเทพประกันชีวิต', planName: 'BLA Health Prestige', premium: 35000, premiumFrequency: 'Annual', sumInsured: 5000000, status: 'Inforced', effectiveDate: '2024-04-01', renewalDate: '2026-04-01', notes: 'แผนสุขภาพ IPD+OPD' },
  { id: 'p8', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', policyNumber: 'AIA-HL-2024-078', category: 'Health', provider: 'AIA', planName: 'AIA Health Happy', premium: 22000, premiumFrequency: 'Annual', sumInsured: 3000000, status: 'Inforced', effectiveDate: '2024-07-01', renewalDate: '2026-07-01', notes: 'สุขภาพ ค่าห้อง 4,000/วัน' },
  { id: 'p9', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'MTL-HL-2023-200', category: 'Health', provider: 'เมืองไทยประกันชีวิต', planName: 'MTL D Health', premium: 55000, premiumFrequency: 'Annual', sumInsured: 10000000, status: 'Inforced', effectiveDate: '2023-09-01', renewalDate: '2026-02-20', notes: 'แผน D Health เหมาจ่าย 10 ล้าน' },
  { id: 'p10', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', policyNumber: 'TIP-PA-2024-055', category: 'PA', provider: 'ทิพยประกันภัย', planName: 'PA Plus 500', premium: 5500, premiumFrequency: 'Annual', sumInsured: 500000, status: 'Inforced', effectiveDate: '2024-02-15', renewalDate: '2026-02-15', notes: 'อุบัติเหตุส่วนบุคคล' },
  { id: 'p11', clientId: 'c7', clientName: 'ธนพล เจริญกิจ', policyNumber: 'VIB-PA-2025-011', category: 'PA', provider: 'วิริยะประกันภัย', planName: 'Viriyah PA Gold', premium: 8000, premiumFrequency: 'Annual', sumInsured: 1000000, status: 'Inforced', effectiveDate: '2025-01-01', renewalDate: '2026-01-01', notes: 'PA สำหรับเจ้าของธุรกิจ' },
  { id: 'p12', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'VIB-MT-2025-234', category: 'Motor', provider: 'วิริยะประกันภัย', planName: 'ประกันรถยนต์ ชั้น 1', premium: 18000, premiumFrequency: 'Annual', sumInsured: 800000, status: 'Inforced', effectiveDate: '2025-01-15', renewalDate: '2026-03-05', notes: 'Toyota Camry 2023 สีขาว' },
  { id: 'p13', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', policyNumber: 'BKI-MT-2024-567', category: 'Motor', provider: 'กรุงเทพประกันภัย', planName: 'ประกันรถยนต์ ชั้น 2+', premium: 9500, premiumFrequency: 'Annual', sumInsured: 300000, status: 'Inforced', effectiveDate: '2024-08-01', renewalDate: '2026-02-25', notes: 'Honda City 2022' },
  { id: 'p14', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'TIP-FR-2024-089', category: 'Fire', provider: 'ทิพยประกันภัย', planName: 'ประกันอัคคีภัย บ้าน', premium: 4500, premiumFrequency: 'Annual', sumInsured: 5000000, status: 'Inforced', effectiveDate: '2024-06-01', renewalDate: '2026-06-01', notes: 'ประกันอัคคีภัยบ้านพักอาศัย' },
  { id: 'p15', clientId: 'c7', clientName: 'ธนพล เจริญกิจ', policyNumber: 'MSI-FR-2024-445', category: 'Fire', provider: 'มิตซุยสุมิโตโม', planName: 'Fire & Allied Perils SME', premium: 15000, premiumFrequency: 'Annual', sumInsured: 20000000, status: 'Inforced', effectiveDate: '2024-10-01', renewalDate: '2026-02-18', notes: 'ประกันอัคคีภัยอาคารสำนักงาน' },
  { id: 'p16', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', policyNumber: 'TLI-WL-2018-200', category: 'Life', lifeSubtype: 'Whole Life', provider: 'ไทยประกันชีวิต', planName: 'ไทยประกัน ตลอดชีวิต', premium: 25000, premiumFrequency: 'Annual', sumInsured: 2000000, status: 'Lapsed', effectiveDate: '2018-01-01', renewalDate: '2025-01-01', maturityDate: '2038-01-01', notes: 'ขาดชำระเบี้ย ติดต่อลูกค้าเพื่อ reinstate' },
  { id: 'p17', clientId: 'c8', clientName: 'พิมลรัตน์ สุขสมบูรณ์', policyNumber: 'FWD-HL-2025-099', category: 'Health', provider: 'FWD', planName: 'FWD Health First', premium: 18000, premiumFrequency: 'Annual', sumInsured: 2000000, status: 'Pending', effectiveDate: '2025-02-01', renewalDate: '2026-02-01', notes: 'กรมธรรม์ใหม่ รอ underwriting' },
];

export class MockPolicyRepository implements PolicyRepository {
  private policies: Policy[] = [...seedPolicies];
  private nextId = 100;

  async findAll(): Promise<Policy[]> { return [...this.policies]; }
  async findById(id: string): Promise<Policy | null> { return this.policies.find((p) => p.id === id) ?? null; }
  async findByClientId(clientId: string): Promise<Policy[]> { return this.policies.filter((p) => p.clientId === clientId); }

  async search(query: string): Promise<Policy[]> {
    const q = query.toLowerCase();
    return this.policies.filter(
      (p) => p.clientName.toLowerCase().includes(q) || p.policyNumber.toLowerCase().includes(q) || p.planName.toLowerCase().includes(q),
    );
  }

  async create(dto: CreatePolicyDto): Promise<Policy> {
    const policy: Policy = {
      id: `p${this.nextId++}`,
      clientId: dto.clientId,
      clientName: dto.clientName,
      policyNumber: dto.policyNumber,
      category: dto.category,
      lifeSubtype: dto.lifeSubtype,
      provider: dto.provider,
      planName: dto.planName,
      premium: dto.premium,
      premiumFrequency: dto.premiumFrequency,
      sumInsured: dto.sumInsured,
      status: dto.status ?? 'Pending',
      effectiveDate: dto.effectiveDate,
      renewalDate: dto.renewalDate,
      maturityDate: dto.maturityDate,
      notes: dto.notes ?? '',
    };
    this.policies.push(policy);
    return policy;
  }

  async update(id: string, dto: UpdatePolicyDto): Promise<Policy | null> {
    const idx = this.policies.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated: Policy = { ...this.policies[idx], ...Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined)) };
    this.policies[idx] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.policies.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.policies.splice(idx, 1);
    return true;
  }
}
