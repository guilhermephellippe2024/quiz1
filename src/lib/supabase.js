import { createClient } from '@supabase/supabase-js';

// Public browser credentials. Database RLS controls access; never use a secret/service-role key here.
// Defaults keep production builds functional when the host has no Vite environment variables.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://qxoejihbgjbmizleisgx.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_z_pqdpfGREu9D1jXd6feLA_0bpJqeNs';
export const supabaseConfigured = Boolean(url && key);
export const supabase = supabaseConfigured ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
}) : null;
