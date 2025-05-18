/*
  # Improve search functionality

  1. Changes
    - Add GIN index for full-text search
    - Add trigger for automatic search vector updates
    - Add function to generate search vector
    - Add columns for search optimization

  2. Indexes
    - Full-text search index on search_vector
    - Additional indexes for common search filters

  3. Security
    - Maintain existing RLS policies
*/

-- Add search vector column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'search_vector'
  ) THEN
    ALTER TABLE documents ADD COLUMN search_vector tsvector;
  END IF;
END $$;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS documents_search_vector_idx ON documents USING gin(search_vector);

-- Create function to generate search vector
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updates
DROP TRIGGER IF EXISTS documents_search_vector_trigger ON documents;
CREATE TRIGGER documents_search_vector_trigger
  BEFORE INSERT OR UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION documents_search_vector_update();

-- Update existing documents
UPDATE documents SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'B');