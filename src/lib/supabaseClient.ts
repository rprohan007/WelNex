import { createClient } from '@supabase/supabase-js';

// Environment variables from Vite (import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Checks whether valid Supabase environment variables have been configured.
 */
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

// Fallback dummy credentials to prevent createClient from throwing an error during startup/SSG
const effectiveUrl = isSupabaseConfigured
  ? supabaseUrl!
  : 'https://placeholder-project.supabase.co';

const effectiveKey = isSupabaseConfigured
  ? supabaseAnonKey!
  : 'placeholder-anon-key';

/**
 * Central Supabase Client instance for WelNex platform.
 * Used for querying investments, academy curriculum, waitlist leads, and contact inquiries.
 */
export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.info(
    '[WelNex Supabase] Supabase credentials not detected or using placeholder. ' +
    'The application is running in resilient local cache/mock mode. ' +
    'To connect your live database, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}
