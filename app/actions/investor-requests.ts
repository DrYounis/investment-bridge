'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function requestProjectDetails(formData: FormData) {
    const supabase = await createClient();

    const repoName = formData.get('repoName') as string;
    const repoUrl = formData.get('repoUrl') as string;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Authentication required to request details.');
    }

    const { error } = await supabase
        .from('investor_requests')
        .insert({
            investor_id: user.id,
            project_name: repoName,
            project_url: repoUrl,
            status: 'pending',
            requested_at: new Date().toISOString()
        });

    if (error) {
        // In production, log to Sentry
        throw new Error('Failed to submit request.');
    }

    revalidatePath('/investor');
}
