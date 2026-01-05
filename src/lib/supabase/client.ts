// lib/supabase/client.ts
// Client-side Supabase client (for browser)

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: true,
                storageKey: 'max-phone-repair-auth',
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
            cookieOptions: {
                name: 'max-phone-repair-auth',
                maxAge: 86400, // 1 day in seconds
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    )
}
