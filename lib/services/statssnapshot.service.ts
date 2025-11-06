// import { supabaseAdmin } from "../supabase/supabaseAdmin";

// export const previous = await supabaseAdmin()
//     .from("stats_snapshots")
//     .select("*")
//     .order("date", { ascending: false })
//     .limit(1)
//     .single();

// export function calculateChange(current: number, previous: number | null) {
//     if (previous === null || previous === 0) return 0;
//     return ((current - previous) / previous) * 100;
// }
