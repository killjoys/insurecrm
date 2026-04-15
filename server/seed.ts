import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (in reverse FK order)
  await prisma.task.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.client.deleteMany();

  // ─── Clients ────────────────────────────────────────────────
  const clients = [
    { id: 'c1', name: 'สมชาย วงศ์สว่าง', phone: '081-234-5678', email: 'somchai.w@gmail.com', idCard: '1-1001-12345-67-8', dateOfBirth: '1978-05-12', address: '123/4 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110', tier: 'VIP' as const, createdAt: '2023-01-15', notes: 'ลูกค้าระยะยาว มีกรมธรรม์หลายฉบับ' },
    { id: 'c2', name: 'สุภาพร จันทร์ศรี', phone: '089-876-5432', email: 'supaporn.c@hotmail.com', idCard: '1-1002-54321-98-7', dateOfBirth: '1985-11-22', address: '456 ซ.ลาดพร้าว 71 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230', tier: 'VIP' as const, createdAt: '2023-03-20', notes: 'สนใจประกันสุขภาพและประกันชีวิต' },
    { id: 'c3', name: 'ประเสริฐ แก้วมณี', phone: '062-345-6789', email: 'prasert.k@yahoo.com', idCard: '3-3401-67890-12-3', dateOfBirth: '1990-03-08', address: '789 ม.5 ต.บางพลี อ.บางพลี จ.สมุทรปราการ 10540', tier: 'Standard' as const, createdAt: '2024-01-10', notes: 'เพิ่งเริ่มซื้อประกัน' },
    { id: 'c4', name: 'นภา ศรีสุข', phone: '095-111-2233', email: 'napa.s@gmail.com', idCard: '1-1003-11122-33-4', dateOfBirth: '1982-07-30', address: '321 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400', tier: 'VIP' as const, createdAt: '2022-08-05', notes: 'ผู้บริหารบริษัท ต้องการแผนประกันครอบครัว' },
    { id: 'c5', name: 'วิชัย ธรรมชาติ', phone: '083-444-5566', email: 'wichai.t@outlook.com', idCard: '1-1004-44455-66-7', dateOfBirth: '1995-12-01', address: '55/2 ถ.พหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900', tier: 'Standard' as const, createdAt: '2024-06-15', notes: 'คนรุ่นใหม่ สนใจ Unit-Linked' },
    { id: 'c6', name: 'อรุณ พิมพ์ทอง', phone: '086-777-8899', email: 'arun.p@gmail.com', idCard: '1-1005-77788-99-0', dateOfBirth: '1970-02-14', address: '88 ซ.อารีย์สัมพันธ์ แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400', tier: 'VIP' as const, createdAt: '2021-05-20', notes: 'ลูกค้าอาวุโส มีกรมธรรม์ชีวิตหลายฉบับ ใกล้ครบกำหนด' },
    { id: 'c7', name: 'ธนพล เจริญกิจ', phone: '091-222-3344', email: 'thanapol.c@gmail.com', idCard: '1-1006-22233-44-5', dateOfBirth: '1988-09-18', address: '199 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500', tier: 'Standard' as const, createdAt: '2024-09-01', notes: 'เจ้าของธุรกิจ SME' },
    { id: 'c8', name: 'พิมลรัตน์ สุขสมบูรณ์', phone: '064-555-6677', email: 'pimonrat.s@gmail.com', idCard: '1-1007-55566-77-8', dateOfBirth: '1992-04-25', address: '77/3 ม.4 ต.บางกะปิ อ.บางกะปิ กรุงเทพฯ 10240', tier: 'Standard' as const, createdAt: '2025-01-10', notes: 'ลูกค้าใหม่ แนะนำโดยคุณสมชาย' },
  ];

  for (const c of clients) {
    await prisma.client.create({ data: c });
  }
  console.log(`  ✓ ${clients.length} clients`);

  // ─── Leads ──────────────────────────────────────────────────
  const leads = [
    { id: 'l1', name: 'กิตติ สุขสันต์', phone: '087-111-2233', email: 'kitti.s@gmail.com', source: 'Facebook', stage: 'New' as const, interest: 'Life' as const, notes: 'สนใจประกันชีวิตแบบสะสมทรัพย์', createdAt: '2026-02-08', updatedAt: '2026-02-08' },
    { id: 'l2', name: 'มานะ พงศ์พิพัฒน์', phone: '092-333-4455', email: 'mana.p@hotmail.com', source: 'Referral', stage: 'Contacted' as const, interest: 'Motor' as const, notes: 'เพื่อนของคุณสมชาย สนใจประกันรถยนต์ชั้น 1', createdAt: '2026-02-05', updatedAt: '2026-02-07' },
    { id: 'l3', name: 'รัตนา ดวงแก้ว', phone: '063-555-6677', email: 'rattana.d@yahoo.com', source: 'Walk-in', stage: 'Quoted' as const, interest: 'Health' as const, notes: 'ต้องการประกันสุขภาพเหมาจ่าย เสนอ MTL D Health', createdAt: '2026-01-28', updatedAt: '2026-02-06' },
    { id: 'l4', name: 'จิราภา ทองดี', phone: '085-777-8899', email: 'jirapa.t@gmail.com', source: 'Line OA', stage: 'Quoted' as const, interest: 'Life' as const, notes: 'สนใจ Whole Life + Health Rider', createdAt: '2026-01-20', updatedAt: '2026-02-04' },
    { id: 'l5', name: 'ศิริพร แสงทอง', phone: '098-222-3344', email: 'siriporn.s@gmail.com', source: 'Website', stage: 'Closed' as const, interest: 'PA' as const, notes: 'ปิดการขาย PA Plus แปลงเป็นลูกค้าแล้ว', createdAt: '2026-01-10', updatedAt: '2026-01-30', convertedToClientId: 'c8' },
    { id: 'l6', name: 'ชัยวัฒน์ ภูมิใจ', phone: '061-444-5566', email: 'chaiwat.p@outlook.com', source: 'Facebook', stage: 'New' as const, interest: 'Fire' as const, notes: 'สนใจประกันอัคคีภัยคอนโด', createdAt: '2026-02-09', updatedAt: '2026-02-09' },
    { id: 'l7', name: 'ปิยะ สมบัติ', phone: '084-666-7788', email: 'piya.s@gmail.com', source: 'Referral', stage: 'Contacted' as const, interest: 'Health' as const, notes: 'แนะนำจากคุณนภา สนใจประกันสุขภาพครอบครัว', createdAt: '2026-02-03', updatedAt: '2026-02-08' },
    { id: 'l8', name: 'อัญชลี ประสิทธิ์', phone: '097-888-9900', email: 'anchalee.p@gmail.com', source: 'Line OA', stage: 'New' as const, interest: 'Life' as const, notes: 'สอบถามเรื่อง Unit-Linked สำหรับการออม', createdAt: '2026-02-10', updatedAt: '2026-02-10' },
  ];

  for (const l of leads) {
    await prisma.lead.create({ data: l });
  }
  console.log(`  ✓ ${leads.length} leads`);

  // ─── Policies ───────────────────────────────────────────────
  const policies = [
    { id: 'p1', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'AIA-WL-2023-001', category: 'Life' as const, lifeSubtype: 'Whole Life', provider: 'AIA', planName: 'AIA Whole Life Plus', premium: 45000, premiumFrequency: 'Annual', sumInsured: 3000000, status: 'Inforced' as const, effectiveDate: '2023-02-01', renewalDate: '2026-02-01', maturityDate: '2043-02-01', notes: 'แผนคุ้มครองตลอดชีวิต' },
    { id: 'p2', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'TLI-EN-2023-015', category: 'Life' as const, lifeSubtype: 'Endowment', provider: 'ไทยประกันชีวิต', planName: 'ไทยประกัน สะสมทรัพย์ 20/10', premium: 8500, premiumFrequency: 'Monthly', sumInsured: 1000000, status: 'Inforced' as const, effectiveDate: '2023-06-15', renewalDate: '2026-06-15', maturityDate: '2033-06-15', notes: 'ออมทรัพย์ 20 ปี จ่าย 10 ปี' },
    { id: 'p3', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', policyNumber: 'MTL-UL-2024-042', category: 'Life' as const, lifeSubtype: 'Unit-Linked', provider: 'เมืองไทยประกันชีวิต', planName: 'MTL Unit-Linked Growth', premium: 5000, premiumFrequency: 'Monthly', sumInsured: 2000000, status: 'Inforced' as const, effectiveDate: '2024-01-01', renewalDate: '2026-01-01', maturityDate: '2044-01-01', notes: 'ลงทุนผ่านกองทุนรวม' },
    { id: 'p4', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'FWD-TM-2024-088', category: 'Life' as const, lifeSubtype: 'Term', provider: 'FWD', planName: 'FWD Term Life 20', premium: 12000, premiumFrequency: 'Semi-Annual', sumInsured: 5000000, status: 'Inforced' as const, effectiveDate: '2024-03-01', renewalDate: '2026-03-01', maturityDate: '2044-03-01', notes: 'คุ้มครองระยะ 20 ปี สำหรับหัวหน้าครอบครัว' },
    { id: 'p5', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', policyNumber: 'AIA-AN-2020-005', category: 'Life' as const, lifeSubtype: 'Annuity', provider: 'AIA', planName: 'AIA Retirement Plus', premium: 30000, premiumFrequency: 'Quarterly', sumInsured: 4000000, status: 'Inforced' as const, effectiveDate: '2020-05-01', renewalDate: '2026-05-01', maturityDate: '2035-05-01', notes: 'แผนเกษียณอายุ' },
    { id: 'p6', clientId: 'c5', clientName: 'วิชัย ธรรมชาติ', policyNumber: 'KTL-UNI-2025-003', category: 'Life' as const, lifeSubtype: 'Universal Life', provider: 'กรุงไทย-แอกซ่า', planName: 'Universal Life Flexi', premium: 3500, premiumFrequency: 'Monthly', sumInsured: 1500000, status: 'Pending' as const, effectiveDate: '2025-02-01', renewalDate: '2026-02-01', maturityDate: '2055-02-01', notes: 'กรมธรรม์ใหม่ รอพิจารณา' },
    { id: 'p7', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'BLA-HL-2024-120', category: 'Health' as const, provider: 'กรุงเทพประกันชีวิต', planName: 'BLA Health Prestige', premium: 35000, premiumFrequency: 'Annual', sumInsured: 5000000, status: 'Inforced' as const, effectiveDate: '2024-04-01', renewalDate: '2026-04-01', notes: 'แผนสุขภาพ IPD+OPD' },
    { id: 'p8', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', policyNumber: 'AIA-HL-2024-078', category: 'Health' as const, provider: 'AIA', planName: 'AIA Health Happy', premium: 22000, premiumFrequency: 'Annual', sumInsured: 3000000, status: 'Inforced' as const, effectiveDate: '2024-07-01', renewalDate: '2026-07-01', notes: 'สุขภาพ ค่าห้อง 4,000/วัน' },
    { id: 'p9', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'MTL-HL-2023-200', category: 'Health' as const, provider: 'เมืองไทยประกันชีวิต', planName: 'MTL D Health', premium: 55000, premiumFrequency: 'Annual', sumInsured: 10000000, status: 'Inforced' as const, effectiveDate: '2023-09-01', renewalDate: '2026-02-20', notes: 'แผน D Health เหมาจ่าย 10 ล้าน' },
    { id: 'p10', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', policyNumber: 'TIP-PA-2024-055', category: 'PA' as const, provider: 'ทิพยประกันภัย', planName: 'PA Plus 500', premium: 5500, premiumFrequency: 'Annual', sumInsured: 500000, status: 'Inforced' as const, effectiveDate: '2024-02-15', renewalDate: '2026-02-15', notes: 'อุบัติเหตุส่วนบุคคล' },
    { id: 'p11', clientId: 'c7', clientName: 'ธนพล เจริญกิจ', policyNumber: 'VIB-PA-2025-011', category: 'PA' as const, provider: 'วิริยะประกันภัย', planName: 'Viriyah PA Gold', premium: 8000, premiumFrequency: 'Annual', sumInsured: 1000000, status: 'Inforced' as const, effectiveDate: '2025-01-01', renewalDate: '2026-01-01', notes: 'PA สำหรับเจ้าของธุรกิจ' },
    { id: 'p12', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', policyNumber: 'VIB-MT-2025-234', category: 'Motor' as const, provider: 'วิริยะประกันภัย', planName: 'ประกันรถยนต์ ชั้น 1', premium: 18000, premiumFrequency: 'Annual', sumInsured: 800000, status: 'Inforced' as const, effectiveDate: '2025-01-15', renewalDate: '2026-03-05', notes: 'Toyota Camry 2023 สีขาว' },
    { id: 'p13', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', policyNumber: 'BKI-MT-2024-567', category: 'Motor' as const, provider: 'กรุงเทพประกันภัย', planName: 'ประกันรถยนต์ ชั้น 2+', premium: 9500, premiumFrequency: 'Annual', sumInsured: 300000, status: 'Inforced' as const, effectiveDate: '2024-08-01', renewalDate: '2026-02-25', notes: 'Honda City 2022' },
    { id: 'p14', clientId: 'c4', clientName: 'นภา ศรีสุข', policyNumber: 'TIP-FR-2024-089', category: 'Fire' as const, provider: 'ทิพยประกันภัย', planName: 'ประกันอัคคีภัย บ้าน', premium: 4500, premiumFrequency: 'Annual', sumInsured: 5000000, status: 'Inforced' as const, effectiveDate: '2024-06-01', renewalDate: '2026-06-01', notes: 'ประกันอัคคีภัยบ้านพักอาศัย' },
    { id: 'p15', clientId: 'c7', clientName: 'ธนพล เจริญกิจ', policyNumber: 'MSI-FR-2024-445', category: 'Fire' as const, provider: 'มิตซุยสุมิโตโม', planName: 'Fire & Allied Perils SME', premium: 15000, premiumFrequency: 'Annual', sumInsured: 20000000, status: 'Inforced' as const, effectiveDate: '2024-10-01', renewalDate: '2026-02-18', notes: 'ประกันอัคคีภัยอาคารสำนักงาน' },
    { id: 'p16', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', policyNumber: 'TLI-WL-2018-200', category: 'Life' as const, lifeSubtype: 'Whole Life', provider: 'ไทยประกันชีวิต', planName: 'ไทยประกัน ตลอดชีวิต', premium: 25000, premiumFrequency: 'Annual', sumInsured: 2000000, status: 'Lapsed' as const, effectiveDate: '2018-01-01', renewalDate: '2025-01-01', maturityDate: '2038-01-01', notes: 'ขาดชำระเบี้ย ติดต่อลูกค้าเพื่อ reinstate' },
    { id: 'p17', clientId: 'c8', clientName: 'พิมลรัตน์ สุขสมบูรณ์', policyNumber: 'FWD-HL-2025-099', category: 'Health' as const, provider: 'FWD', planName: 'FWD Health First', premium: 18000, premiumFrequency: 'Annual', sumInsured: 2000000, status: 'Pending' as const, effectiveDate: '2025-02-01', renewalDate: '2026-02-01', notes: 'กรมธรรม์ใหม่ รอ underwriting' },
  ];

  for (const p of policies) {
    await prisma.policy.create({ data: p as any });
  }
  console.log(`  ✓ ${policies.length} policies`);

  // ─── Tickets ────────────────────────────────────────────────
  const tickets = [
    { id: 't1', clientId: 'c1', clientName: 'สมชาย วงศ์สว่าง', subject: 'ขอเปลี่ยนผู้รับประโยชน์', description: 'ต้องการเปลี่ยนผู้รับประโยชน์กรมธรรม์ AIA-WL-2023-001', priority: 'Medium' as const, status: 'Open', createdAt: '2026-02-08', updatedAt: '2026-02-08' },
    { id: 't2', clientId: 'c2', clientName: 'สุภาพร จันทร์ศรี', subject: 'สอบถามสิทธิ์เคลม', description: 'ต้องการเคลม OPD จาก AIA Health Happy ไม่แน่ใจเรื่องเอกสาร', priority: 'High' as const, status: 'In Progress', createdAt: '2026-02-06', updatedAt: '2026-02-09' },
    { id: 't3', clientId: 'c6', clientName: 'อรุณ พิมพ์ทอง', subject: 'ต้องการ reinstate กรมธรรม์', description: 'กรมธรรม์ TLI-WL-2018-200 ขาดอายุ ลูกค้าต้องการกลับมาจ่ายเบี้ย', priority: 'Urgent' as const, status: 'Open', createdAt: '2026-02-07', updatedAt: '2026-02-07' },
    { id: 't4', clientId: 'c4', clientName: 'นภา ศรีสุข', subject: 'ขอใบรับรองชำระเบี้ยประกัน', description: 'ต้องการใบรับรองสำหรับลดหย่อนภาษี ปี 2025', priority: 'Low' as const, status: 'Resolved', createdAt: '2026-01-20', updatedAt: '2026-02-01' },
    { id: 't5', clientId: 'c3', clientName: 'ประเสริฐ แก้วมณี', subject: 'แจ้งเคลมอุบัติเหตุ', description: 'เกิดอุบัติเหตุเล็กน้อย ต้องการเคลม PA TIP-PA-2024-055', priority: 'High' as const, status: 'Open', createdAt: '2026-02-09', updatedAt: '2026-02-09' },
  ];

  for (const t of tickets) {
    await prisma.ticket.create({ data: t as any });
  }
  console.log(`  ✓ ${tickets.length} tickets`);

  // ─── Tasks ──────────────────────────────────────────────────
  const tasks = [
    { id: 'task1', title: 'โทรติดตาม ลีดคุณกิตติ', description: 'ติดต่อลีดใหม่ สนใจประกันชีวิตสะสมทรัพย์', dueDate: '2026-02-10', completed: false, relatedClientName: 'กิตติ สุขสันต์' },
    { id: 'task2', title: 'ส่งใบเสนอราคาให้คุณรัตนา', description: 'ส่งใบเสนอราคา MTL D Health ทาง Line', dueDate: '2026-02-10', completed: false, relatedClientName: 'รัตนา ดวงแก้ว' },
    { id: 'task3', title: 'ติดตามเอกสารเคลม คุณสุภาพร', description: 'ตรวจสอบเอกสารเคลม OPD ส่งให้ AIA', dueDate: '2026-02-10', completed: true, relatedClientId: 'c2', relatedClientName: 'สุภาพร จันทร์ศรี' },
    { id: 'task4', title: 'ติดตามการ reinstate กรมธรรม์คุณอรุณ', description: 'ส่งเอกสาร reinstate ให้ไทยประกันชีวิต', dueDate: '2026-02-10', completed: false, relatedClientId: 'c6', relatedClientName: 'อรุณ พิมพ์ทอง' },
    { id: 'task5', title: 'เตรียมเอกสารต่ออายุ ชุดเดือน มี.ค.', description: 'รวบรวมกรมธรรม์ที่ต้องต่ออายุในเดือนมีนาคม', dueDate: '2026-02-11', completed: false },
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: t });
  }
  console.log(`  ✓ ${tasks.length} tasks`);

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
