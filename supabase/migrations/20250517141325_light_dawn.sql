/*
  # Document storage and management setup
  
  1. New Tables
    - `documents` table for storing document metadata
    - `document_categories` junction table for document categorization
    
  2. Security
    - Enable RLS on all tables
    - Add policies for document access control
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_type text,
  file_size bigint,
  content text,
  confidence_score double precision,
  url text,
  thumbnail_url text,
  upload_date timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  search_vector tsvector
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent uuid REFERENCES categories(id) ON DELETE SET NULL
);

-- Create document_categories junction table
CREATE TABLE IF NOT EXISTS document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(document_id, category_id)
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;

-- Document policies
CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Category policies
CREATE POLICY "All users can read categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Document categories policies
CREATE POLICY "Users can manage document categories for their documents"
  ON document_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_categories.document_id
    AND documents.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_categories.document_id
    AND documents.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_document_id ON document_categories(document_id);
CREATE INDEX IF NOT EXISTS idx_document_categories_category_id ON document_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent);
CREATE INDEX IF NOT EXISTS documents_search_vector_idx ON documents USING gin(search_vector);

-- Add document search vector update trigger
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_search_vector_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION documents_search_vector_update();