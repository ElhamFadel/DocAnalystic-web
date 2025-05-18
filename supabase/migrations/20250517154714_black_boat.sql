/*
  # Enhanced Document Processing Features

  1. New Tables
    - document_processing_batches
    - document_processing_errors
    - document_quality_checks
    - document_manual_reviews
    
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    
  3. Changes
    - Add batch processing support
    - Add error tracking
    - Add quality validation
    - Add manual review workflow
*/

-- Create batch processing table
CREATE TABLE IF NOT EXISTS document_processing_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total_documents integer DEFAULT 0,
  processed_documents integer DEFAULT 0,
  failed_documents integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create processing errors table
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

-- Create quality checks table
CREATE TABLE IF NOT EXISTS document_quality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  check_type text NOT NULL,
  status text NOT NULL,
  details jsonb,
  score float CHECK (score >= 0 AND score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create manual reviews table
CREATE TABLE IF NOT EXISTS document_manual_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  comments text,
  changes jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_processing_batches_user_id ON document_processing_batches(user_id);
CREATE INDEX idx_processing_batches_status ON document_processing_batches(status);
CREATE INDEX idx_processing_errors_document_id ON document_processing_errors(document_id);
CREATE INDEX idx_processing_errors_batch_id ON document_processing_errors(batch_id);
CREATE INDEX idx_quality_checks_document_id ON document_quality_checks(document_id);
CREATE INDEX idx_manual_reviews_document_id ON document_manual_reviews(document_id);
CREATE INDEX idx_manual_reviews_reviewer_id ON document_manual_reviews(reviewer_id);

-- Enable RLS
ALTER TABLE document_processing_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_manual_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their processing batches"
  ON document_processing_batches FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their processing errors"
  ON document_processing_errors FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_processing_errors.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their quality checks"
  ON document_quality_checks FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_quality_checks.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their manual reviews"
  ON document_manual_reviews FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_manual_reviews.document_id
    AND documents.user_id = auth.uid()
  ));

-- Create triggers
CREATE TRIGGER update_processing_batches_updated_at
  BEFORE UPDATE ON document_processing_batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manual_reviews_updated_at
  BEFORE UPDATE ON document_manual_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();