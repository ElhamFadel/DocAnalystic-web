/*
  # Insert default categories

  This migration adds the initial set of categories for document classification.

  1. Categories Added:
    - Financial Documents
    - Legal Documents
    - Technical Documentation
    - Marketing Materials
    - Human Resources
    - Research & Development
    Each with relevant subcategories

  2. Structure:
    - Top-level categories
    - Subcategories with parent references
*/

-- Insert top-level categories
INSERT INTO categories (id, name) VALUES
  ('cat_financial', 'Financial'),
  ('cat_legal', 'Legal'),
  ('cat_technical', 'Technical'),
  ('cat_marketing', 'Marketing'),
  ('cat_hr', 'Human Resources'),
  ('cat_research', 'Research')
ON CONFLICT (id) DO NOTHING;

-- Insert subcategories
INSERT INTO categories (id, name, parent_id) VALUES
  -- Financial subcategories
  ('cat_financial_reports', 'Financial Reports', 'cat_financial'),
  ('cat_invoices', 'Invoices', 'cat_financial'),
  ('cat_budgets', 'Budgets', 'cat_financial'),
  ('cat_tax', 'Tax Documents', 'cat_financial'),

  -- Legal subcategories
  ('cat_contracts', 'Contracts', 'cat_legal'),
  ('cat_policies', 'Policies', 'cat_legal'),
  ('cat_compliance', 'Compliance', 'cat_legal'),
  ('cat_licenses', 'Licenses', 'cat_legal'),

  -- Technical subcategories
  ('cat_specifications', 'Specifications', 'cat_technical'),
  ('cat_architecture', 'Architecture', 'cat_technical'),
  ('cat_user_guides', 'User Guides', 'cat_technical'),
  ('cat_api_docs', 'API Documentation', 'cat_technical'),

  -- Marketing subcategories
  ('cat_campaigns', 'Campaigns', 'cat_marketing'),
  ('cat_branding', 'Branding', 'cat_marketing'),
  ('cat_market_research', 'Market Research', 'cat_marketing'),
  ('cat_presentations', 'Presentations', 'cat_marketing'),

  -- HR subcategories
  ('cat_policies_hr', 'HR Policies', 'cat_hr'),
  ('cat_training', 'Training', 'cat_hr'),
  ('cat_recruitment', 'Recruitment', 'cat_hr'),
  ('cat_benefits', 'Benefits', 'cat_hr'),

  -- Research subcategories
  ('cat_studies', 'Studies', 'cat_research'),
  ('cat_analysis', 'Analysis', 'cat_research'),
  ('cat_proposals', 'Proposals', 'cat_research'),
  ('cat_publications', 'Publications', 'cat_research')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);