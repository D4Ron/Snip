import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set (see .env.example)');
}

// Clients only talk to the `api_v1` schema, never to `public` tables directly.
export const supabase = createClient(url, anonKey, { db: { schema: 'api_v1' } });
