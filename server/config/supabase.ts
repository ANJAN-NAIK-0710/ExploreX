import { ENV } from './env';

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

/**
 * Normalized Supabase configuration.
 * Resolves both SUPABASE_ANON_KEY and SUPABASE_API_KEY naming conventions.
 */
export const supabaseConfig: SupabaseConfig = {
  url: ENV.SUPABASE_URL || null,
  anonKey: ENV.SUPABASE_ANON_KEY || null,
  isConfigured: Boolean(
    ENV.SUPABASE_URL && 
    ENV.SUPABASE_ANON_KEY && 
    !ENV.SUPABASE_URL.includes('your-project-id')
  ),
};

/**
 * Helper to obtain authenticated Supabase REST headers for external requests/syncs.
 */
export function getSupabaseHeaders(): Record<string, string> | null {
  if (!supabaseConfig.isConfigured || !supabaseConfig.anonKey) {
    return null;
  }
  return {
    'apikey': supabaseConfig.anonKey,
    'Authorization': `Bearer ${supabaseConfig.anonKey}`,
    'Content-Type': 'application/json',
  };
}
