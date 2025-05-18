-- Add rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  requests_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add index for rate limiting
CREATE INDEX idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limits
CREATE POLICY "Users can manage their rate limits"
  ON rate_limits FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Add function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_endpoint text,
  p_max_requests integer,
  p_window_seconds integer
) RETURNS boolean AS $$
DECLARE
  v_count integer;
  v_window_start timestamptz;
BEGIN
  -- Get the start of the current window
  SELECT window_start, requests_count
  INTO v_window_start, v_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start > now() - (p_window_seconds || ' seconds')::interval
  ORDER BY window_start DESC
  LIMIT 1;

  -- If no window exists or window has expired, create new window
  IF v_window_start IS NULL OR v_window_start <= now() - (p_window_seconds || ' seconds')::interval THEN
    INSERT INTO rate_limits (user_id, endpoint, requests_count, window_start)
    VALUES (p_user_id, p_endpoint, 1, now());
    RETURN true;
  END IF;

  -- Check if limit exceeded
  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  -- Increment counter
  UPDATE rate_limits
  SET requests_count = requests_count + 1
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start = v_window_start;

  RETURN true;
END;
$$ LANGUAGE plpgsql;