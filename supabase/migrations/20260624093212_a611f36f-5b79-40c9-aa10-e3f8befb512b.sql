CREATE TABLE public.user_customizations (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  custom_vehicles jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_pedestrians jsonb NOT NULL DEFAULT '[]'::jsonb,
  armored_sprite text,
  asset_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_customizations TO authenticated;
GRANT ALL ON public.user_customizations TO service_role;

ALTER TABLE public.user_customizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own customizations"
  ON public.user_customizations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER user_customizations_set_updated_at
  BEFORE UPDATE ON public.user_customizations
  FOR EACH ROW EXECUTE FUNCTION public.tt_set_updated_at();