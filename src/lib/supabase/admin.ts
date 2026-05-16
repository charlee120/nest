import { createClient } from '@supabase/supabase-js'

// SERVER ONLY — bypasses RLS — never import in browser code
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}