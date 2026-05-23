'use server'

import { createClient } from '@/lib/supabase/server';

export async function submitMeetingRequest(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const preferredDate = formData.get('preferredDate') as string;
    const preferredTime = formData.get('preferredTime') as string;
    const message = formData.get('message') as string;

    try {
        const supabase = await createClient();
        const { error: dbError } = await supabase
            .from('marfa_meetings')
            .insert({
                name,
                email,
                company,
                preferred_date: preferredDate,
                preferred_time: preferredTime,
                message: message || null,
                status: 'pending',
            });

        if (dbError) {
            console.error('Database insert error:', dbError);
            return { success: false, error: 'Failed to save your meeting request. Please try again.' };
        }

        return { success: true };
    } catch (err) {
        console.error('submitMeetingRequest error:', err);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
}
