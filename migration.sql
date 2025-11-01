-- AidPlug-CRM Database Migration
-- Unified schema for Leads, Deals, and Clients
-- Compatible with PostgreSQL 12+

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE product_type AS ENUM (
  'credit_card',
  'personal_loan',
  'mortgage',
  'account_opening',
  'other'
);

CREATE TYPE pipeline_stage AS ENUM (
  'new',
  'warm',
  'qualified',
  'appointment_booked',
  'application_processing',
  'approved',
  'lost',
  'won'
);

CREATE TYPE contact_method AS ENUM (
  'phone',
  'email',
  'whatsapp'
);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================

CREATE TABLE leads (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact information (embedded as JSONB)
  contact JSONB NOT NULL,
  -- contact structure:
  -- {
  --   "full_name": string (required),
  --   "email": string | null,
  --   "phone": string | null (E.164 format),
  --   "whatsapp_number": string | null,
  --   "designation": string | null,
  --   "company_name": string | null
  -- }

  -- Extracted fields for indexing/querying
  full_name TEXT GENERATED ALWAYS AS (contact->>'full_name') STORED,
  email TEXT GENERATED ALWAYS AS (LOWER(contact->>'email')) STORED,
  phone TEXT GENERATED ALWAYS AS (contact->>'phone') STORED,
  company_name TEXT GENERATED ALWAYS AS (contact->>'company_name') STORED,

  -- Lead-specific fields
  product TEXT,
  product_type product_type,
  bank_name TEXT,
  stage pipeline_stage DEFAULT 'new',
  source TEXT,
  last_contact_date DATE,
  product_interest TEXT[],
  documents_available BOOLEAN DEFAULT false,
  applied_recently BOOLEAN DEFAULT false,
  existing_cards BOOLEAN DEFAULT false,
  cards_duration INTEGER CHECK (cards_duration >= 0),

  -- Financials (embedded as JSONB)
  financials JSONB,
  -- financials structure:
  -- {
  --   "monthly_salary": number | null,
  --   "loan_amount_requested": number | null,
  --   "total_credit_limit": number | null,
  --   "existing_loans": number | null,
  --   "salary_months": number | null,
  --   "salary_variations": boolean | null,
  --   "has_emi": boolean | null,
  --   "emi_amount": number | null,
  --   "employment_years": number | null
  -- }

  -- Ownership & metadata
  user_id UUID,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_at TIMESTAMPTZ,
  updated_by UUID,

  -- Constraints
  CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+\d{10,15}$')
);

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================

CREATE TABLE clients (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contact information (embedded as JSONB)
  contact JSONB NOT NULL,

  -- Extracted fields for indexing/querying
  full_name TEXT GENERATED ALWAYS AS (contact->>'full_name') STORED,
  email TEXT GENERATED ALWAYS AS (LOWER(contact->>'email')) STORED,
  phone TEXT GENERATED ALWAYS AS (contact->>'phone') STORED,
  company_name TEXT GENERATED ALWAYS AS (contact->>'company_name') STORED,

  -- Address (embedded as JSONB)
  address JSONB,
  -- address structure:
  -- {
  --   "location": string | null,
  --   "street": string | null,
  --   "city": string | null,
  --   "emirate": string | null,
  --   "country": string | null,
  --   "postal_code": string | null
  -- }

  -- Client-specific fields
  dob DATE,
  national_id TEXT, -- Emirates ID
  nationality TEXT,
  preferred_contact_method contact_method,
  kyc_completed BOOLEAN DEFAULT false,

  -- Aggregated data (computed)
  total_deals INTEGER DEFAULT 0,
  total_revenue NUMERIC(12, 2) DEFAULT 0,

  -- Ownership & metadata
  user_id UUID,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_at TIMESTAMPTZ,
  updated_by UUID,

  -- Constraints
  CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+\d{10,15}$'),
  CONSTRAINT valid_national_id CHECK (national_id IS NULL OR national_id ~ '^\d{3}-\d{4}-\d{7}-\d$')
);

-- ============================================================================
-- DEALS TABLE
-- ============================================================================

CREATE TABLE deals (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Deal identification
  title TEXT NOT NULL,

  -- Contact information (snapshot at deal creation)
  contact JSONB NOT NULL,

  -- Extracted fields for indexing/querying
  full_name TEXT GENERATED ALWAYS AS (contact->>'full_name') STORED,
  email TEXT GENERATED ALWAYS AS (LOWER(contact->>'email')) STORED,
  phone TEXT GENERATED ALWAYS AS (contact->>'phone') STORED,

  -- Client relationship
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  -- Product details
  product TEXT,
  product_type product_type,
  bank_applying TEXT,

  -- Deal value & probability
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),

  -- Pipeline
  stage pipeline_stage DEFAULT 'application_processing',
  expected_close_date DATE NOT NULL,
  estimated_months_to_close INTEGER,

  -- Application details
  application_number TEXT,
  bdi_number TEXT,

  -- Financials snapshot (embedded as JSONB)
  financials JSONB,

  -- Ownership & metadata
  user_id UUID,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_at TIMESTAMPTZ,
  updated_by UUID,

  -- Constraints
  CONSTRAINT valid_email CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+\d{10,15}$'),
  CONSTRAINT positive_amount CHECK (amount >= 0)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Leads indexes
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_product_type ON leads(product_type);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_full_name ON leads(full_name);
CREATE INDEX idx_leads_bank_name ON leads(bank_name);
CREATE INDEX idx_leads_tags ON leads USING GIN(tags);

-- Clients indexes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_full_name ON clients(full_name);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);
CREATE INDEX idx_clients_tags ON clients USING GIN(tags);
CREATE INDEX idx_clients_kyc ON clients(kyc_completed);

-- Deals indexes
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_client_id ON deals(client_id);
CREATE INDEX idx_deals_expected_close_date ON deals(expected_close_date);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_product_type ON deals(product_type);
CREATE INDEX idx_deals_amount ON deals(amount);
CREATE INDEX idx_deals_email ON deals(email);
CREATE INDEX idx_deals_phone ON deals(phone);
CREATE INDEX idx_deals_tags ON deals USING GIN(tags);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER TO UPDATE CLIENT AGGREGATIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_client_aggregations()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_deals and total_revenue for the client
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE clients
    SET
      total_deals = (
        SELECT COUNT(*)
        FROM deals
        WHERE client_id = NEW.client_id
      ),
      total_revenue = (
        SELECT COALESCE(SUM(amount), 0)
        FROM deals
        WHERE client_id = NEW.client_id
        AND stage = 'won'
      )
    WHERE id = NEW.client_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE clients
    SET
      total_deals = (
        SELECT COUNT(*)
        FROM deals
        WHERE client_id = OLD.client_id
      ),
      total_revenue = (
        SELECT COALESCE(SUM(amount), 0)
        FROM deals
        WHERE client_id = OLD.client_id
        AND stage = 'won'
      )
    WHERE id = OLD.client_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_aggregations_trigger
  AFTER INSERT OR UPDATE OR DELETE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_client_aggregations();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active leads view (not lost)
CREATE VIEW active_leads AS
SELECT * FROM leads
WHERE stage NOT IN ('lost', 'won')
ORDER BY created_at DESC;

-- Active deals view (not lost or won)
CREATE VIEW active_deals AS
SELECT * FROM deals
WHERE stage NOT IN ('lost', 'won')
ORDER BY expected_close_date ASC;

-- Won deals view
CREATE VIEW won_deals AS
SELECT * FROM deals
WHERE stage = 'won'
ORDER BY created_at DESC;

-- Deals with client information
CREATE VIEW deals_with_clients AS
SELECT
  d.*,
  c.contact AS client_contact,
  c.kyc_completed,
  c.total_deals AS client_total_deals,
  c.total_revenue AS client_total_revenue
FROM deals d
LEFT JOIN clients c ON d.client_id = c.id;

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - REMOVE IN PRODUCTION)
-- ============================================================================

-- Uncomment to insert sample data for testing

/*
INSERT INTO leads (contact, product_type, product, bank_name, stage, source) VALUES
(
  '{"full_name": "Ahmed Al Maktoum", "email": "ahmed@example.com", "phone": "+971501234567", "company_name": "Emirates Islamic Bank", "designation": "Senior Manager"}',
  'credit_card',
  'Platinum Credit Card',
  'Emirates Islamic Bank',
  'warm',
  'referral'
),
(
  '{"full_name": "Fatima Hassan", "email": "fatima@example.com", "phone": "+971521234567", "company_name": "Dubai Properties", "designation": "Director"}',
  'personal_loan',
  'Personal Loan',
  'Emirates NBD',
  'qualified',
  'website'
);

INSERT INTO clients (contact, kyc_completed) VALUES
(
  '{"full_name": "Mohammed Ali", "email": "mohammed@example.com", "phone": "+971501234567", "company_name": "ADNOC"}',
  true
);

INSERT INTO deals (title, contact, client_id, product_type, bank_applying, amount, stage, expected_close_date, probability) VALUES
(
  'Platinum Credit Card - Mohammed Ali',
  '{"full_name": "Mohammed Ali", "email": "mohammed@example.com", "phone": "+971501234567"}',
  (SELECT id FROM clients WHERE email = 'mohammed@example.com' LIMIT 1),
  'credit_card',
  'Emirates Islamic Bank',
  50000,
  'application_processing',
  CURRENT_DATE + INTERVAL '30 days',
  60
);
*/

-- ============================================================================
-- GRANT PERMISSIONS (ADJUST AS NEEDED)
-- ============================================================================

-- Example: Grant permissions to application user role
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO crm_app_user;
-- GRANT SELECT ON ALL VIEWS IN SCHEMA public TO crm_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO crm_app_user;
