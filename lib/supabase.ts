import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl =
  rawSupabaseUrl && /^https?:\/\//.test(rawSupabaseUrl)
    ? rawSupabaseUrl
    : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawSupabaseAnonKey?.length
  ? rawSupabaseAnonKey
  : 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

