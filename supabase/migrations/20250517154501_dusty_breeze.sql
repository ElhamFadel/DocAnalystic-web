-- Add security and audit columns to documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS file_hash text,
ADD COLUMN IF NOT EXISTS encryption_key_id uuid,
ADD COLUMN IF NOT EXISTS is_encrypted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_watermark boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_accessed_at timestamptz,
ADD COLUMN IF NOT EXISTS access_count integer DEFAULT 0;

-- Create document access logs table
CREATE TABLE IF NOT EXISTS document_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type text NOT NULL,
  ip_address text,
  user_agent text,
  accessed_at timestamptz DEFAULT now()
);

-- Create document versions table
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  changes jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_document_access_logs_document_id 
  ON document_access_logs(document_id);
CREATE INDEX idx_document_access_logs_user_id 
  ON document_access_logs(user_id);
CREATE INDEX idx_document_versions_document_id 
  ON document_versions(document_id);

-- Enable RLS
ALTER TABLE document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their document access logs"
  ON document_access_logs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_access_logs.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their document versions"
  ON document_versions FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_versions.document_id
    AND documents.user_id = auth.uid()
  ));

-- Create function to update last_accessed_at
CREATE OR REPLACE FUNCTION update_document_access_timestamp()
RETURNS trigger AS $$
BEGIN
  UPDATE documents
  SET 
    last_accessed_at = now(),
    access_count = access_count + 1
  WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for access logging
CREATE TRIGGER document_accessed
  AFTER INSERT ON document_access_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_document_access_timestamp();