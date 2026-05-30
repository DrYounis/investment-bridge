'use server';

import { processIdeaValidation, saveMVPBlueprint, triggerInvestorMatch } from '../lib/logic-engine';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Submit idea for validation and scoring
 * @param answers - Quiz answers from user
 * @returns Validation result with scores
 */
export async function submitIdea(answers: Record<string, unknown>) {
  const result = await processIdeaValidation({ answers });
  return result;
}

interface DraftData {
  title: string;
  sector: string;
  description: string;
  data?: Record<string, unknown>;
}

/**
 * Save or update idea draft
 * @param id - Existing draft ID or null for new
 * @param data - Draft content
 * @returns Result with new ID or success status
 */
export async function saveDraft(id: string | null, data: DraftData) {
  const supabase = await createClient();

  if (!id) {
    try {
      const { data: newIdea, error } = await supabase
        .from('marfa_ideas')
        .insert([{
          title: data.title,
          sector: data.sector,
          description: data.description,
          data: data,
          status: 'draft'
        }])
        .select()
        .maybeSingle();

      if (error) {
        return { id: null, success: false, error: 'Failed to create draft' };
      }
      return { id: newIdea?.id ?? null, success: !!newIdea };
    } catch (err) {
      logger.error('Error saving draft:', err);
      return { id: null, success: false, error: 'Failed to create draft' };
    }
  } else {
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

    if (error) {
      return { id, success: false, error: 'Failed to update draft' };
    }
    return { id, success: true };
  }
}

interface Feature {
  id: string;
  name: string;
  value?: number;
  complexity?: number;
  category?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Submit MVP with features for scoring
 * @param ideaId - Idea UUID
 * @param features - Array of features
 * @returns MVP scoring result
 */
export async function submitMVP(ideaId: string, features: Feature[]) {
  const result = await saveMVPBlueprint(ideaId, features);
  return result;
}

/**
 * Check for investor matches
 * @param ideaId - Idea UUID
 * @returns Match result
 */
export async function checkInvestorMatch(ideaId: string) {
  const result = await triggerInvestorMatch(ideaId);
  return result;
}
