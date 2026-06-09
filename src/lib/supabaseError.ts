import type { PostgrestError } from '@supabase/supabase-js'

export function logSupabaseError(context: string, error: PostgrestError | null | undefined) {
  if (!error) return
  console.error(`[Supabase:${context}]`, error.code, error.message, error.details)
}

export function logAuthError(context: string, error: { message: string } | null | undefined) {
  if (!error) return
  console.error(`[Auth:${context}]`, error.message)
}
