/*
  # Add Full-Text Search Capabilities

  1. Changes
    - Add text search vectors for documents table
    - Create function to update search vectors
    - Create trigger to automatically update search vectors
    - Add GIN index for fast text search

  2. Details
    - Search vector combines title and content
    - Weights: title (A), content (B)
    - Automatic updates on insert/update
*/

-- Add text search vector column
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search vector
CREATE OR REPLACE FUNCTION documents_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS documents_search_vector_trigger ON documents;
CREATE TRIGGER documents_search_vector_trigger
  BEFORE INSERT OR UPDATE
  ON documents
  FOR EACH ROW
  EXECUTE FUNCTION documents_search_vector_update();

-- Add GIN index for fast text search
CREATE INDEX IF NOT EXISTS documents_search_vector_idx
  ON documents
  USING GIN (search_vector);

-- Update existing documents
UPDATE documents
SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(content, '')), 'B');