/*
  # Enhanced Document Processing Support

  1. New Tables
    - document_metadata: Stores extracted metadata
    - document_entities: Stores named entities
    - document_topics: Stores topic modeling results
    - document_tables: Stores extracted tables
    - document_references: Stores extracted references

  2. Changes
    - Add new columns to documents table
    - Update processing queue table
    - Add new indexes and triggers

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Add new columns to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS processed_pages integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_pages integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_status jsonb DEFAULT '{"status": "pending", "progress": 0, "details": null}'::jsonb,
ADD COLUMN IF NOT EXISTS extracted_metadata jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ocr_confidence float DEFAULT 0;

-- Create document_metadata table
CREATE TABLE IF NOT EXISTS document_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  metadata_type text NOT NULL,
  content jsonb NOT NULL,
  confidence_score float CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_entities table
CREATE TABLE IF NOT EXISTS document_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_text text NOT NULL,
  start_pos integer,
  end_pos integer,
  confidence_score float CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create document_topics table
CREATE TABLE IF NOT EXISTS document_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  topic_name text NOT NULL,
  relevance_score float CHECK (relevance_score >= 0 AND relevance_score <= 1),
  keywords text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create document_tables table
CREATE TABLE IF NOT EXISTS document_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  table_data jsonb NOT NULL,
  extraction_confidence float CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create document_references table
CREATE TABLE IF NOT EXISTS document_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  reference_type text NOT NULL,
  reference_text text NOT NULL,
  page_number integer,
  confidence_score float CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_metadata_document_id ON document_metadata(document_id);
CREATE INDEX IF NOT EXISTS idx_document_metadata_type ON document_metadata(metadata_type);
CREATE INDEX IF NOT EXISTS idx_document_entities_document_id ON document_entities(document_id);
CREATE INDEX IF NOT EXISTS idx_document_entities_type ON document_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_document_topics_document_id ON document_topics(document_id);
CREATE INDEX IF NOT EXISTS idx_document_tables_document_id ON document_tables(document_id);
CREATE INDEX IF NOT EXISTS idx_document_references_document_id ON document_references(document_id);

-- Enable RLS
ALTER TABLE document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_references ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their document metadata"
  ON document_metadata FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_metadata.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their document entities"
  ON document_entities FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_entities.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their document topics"
  ON document_topics FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_topics.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their document tables"
  ON document_tables FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_tables.document_id
    AND documents.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their document references"
  ON document_references FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_references.document_id
    AND documents.user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_document_metadata_updated_at
  BEFORE UPDATE ON document_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();