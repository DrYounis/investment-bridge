'use server'

import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function submitIdea(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const ideaTitle = formData.get('ideaTitle') as string;
    const ideaDescription = formData.get('ideaDescription') as string;
    const problemSolved = formData.get('problemSolved') as string;
    const targetMarket = formData.get('targetMarket') as string;

    try {
        const supabase = await createClient();
        const { error: dbError } = await supabase
            .from('marfa_ideas')
            .insert({
                name,
                email,
                company,
                idea_title: ideaTitle,
                idea_description: ideaDescription,
                problem_solved: problemSolved || null,
                target_market: targetMarket || null,
                status: 'pending',
            });

        if (dbError) {
            logger.error('Database insert error:', dbError);
            return { success: false, error: 'Failed to save your idea. Please try again.' };
        }

        return { success: true };
    } catch (err) {
        logger.error('submitIdea error:', err);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
}
