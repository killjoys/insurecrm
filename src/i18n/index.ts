export type Language = 'th' | 'en';

const translations: Record<Language, Record<string, string>> = {
  th: {
    // Nav
    'nav.dashboard': 'แดชบอร์ด',
    'nav.leads': 'ลีด',
    'nav.clients': 'ลูกค้า',
    'nav.policies': 'กรมธรรม์',
    'nav.renewals': 'ต่ออายุ',
    'nav.tickets': 'ตั๋วงาน',
    'nav.settings': 'ตั้งค่า',

    // Dashboard toggle
    'dashboard.operations': 'วันนี้ / ปฏิบัติการ',
    'dashboard.business': 'ธุรกิจ (รายได้)',
    'dashboard.pipeline': 'ไปป์ไลน์ (CRM)',

    // KPIs - Operations
    'kpi.leadsThisMonth': 'ลีดเดือนนี้',
    'kpi.activeClients': 'ลูกค้าที่ใช้งาน',
    'kpi.inforcedPolicies': 'กรมธรรม์ Inforced',
    'kpi.renewalsDue': 'ต่ออายุ (30 วัน)',
    'kpi.openTickets': 'ตั๋วเปิดอยู่',

    // KPIs - Business
    'kpi.revenueYTD': 'รายได้ YTD',
    'kpi.netProfitYTD': 'กำไรสุทธิ YTD',
    'kpi.annualizedPremium': 'เบี้ยรายปี',
    'kpi.bonusOV': 'โบนัส/OV',

    // Panels
    'panel.upcomingRenewals': 'การต่ออายุที่ใกล้ถึง',
    'panel.recentTickets': 'ตั๋วงานล่าสุด',
    'panel.myTasksToday': 'งานของฉันวันนี้',
    'panel.quickActions': 'ทางลัด',
    'panel.monthlyRevenue': 'รายได้รายเดือน',
    'panel.topPolicies': 'กรมธรรม์ยอดนิยม',
    'panel.topClients': 'ลูกค้าชั้นนำ',
    'panel.leadFunnel': 'ช่องทางลีด',
    'panel.clientTiers': 'ระดับลูกค้า',
    'panel.renewalHealth': 'สุขภาพการต่ออายุ',

    // Quick Actions
    'action.newLead': 'ลีดใหม่',
    'action.newClient': 'ลูกค้าใหม่',
    'action.newPolicy': 'กรมธรรม์ใหม่',
    'action.newTicket': 'ตั๋วใหม่',

    // Table Headers
    'table.name': 'ชื่อ',
    'table.phone': 'โทรศัพท์',
    'table.email': 'อีเมล',
    'table.status': 'สถานะ',
    'table.stage': 'ขั้นตอน',
    'table.category': 'ประเภท',
    'table.premium': 'เบี้ยประกัน',
    'table.renewalDate': 'วันต่ออายุ',
    'table.maturityDate': 'วันครบกำหนด',
    'table.provider': 'บริษัทประกัน',
    'table.policyNumber': 'เลขกรมธรรม์',
    'table.client': 'ลูกค้า',
    'table.tier': 'ระดับ',
    'table.priority': 'ความสำคัญ',
    'table.subject': 'หัวข้อ',
    'table.created': 'วันที่สร้าง',
    'table.actions': 'ดำเนินการ',
    'table.sumInsured': 'ทุนประกัน',
    'table.frequency': 'ความถี่ชำระ',
    'table.daysLeft': 'เหลือ (วัน)',

    // Policy Categories
    'category.Life': 'ชีวิต',
    'category.Health': 'สุขภาพ',
    'category.PA': 'อุบัติเหตุ',
    'category.Motor': 'รถยนต์',
    'category.Fire': 'อัคคีภัย',
    'category.Other': 'อื่นๆ',

    // Policy Status
    'status.Pending': 'รอดำเนินการ',
    'status.Inforced': 'มีผลบังคับ',
    'status.Lapsed': 'ขาดอายุ',
    'status.Cancelled': 'ยกเลิก',
    'status.Matured': 'ครบกำหนด',

    // Lead Stages
    'stage.New': 'ใหม่',
    'stage.Contacted': 'ติดต่อแล้ว',
    'stage.Quoted': 'เสนอราคาแล้ว',
    'stage.Closed': 'ปิดการขาย',

    // Ticket Status
    'ticket.Open': 'เปิด',
    'ticket.InProgress': 'กำลังดำเนินการ',
    'ticket.Resolved': 'แก้ไขแล้ว',
    'ticket.Closed': 'ปิด',

    // Common
    'common.search': 'ค้นหา...',
    'common.add': 'เพิ่ม',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.view': 'ดูรายละเอียด',
    'common.all': 'ทั้งหมด',
    'common.export': 'ส่งออก',
    'common.filter': 'กรอง',
    'common.total': 'รวม',
    'common.baht': 'บาท',
    'common.days': 'วัน',
    'common.noData': 'ไม่มีข้อมูล',
    'common.convertToClient': 'แปลงเป็นลูกค้า',

    // Settings
    'settings.title': 'ตั้งค่า',
    'settings.language': 'ภาษา',
    'settings.profile': 'โปรไฟล์',
    'settings.notifications': 'การแจ้งเตือน',
    'settings.appearance': 'การแสดงผล',

    // Charts
    'chart.life': 'ชีวิต',
    'chart.nonLife': 'วินาศภัย',
    'chart.bonus': 'โบนัส/OV',
    'chart.revenue': 'รายได้',
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.leads': 'Leads',
    'nav.clients': 'Clients',
    'nav.policies': 'Policies',
    'nav.renewals': 'Renewals',
    'nav.tickets': 'Tickets',
    'nav.settings': 'Settings',

    'dashboard.operations': 'Today / Operations',
    'dashboard.business': 'Business (Revenue)',
    'dashboard.pipeline': 'Pipeline (CRM)',

    'kpi.leadsThisMonth': 'Leads This Month',
    'kpi.activeClients': 'Active Clients',
    'kpi.inforcedPolicies': 'Inforced Policies',
    'kpi.renewalsDue': 'Renewals Due (30d)',
    'kpi.openTickets': 'Open Tickets',

    'kpi.revenueYTD': 'Revenue YTD',
    'kpi.netProfitYTD': 'Net Profit YTD',
    'kpi.annualizedPremium': 'Annualized Premium',
    'kpi.bonusOV': 'Bonus/OV',

    'panel.upcomingRenewals': 'Upcoming Renewals',
    'panel.recentTickets': 'Recent Tickets',
    'panel.myTasksToday': 'My Tasks Today',
    'panel.quickActions': 'Quick Actions',
    'panel.monthlyRevenue': 'Monthly Revenue Trend',
    'panel.topPolicies': 'Top Policies',
    'panel.topClients': 'Top Clients',
    'panel.leadFunnel': 'Lead Funnel',
    'panel.clientTiers': 'Client Tier Distribution',
    'panel.renewalHealth': 'Renewal Health Summary',

    'action.newLead': 'New Lead',
    'action.newClient': 'New Client',
    'action.newPolicy': 'New Policy',
    'action.newTicket': 'New Ticket',

    'table.name': 'Name',
    'table.phone': 'Phone',
    'table.email': 'Email',
    'table.status': 'Status',
    'table.stage': 'Stage',
    'table.category': 'Category',
    'table.premium': 'Premium',
    'table.renewalDate': 'Renewal Date',
    'table.maturityDate': 'Maturity Date',
    'table.provider': 'Provider',
    'table.policyNumber': 'Policy No.',
    'table.client': 'Client',
    'table.tier': 'Tier',
    'table.priority': 'Priority',
    'table.subject': 'Subject',
    'table.created': 'Created',
    'table.actions': 'Actions',
    'table.sumInsured': 'Sum Insured',
    'table.frequency': 'Frequency',
    'table.daysLeft': 'Days Left',

    'category.Life': 'Life',
    'category.Health': 'Health',
    'category.PA': 'PA',
    'category.Motor': 'Motor',
    'category.Fire': 'Fire',
    'category.Other': 'Other',

    'status.Pending': 'Pending',
    'status.Inforced': 'Inforced',
    'status.Lapsed': 'Lapsed',
    'status.Cancelled': 'Cancelled',
    'status.Matured': 'Matured',

    'stage.New': 'New',
    'stage.Contacted': 'Contacted',
    'stage.Quoted': 'Quoted',
    'stage.Closed': 'Closed',

    'ticket.Open': 'Open',
    'ticket.InProgress': 'In Progress',
    'ticket.Resolved': 'Resolved',
    'ticket.Closed': 'Closed',

    'common.search': 'Search...',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.view': 'View',
    'common.all': 'All',
    'common.export': 'Export',
    'common.filter': 'Filter',
    'common.total': 'Total',
    'common.baht': 'THB',
    'common.days': 'days',
    'common.noData': 'No data',
    'common.convertToClient': 'Convert to Client',

    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.profile': 'Profile',
    'settings.notifications': 'Notifications',
    'settings.appearance': 'Appearance',

    'chart.life': 'Life',
    'chart.nonLife': 'Non-Life',
    'chart.bonus': 'Bonus/OV',
    'chart.revenue': 'Revenue',
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang]?.[key] ?? key;
}

export function formatCurrency(amount: number, lang: Language): string {
  const suffix = lang === 'th' ? ' บาท' : ' THB';
  return amount.toLocaleString('th-TH') + suffix;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}
