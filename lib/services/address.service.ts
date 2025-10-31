
import { Address } from "@/types";
import { createClient } from "../supabase/client";

/**
 * Insert a new address for the authenticated user.
 */
export async function insertAddress(addressData: Address) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("addresses")
        .insert([{ ...addressData, user_id: user.id }])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Fetch all addresses of the authenticated user.
 */
export async function getAddresses() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Update a specific address of the authenticated user.
 */
export async function updateAddress(id: string, updates: any) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from("addresses")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Delete a specific address belonging to the authenticated user.
 */
export async function deleteAddress(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return { success: true };
}
