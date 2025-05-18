/*
  # Document Processing Schema Updates

  1. New Tables
    - document_processing_queue
    - document_analysis_results
  
  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create document processing queue table
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

-- Create document analysis results table
CREATE TABLE IF NOT EXISTS document_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  categories jsonb DEFAULT '[]'::jsonb,
  keywords jsonb DEFAULT '[]'::jsonb,
  entities jsonb DEFAULT '[]'::jsonb,
  summary text,
  confidence_score float CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_processing_queue_status ON document_processing_queue(status);
CREATE INDEX idx_processing_queue_document_id ON document_processing_queue(document_id);
CREATE INDEX idx_analysis_results_document_id ON document_analysis_results(document_id);

-- Enable RLS
ALTER TABLE document_processing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their document processing queue"
  ON document_processing_queue
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_processing_queue.document_id
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their document analysis results"
  ON document_analysis_results
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE documents.id = document_analysis_results.document_id
      AND documents.user_id = auth.uid()
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_document_processing_queue_updated_at
  BEFORE UPDATE ON document_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_analysis_results_updated_at
  BEFORE UPDATE ON document_analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();