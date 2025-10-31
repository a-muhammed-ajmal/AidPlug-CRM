-- Enable RLS on leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own leads
CREATE POLICY "Users can view own leads" ON leads
FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own leads
CREATE POLICY "Users can insert own leads" ON leads
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own leads
CREATE POLICY "Users can update own leads" ON leads
FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own leads
CREATE POLICY "Users can delete own leads" ON leads
FOR DELETE USING (auth.uid() = user_id);