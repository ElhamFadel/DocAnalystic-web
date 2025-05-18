/*
  # Document Processing Pipeline Improvements

  1. New Tables
    - `document_quality_checks`: Stores quality control metrics for uploaded documents
    - `document_processing_batches`: Manages batch processing of documents
    - `document_processing_errors`: Tracks processing errors and retry attempts
    - `document_processing_queue`: Manages document processing queue with priorities
    - `document_analysis_results`: Stores extracted data and analysis results
    - `document_versions`: Tracks document versions and changes
    - `document_access_logs`: Audit trail for document access
    - `rate_limits`: Manages API rate limiting

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add audit logging
    - Add rate limiting

  3. Changes
    - Add quality control metrics
    - Add batch processing support
    - Add error tracking
    - Add version control
    - Add access logging
    - Add rate limiting
*/

-- Document Quality Checks
CREATE TABLE IF NOT EXISTS document_quality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  check_type text NOT NULL,
  status text NOT NULL,
  details jsonb,
  score double precision CHECK (score >= 0 AND score <= 1),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quality_checks_document_id ON document_quality_checks(document_id);

ALTER TABLE document_quality_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their quality checks" ON document_quality_checks
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_quality_checks.document_id
    AND documents.user_id = auth.uid()
  ));

-- Document Processing Batches
CREATE TABLE IF NOT EXISTS document_processing_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total_documents integer DEFAULT 0,
  processed_documents integer DEFAULT 0,
  failed_documents integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processing_batches_user_id ON document_processing_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_processing_batches_status ON document_processing_batches(status);

ALTER TABLE document_processing_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their processing batches" ON document_processing_batches
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Document Processing Errors
CREATE TABLE IF NOT EXISTS document_processing_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES document_processing_batches(id) ON DELETE CASCADE,
  error_type text NOT NULL,
  error_message text,
  error_details jsonb,
  retry_count integer DEFAULT 0,
  last_retry timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processing_errors_document_id ON document_processing_errors(document_id);
CREATE INDEX IF NOT EXISTS idx_processing_errors_batch_id ON document_processing_errors(batch_id);

ALTER TABLE document_processing_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their processing errors" ON document_processing_errors
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_processing_errors.document_id
    AND documents.user_id = auth.uid()
  ));

-- Document Processing Queue
CREATE TABLE IF NOT EXISTS document_processing_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  priority integer DEFAULT 0,
  attempts integer DEFAULT 0,
  last_attempt timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processing_queue_document_id ON document_processing_queue(document_id);
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON document_processing_queue(status);

ALTER TABLE document_processing_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their document processing queue" ON document_processing_queue
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_processing_queue.document_id
    AND documents.user_id = auth.uid()
  ));

-- Document Analysis Results
CREATE TABLE IF NOT EXISTS document_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  categories jsonb DEFAULT '[]',
  keywords jsonb DEFAULT '[]',
  entities jsonb DEFAULT '[]',
  summary text,
  confidence_score double precision CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_results_document_id ON document_analysis_results(document_id);

ALTER TABLE document_analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their document analysis results" ON document_analysis_results
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_analysis_results.document_id
    AND documents.user_id = auth.uid()
  ));

-- Document Versions
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  changes jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their document versions" ON document_versions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_versions.document_id
    AND documents.user_id = auth.uid()
  ));

-- Document Access Logs
CREATE TABLE IF NOT EXISTS document_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  access_type text NOT NULL,
  ip_address text,
  user_agent text,
  accessed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_access_logs_document_id ON document_access_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_user_id ON document_access_logs(user_id);

ALTER TABLE document_access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their document access logs" ON document_access_logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_access_logs.document_id
    AND documents.user_id = auth.uid()
  ));

-- Rate Limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  requests_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their rate limits" ON rate_limits
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Add update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_processing_queue_updated_at
  BEFORE UPDATE ON document_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_analysis_results_updated_at
  BEFORE UPDATE ON document_analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processing_batches_updated_at
  BEFORE UPDATE ON document_processing_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for document access logging
CREATE OR REPLACE FUNCTION update_document_access_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE documents
  SET last_accessed_at = NEW.accessed_at,
      access_count = access_count + 1
  WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER document_accessed
  AFTER INSERT ON document_access_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_document_access_timestamp();