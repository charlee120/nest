CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id  TEXT        NOT NULL,
  answers     JSONB       NOT NULL,
  result      JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_responses"
  ON public.assessment_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_responses"
  ON public.assessment_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
