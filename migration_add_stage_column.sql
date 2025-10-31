-- Add stage column to leads table
ALTER TABLE leads ADD COLUMN stage TEXT CHECK (stage IN ('warm', 'qualified', 'appointment_booked'));

-- Update existing qualification_status values to stage
UPDATE leads SET stage = qualification_status WHERE qualification_status IS NOT NULL;

-- Drop the old qualification_status column
ALTER TABLE leads DROP COLUMN qualification_status;