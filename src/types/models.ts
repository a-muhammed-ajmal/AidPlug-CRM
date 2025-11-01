# AidPlug-CRM Implementation Guide

## Overview

This guide will help you implement the unified data model and dynamic form system for Leads, Deals, and Clients in your AidPlug-CRM application.

## What's Been Created

I've created **5 complete artifacts** for you:

1. **Core Data Models** (`models.ts`) - TypeScript interfaces for Leads, Deals, Clients
2. **Form Configuration** (`formConfig.ts`) - Dynamic field descriptors and form sections
3. **Formatters & Validators** (`formatters.ts`) - Utilities for phone, currency, date formatting
4. **Database Migration** (`create_tables.sql`) - PostgreSQL schema with indexes and triggers
5. **Dynamic Form Renderer** (React component) - Complete working form system

## Step-by-Step Implementation

### Phase 1: Add Type Definitions (15 minutes)

1. **Create the models file:**
   ```bash
   mkdir -p src/types
   ```

2. **Copy the models.ts artifact** into `src/types/models.ts`
   - This becomes your single source of truth for data structures
   - Export these types throughout your application

3. **Copy the formConfig.ts artifact** into `src/types/formConfig.ts`
   - Contains field descriptors for Lead, Deal, and Client forms
   - Includes helper functions for nested object manipulation

4. **Replace existing type imports:**
   ```typescript
   // Old way (scattered across files)
   interface Lead { ... }
   
   // New way (centralized)
   import type { Lead, Deal, Client } from '@/types/models';
   ```

### Phase 2: Add Utility Functions (15 minutes)

1. **Create utilities directory:**
   ```bash
   mkdir -p src/lib
   ```

2. **Copy the formatters.ts artifact** into `src/lib/formatters.ts`
   - Phone normalization (E.164 format)
   - Currency formatting (AED)
   - Date formatting (ISO 8601)
   - Email normalization
   - Emirates ID validation
   - Tag normalization

3. **Use formatters throughout the app:**
   ```typescript
   import { 
     normalizePhone, 
     formatCurrency, 
     formatDate 
   } from '@/lib/formatters';
   
   // In your components
   const displayPhone = formatPhoneDisplay(lead.contact.phone);
   const amount = formatCurrency(deal.amount); // "AED 50,000"
   ```

### Phase 3: Database Migration (30 minutes)

1. **Review the SQL migration** (artifact #4)
   - Creates `leads`, `clients`, and `deals` tables
   - Adds proper indexes for performance
   - Sets up triggers for `updated_at` timestamps
   - Creates views for common queries

2. **Run the migration:**
   ```bash
   # Option 1: Direct PostgreSQL
   psql -U your_user -d your_db -f create_tables.sql
   
   # Option 2: If using migration tool (e.g., Prisma)
   # Add to your migration files
   ```

3. **Verify tables created:**
   ```sql
   \dt  -- List tables
   SELECT * FROM leads LIMIT 1;
   SELECT * FROM clients LIMIT 1;
   SELECT * FROM deals LIMIT 1;
   ```

### Phase 4: Update API Layer (1-2 hours)

1. **Update your API routes to use new types:**
   ```typescript
   // api/leads/route.ts
   import type { Lead } from '@/types/models';
   import { normalizePhone, normalizeEmail } from '@/lib/formatters';
   
   export async function POST(request: Request) {
     const body: Partial<Lead> = await request.json();
     
     // Normalize before saving
     if (body.contact?.phone) {
       body.contact.phone = normalizePhone(body.contact.phone);
     }
     if (body.contact?.email) {
       body.contact.email = normalizeEmail(body.contact.email);
     }
     
     // Save to database...
   }
   ```

2. **Add conversion endpoint:**
   ```typescript
   // api/leads/[id]/convert/route.ts
   import { convertLeadToDeal } from '@/types/models';
   
   export async function POST(
     request: Request,
     { params }: { params: { id: string } }
   ) {
     const lead = await db.leads.findUnique({ where: { id: params.id } });
     
     const { deal, client } = convertLeadToDeal({
       lead,
       createClient: true,
       probability: 60,
     });
     
     // Create deal and optionally client
     // Delete or archive lead
   }
   ```

### Phase 5: Update Components (2-3 hours)

#### 5.1 Replace AddLeadModal

**Old way:**
```typescript
// Manually defined form with hardcoded fields
<input name="name" />
<input name="email" />
// ... 20+ fields
```

**New way:**
```typescript
import { DynamicForm } from '@/components/DynamicForm';
import { LEAD_FORM_SECTIONS } from '@/types/formConfig';

function AddLeadModal({ isOpen, onClose }) {
  const handleSubmit = async (values) => {
    await fetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DynamicForm
        sections={LEAD_FORM_SECTIONS}
        initialValues={{}}
        onSubmit={handleSubmit}
        submitLabel="Create Lead"
      />
    </Modal>
  );
}
```

#### 5.2 Update EditLeadModal

```typescript
function EditLeadModal({ lead, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DynamicForm
        sections={LEAD_FORM_SECTIONS}
        initialValues={lead}
        onSubmit={handleUpdate}
        submitLabel="Update Lead"
      />
    </Modal>
  );
}
```

#### 5.3 Update LeadCard

```typescript
import { formatPhoneDisplay, formatCurrency } from '@/lib/formatters';
import { getInitials } from '@/lib/formatters';

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="border rounded-lg p-4">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
        {getInitials(lead.contact.full_name)}
      </div>
      
      {/* Name */}
      <h3 className="font-semibold">{lead.contact.full_name}</h3>
      
      {/* Company */}
      <p className="text-sm text-gray-600">{lead.contact.company_name}</p>
      
      {/* Product & Stage */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs">{lead.product_type}</span>
        <span className={`px-2 py-1 rounded text-xs ${stageColors[lead.stage]}`}>
          {lead.stage}
        </span>
      </div>
      
      {/* Contact */}
      <div className="mt-2 text-sm">
        <div>📞 {formatPhoneDisplay(lead.contact.phone)}</div>
        <div>✉️ {lead.contact.email}</div>
      </div>
      
      {/* Tags */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex gap-1 mt-2">
          {lead.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Phase 6: Copy Dynamic Form Component (30 minutes)

1. **Create the DynamicForm component:**
   ```bash
   mkdir -p src/components/forms
   ```

2. **Copy the React artifact** into `src/components/forms/DynamicForm.tsx`
   - This is a complete, working form renderer
   - Handles all field types (text, select, checkbox, chips, currency, percentage)
   - Includes validation
   - Supports conditional field visibility
   - Collapsible sections

3. **Install required dependencies:**
   ```bash
   npm install lucide-react
   ```

### Phase 7: Testing & Validation (1-2 hours)

1. **Test Lead creation:**
   - Fill out all required fields
   - Verify phone number normalization (+971 prefix)
   - Check email lowercase normalization
   - Test conditional fields (e.g., EMI amount only shows when "Has EMI" is checked)

2. **Test Lead to Deal conversion:**
   ```typescript
   // In your component
   const handleConvert = async () => {
     const response = await fetch(`/api/leads/${lead.id}/convert`, {
       method: 'POST',
     });
     const { deal } = await response.json();
     router.push(`/deals/${deal.id}`);
   };
   ```

3. **Test Deal creation:**
   - Verify all financial fields work
   - Check probability slider (0-100%)
   - Test expected close date picker

4. **Test Client creation:**
   - Check Emirates ID validation
   - Verify address fields
   - Test KYC checkbox

## Advanced Features

### Custom Field Descriptors

You can easily add custom fields or modify existing ones:

```typescript
// In your component or custom config file
const CUSTOM_LEAD_FIELDS: FormSection[] = [
  {
    title: 'Custom Section',
    fields: [
      {
        name: 'custom_field',
        label: 'Custom Field',
        type: 'select',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        required: true,
        helpText: 'This is a custom field',
      },
    ],
  },
  ...LEAD_FORM_SECTIONS, // Spread existing sections
];
```

### Field Transformations

Apply transformations before saving:

```typescript
{
  name: 'contact.phone',
  label: 'Phone',
  type: 'tel',
  transformOnSave: (value) => normalizePhone(value), // Auto-format on submit
}
```

### Conditional Visibility

Show/hide fields based on other values:

```typescript
{
  name: 'emi_amount',
  label: 'EMI Amount',
  type: 'currency',
  visibleWhen: (values) => values.has_emi === true, // Only show if has_emi is checked
}
```

## Performance Optimizations

### Database Indexes

The migration includes these key indexes:
- `idx_leads_stage` - Fast filtering by pipeline stage
- `idx_leads_email` - Quick email lookups
- `idx_deals_expected_close_date` - Efficient date sorting
- `idx_clients_phone` - Fast phone number searches

### API Query Optimization

```typescript
// Use the provided views for common queries
const activeLeads = await db.query(`
  SELECT * FROM active_leads
  WHERE stage = 'warm'
  ORDER BY created_at DESC
  LIMIT 20
`);
```

## Troubleshooting

### Common Issues

1. **Phone numbers not formatting correctly:**
   - Ensure you're using `normalizePhone()` before saving
   - Check that the database column stores E.164 format (+971...)

2. **Form validation not working:**
   - Verify field names match the data structure
   - Check that `required` is set on field descriptors
   - Ensure error messages are being displayed

3. **Conditional fields not showing:**
   - Check the `visibleWhen` function logic
   - Verify the field name paths are correct (e.g., `financials.emi_amount`)

4. **Database constraints failing:**
   - Review the SQL constraints in the migration
   - Ensure data is normalized before insert/update

## Next Steps

1. **Migrate existing data** to new schema
2. **Update all forms** to use DynamicForm component
3. **Add activity logging** for conversions
4. **Implement search** using the indexed fields
5. **Add reports** using the aggregated data (total_deals, total_revenue)

## Support

If you encounter issues:
1. Check the type definitions in `models.ts`
2. Review validation rules in `formConfig.ts`
3. Verify formatters are imported correctly
4. Check database constraints in migration file

## Summary

You now have:
- ✅ Unified TypeScript types for all entities
- ✅ Dynamic form system with validation
- ✅ Centralized formatters and validators
- ✅ Complete database schema with indexes
- ✅ Lead → Deal → Client conversion flow

This system is:
- **Maintainable** - Single source of truth for data structures
- **Consistent** - Same form behavior across all entities
- **Flexible** - Easy to add new fields or customize
- **Type-safe** - Full TypeScript support
- **Performant** - Proper database indexes and normalization// src/types/models.ts
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
