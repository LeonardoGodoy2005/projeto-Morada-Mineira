// =============================================
// CLIENTE SUPABASE
// =============================================
// Configure suas credenciais do Supabase no .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
// =============================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Flag para saber se Supabase está configurado
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Criar cliente Supabase (ou null se não configurado)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export default supabase;
