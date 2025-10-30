-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own clients
CREATE POLICY "Users can view own clients" ON clients
FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own clients
CREATE POLICY "Users can insert own clients" ON clients
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own clients
CREATE POLICY "Users can update own clients" ON clients
FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own clients
CREATE POLICY "Users can delete own clients" ON clients
FOR DELETE USING (auth.uid() = user_id);
