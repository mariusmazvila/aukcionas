import { createClient } from '@supabase/supabase-js';

// Public anon key — safe to ship to the browser. Row Level Security on the
// `listings` table allows read-only access; writes are blocked for anon.
const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    'Missing PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.'
  );
}

export const supabase = createClient(url, anon);
