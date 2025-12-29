import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For server-side reads, anon key is OK (as long as RLS policies allow read).
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel."
    );
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
});
