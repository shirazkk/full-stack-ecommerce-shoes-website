import { createBrowserClient } from '@supabase/ssr';

export function supabaseAdmin() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_KEY!
    );
}
