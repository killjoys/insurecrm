// ─── Shared types for backend (mirrors src/types/index.ts) ──────────

// ─── Generic API responses ──────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
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

export interface CreateClientDto {
  name: string;
  phone: string;
  email?: string;
  idCard?: string;
  dateOfBirth?: string;
  address?: string;
  tier?: ClientTier;
  notes?: string;
}

export interface UpdateClientDto {
  name?: string;
  phone?: string;
  email?: string;
  idCard?: string;
  dateOfBirth?: string;
  address?: string;
  tier?: ClientTier;
  notes?: string;
}

// ─── Lead ───────────────────────────────────────────────────────────

export type PolicyCategory = 'Life' | 'Health' | 'PA' | 'Motor' | 'Fire' | 'Other';
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

export interface CreateLeadDto {
  name: string;
  phone: string;
  email?: string;
  source?: string;
  stage?: LeadStage;
  interest?: PolicyCategory;
  notes?: string;
}

export interface UpdateLeadDto {
  name?: string;
  phone?: string;
  email?: string;
  source?: string;
  stage?: LeadStage;
  interest?: PolicyCategory;
  notes?: string;
  convertedToClientId?: string;
}

// ─── Policy ─────────────────────────────────────────────────────────

export type LifeSubtype = 'Whole Life' | 'Endowment' | 'Annuity' | 'Unit-Linked' | 'Universal Life' | 'Term';
export type PremiumFrequency = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
export type PolicyStatus = 'Pending' | 'Inforced' | 'Lapsed' | 'Cancelled' | 'Matured';

export interface Policy {
  id: string;
  clientId: string;
  clientName: string;
  policyNumber: string;
  category: PolicyCategory;
  lifeSubtype?: LifeSubtype;
  provider: string;
  planName: string;
  premium: number;
  premiumFrequency: PremiumFrequency;
  sumInsured: number;
  status: PolicyStatus;
  effectiveDate: string;
  renewalDate: string;
  maturityDate?: string;
  notes: string;
}

export interface CreatePolicyDto {
  clientId: string;
  clientName: string;
  policyNumber: string;
  category: PolicyCategory;
  lifeSubtype?: LifeSubtype;
  provider: string;
  planName: string;
  premium: number;
  premiumFrequency: PremiumFrequency;
  sumInsured: number;
  status?: PolicyStatus;
  effectiveDate: string;
  renewalDate: string;
  maturityDate?: string;
  notes?: string;
}

export interface UpdatePolicyDto {
  clientId?: string;
  clientName?: string;
  policyNumber?: string;
  category?: PolicyCategory;
  lifeSubtype?: LifeSubtype;
  provider?: string;
  planName?: string;
  premium?: number;
  premiumFrequency?: PremiumFrequency;
  sumInsured?: number;
  status?: PolicyStatus;
  effectiveDate?: string;
  renewalDate?: string;
  maturityDate?: string;
  notes?: string;
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

export interface CreateTicketDto {
  clientId: string;
  clientName: string;
  subject: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface UpdateTicketDto {
  clientId?: string;
  clientName?: string;
  subject?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
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

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate: string;
  completed?: boolean;
  relatedClientId?: string;
  relatedClientName?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  relatedClientId?: string;
  relatedClientName?: string;
}
