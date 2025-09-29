-- Allow anonymous submissions to founders_list
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'founders_list' 
      AND policyname = 'Anyone can submit founders list'
  ) THEN
    CREATE POLICY "Anyone can submit founders list"
    ON public.founders_list
    FOR INSERT
    TO public
    WITH CHECK (true);
  END IF;
END $$;