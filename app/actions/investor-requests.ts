'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function requestProjectDetails(formData: FormData) {
    const supabase = await createClient();

    const repoName = formData.get('repoName') as string;
    const repoUrl = formData.get('repoUrl') as string;

    // Get the logged-in investor
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Authentication required to request details.');
    }

    // Record the investor's interest in your database
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
        console.error('Error logging request:', error);
        throw new Error('Failed to submit request.');
    }

    // Revalidate the page to show success state (if you implement one)
    revalidatePath('/investor');
}
