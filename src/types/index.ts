// ─── Policy Categories & Subtypes ───────────────────────────────────

export type PolicyCategory = 'Life' | 'Health' | 'PA' | 'Motor' | 'Fire' | 'Other';

export type LifeSubtype =
  | 'Whole Life'
  | 'Endowment'
  | 'Annuity'
  | 'Unit-Linked'
  | 'Universal Life'
  | 'Term';

export type PremiumFrequency = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';

export type PolicyStatus = 'Pending' | 'Inforced' | 'Lapsed' | 'Cancelled' | 'Matured';

// ─── Lead ───────────────────────────────────────────────────────────

export type LeadStage = 'New' | 'Contacted' | 'Quoted' | 'Closed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  stage: LeadStage;
  interest: PolicyCategory;
  notes: string;
  createdAt: string;
  updatedAt: string;
  convertedToClientId?: string;
}

// ─── Client ─────────────────────────────────────────────────────────

export type ClientTier = 'VIP' | 'Standard';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  idCard: string;
  dateOfBirth: string;
  address: string;
  tier: ClientTier;
  createdAt: string;
  notes: string;
}

// ─── Policy ─────────────────────────────────────────────────────────

export interface Policy {
  id: string;
  clientId: string;
  clientName: string;
  policyNumber: string;
  category: PolicyCategory;
  lifeSubtype?: LifeSubtype;       // required when category === 'Life'
  provider: string;
  planName: string;
  premium: number;
  premiumFrequency: PremiumFrequency; // Life: any; Non-life: Annual only
  sumInsured: number;
  status: PolicyStatus;
  effectiveDate: string;
  renewalDate: string;              // REQUIRED for all
  maturityDate?: string;            // REQUIRED for Life, N/A for non-life
  notes: string;
}

// ─── Ticket ─────────────────────────────────────────────────────────

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Task ───────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  relatedClientId?: string;
  relatedClientName?: string;
}

// ─── Dashboard ──────────────────────────────────────────────────────

export type DashboardView = 'operations' | 'business' | 'pipeline';
