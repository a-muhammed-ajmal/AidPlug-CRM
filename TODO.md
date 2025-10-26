# TODO List for Implementing Lead Components for Credit Card Applications

## Database Schema Update
- [ ] Create and run Supabase migration to add new fields to the 'leads' table:
  - salary_months (INT)
  - salary_variations (BOOLEAN)
  - existing_cards (BOOLEAN)
  - cards_duration (TEXT)
  - total_credit_limit (NUMERIC)
  - has_emi (BOOLEAN)
  - emi_amount (NUMERIC)
  - applied_recently (BOOLEAN)
  - documents_available (TEXT[])

## Type Definitions
- [x] Update src/types.ts to include new fields in Lead, LeadInsert, LeadUpdate interfaces (already done based on provided code)

## Components
- [x] Update src/components/leads/LeadCard.tsx to be compact, use logo colors (#1a68c7, #74c12d), display key info, show warning for recent applications, include quick actions (already updated)
- [x] Create src/components/leads/LeadDetailModal.tsx with comprehensive editable form organized into sections (Personal, Product, Salary, Credit & EMI, Application History & Documents) (already created)

## Hooks and Services
- [x] Update src/hooks/useLeads.ts to explicitly select all new fields in the query (currently uses select('*'), but make it explicit for safety) (done)

## Forms
- [x] Update src/components/leads/AddLeadModal.tsx to include inputs for the new fields (salary_months, salary_variations, existing_cards, cards_duration, total_credit_limit, has_emi, emi_amount, applied_recently, documents_available) (done)

## Testing and Verification
- [ ] Test LeadCard display and interactions
- [ ] Test LeadDetailModal form editing and saving
- [ ] Test AddLeadModal with new fields
- [ ] Verify data fetching includes new fields
- [ ] Check for any TypeScript errors or linting issues
