'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

export async function getInvestorRequests() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('investor_requests')
        .select(`
      *,
      profiles:investor_id (full_name, email)
    `)
        .order('requested_at', { ascending: false });

    if (error) {
        // In production, log to Sentry
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
        // In production, log to Sentry
        throw new Error("Invalid status update parameters.");
    }

    const { error } = await supabase
        .from('investor_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

    if (error) {
        // In production, log to Sentry
        throw new Error('Failed to update request status.');
    }

    revalidatePath('/admin');
}
