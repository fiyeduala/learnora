-- ─── LEARNORA MIGRATION — 2026-06 ────────────────────────────────────────────
-- Run the whole file in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Each statement uses IF NOT EXISTS / IF EXISTS guards so it's safe to re-run.

-- ────────────────────────────────────────────────────────────────────────────
-- 1. school_settings
--    Stores bank details + Paystack keys for each school.
--    Used by AdminFeeSetupPage (admin sets it) and SchoolFeesPage (parent reads it).
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.school_settings (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id                UUID UNIQUE NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  bank_name                TEXT,
  account_number           TEXT,
  account_name             TEXT,
  paystack_public_key      TEXT,
  paystack_secret_key      TEXT,
  paystack_subaccount_code TEXT,
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "school_settings_school_iso" ON public.school_settings;
CREATE POLICY "school_settings_school_iso" ON public.school_settings
  FOR ALL USING (is_super_admin() OR school_id = get_my_school_id());

-- ────────────────────────────────────────────────────────────────────────────
-- 2. fee_level_configs
--    Level + term fee templates set by admin (e.g. SS1 First Term → list of items).
--    Separate from fee_structures, which is the per-class-per-item catalog used by invoices.
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fee_level_configs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  level      TEXT NOT NULL,
  term       TEXT NOT NULL,
  items      JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (school_id, level, term)
);

ALTER TABLE public.fee_level_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fee_level_configs_school_iso" ON public.fee_level_configs;
CREATE POLICY "fee_level_configs_school_iso" ON public.fee_level_configs
  FOR ALL USING (is_super_admin() OR school_id = get_my_school_id());

-- ────────────────────────────────────────────────────────────────────────────
-- 3. invoices.paid_amount
--    FeeCollectionPage tracks how much has been paid against each invoice.
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(12,2) DEFAULT 0;

-- ────────────────────────────────────────────────────────────────────────────
-- 4. conversation_members.last_read_at
--    Needed for unread message counts (E6).
--    Mark as read by setting last_read_at = NOW() when a conversation is opened.
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.conversation_members
  ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMPTZ;

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Supabase Storage bucket for message attachments
--    Cannot be created via SQL — do this in the Supabase dashboard:
--    Storage > New bucket > Name: "message-attachments" > Public: OFF
--    Then add this RLS policy on the bucket objects:
--
--    CREATE POLICY "auth users can upload"
--      ON storage.objects FOR INSERT
--      TO authenticated
--      WITH CHECK (bucket_id = 'message-attachments');
--
--    CREATE POLICY "auth users can read"
--      ON storage.objects FOR SELECT
--      TO authenticated
--      USING (bucket_id = 'message-attachments');
-- ────────────────────────────────────────────────────────────────────────────
