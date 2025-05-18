/*
  # Create user activity logs table

  1. New Tables
    - `user_activity_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users.id)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_activity_logs` table
    - Add policies for authenticated users to read their own logs
*/

CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);

ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own activity logs"
  ON user_activity_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity logs"
  ON user_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);