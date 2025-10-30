-- Remove the unused estimated_duration column from tasks table
ALTER TABLE tasks DROP COLUMN IF EXISTS estimated_duration;
