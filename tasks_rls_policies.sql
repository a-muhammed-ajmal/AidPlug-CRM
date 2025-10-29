-- Enable RLS on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own tasks
CREATE POLICY "Users can view own tasks" ON tasks
FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own tasks
CREATE POLICY "Users can insert own tasks" ON tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own tasks
CREATE POLICY "Users can update own tasks" ON tasks
FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own tasks
CREATE POLICY "Users can delete own tasks" ON tasks
FOR DELETE USING (auth.uid() = user_id);
