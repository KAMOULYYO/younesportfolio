import { createClient } from '@supabase/supabase-js';

// URL et clé « anon » sont publiques par nature : la sécurité repose sur les
// règles RLS de supabase/setup.sql (lecture publique, écriture admin uniquement).
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
  { auth: { persistSession: true, autoRefreshToken: true } },
);

export const PORTFOLIO_ROW_ID = 'main';
export const BUCKET = 'portfolio';
export { SUPABASE_ANON_KEY };
