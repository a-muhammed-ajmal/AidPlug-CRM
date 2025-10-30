-- Remove unused columns from clients table
ALTER TABLE clients DROP COLUMN IF EXISTS client_since;
ALTER TABLE clients DROP COLUMN IF EXISTS last_interaction;
ALTER TABLE clients DROP COLUMN IF EXISTS ltv_ratio;
ALTER TABLE clients DROP COLUMN IF EXISTS risk_category;
ALTER TABLE clients DROP COLUMN IF EXISTS total_loan_amount;
ALTER TABLE clients DROP COLUMN IF EXISTS visa_status;
ALTER TABLE clients DROP COLUMN IF EXISTS payment_history;
ALTER TABLE clients DROP COLUMN IF EXISTS products;
