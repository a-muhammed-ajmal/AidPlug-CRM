// src/types/models.ts
// Unified data model for AidPlug-CRM: Leads, Deals, and Clients

export type ID = string;
export type ISODate = string; // YYYY-MM-DD or ISO string
export type Currency = 'AED' | 'USD' | 'EUR' | string;

// ============================================================================
// AUDIT & METADATA
// ============================================================================

export interface AuditMeta {
  created_at?: ISODate;
  created_by?: ID | null;
  updated_at?: ISODate | null;
  updated_by?: ID | null;
}

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================

export interface Contact {
  full_name: string;
  email?: string | null;
  phone?: string | null;          // E.164 preferred, e.g. +971501234567
  whatsapp_number?: string | null;// optional, normalized digits only
  designation?: string | null;
  company_name?: string | null;
}

export interface Address {
  location?: string | null;       // e.g. "Dubai"
  street?: string | null;
  city?: string | null;
  emirate?: string | null;        // UAE-specific region
  country?: string | null;        // default "UAE"
  postal_code?: string | null;
}

export interface Financials {
  monthly_salary?: number | null;
  loan_amount_requested?: number | null;
  total_credit_limit?: number | null;
  existing_loans?: number | null;
  salary_months?: number | null;
  salary_variations?: boolean | null;
  has_emi?: boolean | null;
  emi_amount?: number | null;
  employment_years?: number | null;
}

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type ProductType =
  | 'credit_card'
  | 'personal_loan'
  | 'mortgage'
  | 'account_opening'
  | 'other';

export type PipelineStage =
  | 'new'
  | 'warm'
  | 'qualified'
  | 'appointment_booked'
  | 'application_processing'
  | 'approved'
  | 'lost'
  | 'won';

export type ContactMethod = 'phone' | 'email' | 'whatsapp';

export const PRODUCT_TYPES: { value: ProductType; label: string }[] = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'account_opening', label: 'Account Opening' },
  { value: 'other', label: 'Other' },
];

export const PIPELINE_STAGES: { value: PipelineStage; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: '#6B7280' },
  { value: 'warm', label: 'Warm', color: '#F59E0B' },
  { value: 'qualified', label: 'Qualified', color: '#3B82F6' },
  { value: 'appointment_booked', label: 'Appointment Booked', color: '#8B5CF6' },
  { value: 'application_processing', label: 'Application Processing', color: '#06B6D4' },
  { value: 'approved', label: 'Approved', color: '#10B981' },
  { value: 'won', label: 'Won', color: '#059669' },
  { value: 'lost', label: 'Lost', color: '#EF4444' },
];

export const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah',
];

// ============================================================================
// BASE ENTITY
// ============================================================================

export interface BaseEntity extends AuditMeta {
  id: ID;
  user_id?: ID | null; // owner / assigned user
  notes?: string | null;
  tags?: string[] | null;
}

// ============================================================================
// LEAD
// ============================================================================

export interface Lead extends BaseEntity {
  // Core contact
  contact: Contact;

  // Lead-specific
  product?: string | null;
  product_type?: ProductType | null;
  bank_name?: string | null;
  stage?: PipelineStage | null;
  source?: string | null;        // lead source
  last_contact_date?: ISODate | null;
  product_interest?: string[] | null;
  documents_available?: boolean | null;
  applied_recently?: boolean | null;
  existing_cards?: boolean | null;
  cards_duration?: number | null; // months

  // Financials
  financials?: Financials | null;
}

// ============================================================================
// CLIENT
// ============================================================================

export interface Client extends BaseEntity {
  contact: Contact;
  address?: Address | null;
  dob?: ISODate | null;
  national_id?: string | null;   // Emirates ID
  nationality?: string | null;
  preferred_contact_method?: ContactMethod | null;
  kyc_completed?: boolean | null;

  // Aggregated data
  total_deals?: number | null;
  total_revenue?: number | null;
}

// ============================================================================
// DEAL (OPPORTUNITY)
// ============================================================================

export interface Deal extends BaseEntity {
  title: string;
  contact: Contact;              // snapshot of client/contact at deal creation
  client_id?: ID | null;         // link to Client if exists

  product?: string | null;
  product_type?: ProductType | null;
  bank_applying?: string | null;
  amount?: number | null;        // currency implied by currency field
  currency?: Currency;
  probability?: number | null;   // 0-100
  stage?: PipelineStage | null;
  expected_close_date?: ISODate | null;
  estimated_months_to_close?: number | null;
  application_number?: string | null;
  bdi_number?: string | null;

  // Financials snapshot
  financials?: Financials | null;
}

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

export interface LeadToDealConversion {
  lead: Lead;
  createClient?: boolean;
  expectedCloseDate?: ISODate;
  probability?: number;
  amount?: number;
}

export function convertLeadToDeal(
  params: LeadToDealConversion
): { deal: Partial<Deal>; client?: Partial<Client> } {
  const { lead, createClient = false, expectedCloseDate, probability = 25, amount } = params;

  // Calculate default amount
  const defaultAmount =
    lead.financials?.loan_amount_requested ||
    (lead.financials?.monthly_salary ? lead.financials.monthly_salary * 3 : null) ||
    50000;

  // Calculate expected close date (30 days from now)
  const closeDate = expectedCloseDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const deal: Partial<Deal> = {
    title: `${lead.product || lead.product_type || 'Opportunity'} - ${lead.contact.full_name}`,
    contact: { ...lead.contact },
    product: lead.product,
    product_type: lead.product_type,
    bank_applying: lead.bank_name,
    amount: amount || defaultAmount,
    currency: 'AED',
    probability,
    stage: 'application_processing',
    expected_close_date: closeDate,
    financials: lead.financials ? { ...lead.financials } : null,
    user_id: lead.user_id,
    notes: lead.notes,
    tags: lead.tags,
  };

  let client: Partial<Client> | undefined;
  if (createClient) {
    client = {
      contact: { ...lead.contact },
      user_id: lead.user_id,
      tags: lead.tags,
      kyc_completed: false,
    };
  }

  return { deal, client };
}
