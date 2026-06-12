import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.warn('Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY — Supabase queries will return empty.');
}

export const supabase = url && anon ? createClient(url, anon) : null;
