'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

export async function getInvestorRequests() {
    const supabase = await createClient();

    // Fetch requests and join with the profiles table to get investor details.
    // Note: Adjust 'full_name' and 'email' if your profiles table uses different column names.
    const { data, error } = await supabase
        .from('investor_requests')
        .select(`
      *,
      profiles:investor_id (full_name, email)
    `)
        .order('requested_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin requests:', error);
        return [];
    }

    return data;
}

const UpdateStatusSchema = z.object({
    requestId: z.string().uuid("Invalid Request ID"),
    newStatus: z.enum(['pending', 'under_review', 'contacted', 'closed']),
});

export async function updateRequestStatus(requestId: string, newStatus: string) {
    const supabase = await createClient();

    const validation = UpdateStatusSchema.safeParse({ requestId, newStatus });

    if (!validation.success) {
        console.error("Validation error:", validation.error.flatten());
        throw new Error("Invalid status update parameters.");
    }

    const { error } = await supabase
        .from('investor_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

    if (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update request status.');
    }

    // Refresh the admin page to show the new status
    revalidatePath('/admin');
}
