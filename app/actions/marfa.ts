'use server';

import { processIdeaValidation, saveMVPBlueprint, triggerInvestorMatch } from '../lib/logic-engine';
import { supabase } from '../lib/supabase';

export async function submitIdea(answers: any) {
    // In a real app, we get userId from session
    // const session = await getSession();
    // const userId = session?.user?.id;

    // For now, pass anonymous
    const result = await processIdeaValidation({ answers });
    return result;
}

export async function saveDraft(id: string | null, data: any) {
    // If no ID, create new draft
    if (!id) {
        const { data: newIdea, error } = await supabase
            .from('marfa_ideas')
            .insert([{
                title: data.title,
                sector: data.sector,
                description: data.description,
                data: data, // Store full wizard payload
                status: 'draft'
            }])
            .select()
            .single();

        if (error) console.error("Create Draft Error:", error);
        return { id: newIdea?.id, success: !!newIdea };
    } else {
        // Update existing
        const { error } = await supabase
            .from('marfa_ideas')
            .update({
                title: data.title,
                sector: data.sector,
                description: data.description,
                data: data,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) console.error("Update Draft Error:", error);
        return { id, success: !error };
    }
}

export async function submitMVP(ideaId: string, features: any[]) {
    const result = await saveMVPBlueprint(ideaId, features);
    return result;
}

export async function checkInvestorMatch(ideaId: string) {
    const result = await triggerInvestorMatch(ideaId);
    return result;
}
