-- Migration to add credit card application fields to leads table
-- Run this in your Supabase SQL editor or via CLI

ALTER TABLE leads ADD COLUMN IF NOT EXISTS salary_months INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS salary_variations BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS existing_cards BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS cards_duration TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS total_credit_limit DECIMAL(10,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS has_emi BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS emi_amount DECIMAL(10,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS applied_recently BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS documents_available TEXT[] DEFAULT '{}';
