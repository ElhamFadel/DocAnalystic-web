/*
  # Add test user

  1. Changes
    - Add a test user with email and password
    - Email: admin@docanalytics.com
    - Password: docanalytics123
*/

-- Create test user with a secure password
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@docanalytics.com',
  crypt('docanalytics123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;