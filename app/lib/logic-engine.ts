
import { supabase } from './supabase';

// --- Types ---
export interface IdeaSubmission {
    userId?: string; // Optional for now (guest mode)
    answers: Record<string, any>; // The raw answers from IdeaValidator
}

export interface ValidationResult {
    id?: string;
    score: number;
    status: 'pass' | 'refine';
    feedback: string[];
    breakdown: {
        market: number;
        tech: number;
        revenue: number;
    };
}

// --- The Logic Engine ---

export async function processIdeaValidation(submission: IdeaSubmission): Promise<ValidationResult> {
    const { answers } = submission;
    let totalScore = 0;
    let maxScore = 0;

    // Breakdown scores
    let marketScore = 0;
    let techScore = 0;
    let revenueScore = 0;

    const feedback: string[] = [];

    // 1. Scoring Logic (Mirroring Frontend)
    Object.values(answers).forEach((ans: any) => {
        // Assuming structure matches the frontend options
        // Ideally we fetch questions/scores from DB or config to be robust
        const score = ans.score || 0;
        totalScore += score;
        maxScore += 3; // Approx max per question
    });

    // Calculate percentage
    // Start with base logic, can be refined with specific weights
    const percentage = (totalScore / (Object.keys(answers).length * 3)) * 100;

    // 2. Risk Detection (Heuristics)

    // Market Risk
    if (answers['q2']?.id === 'q2-4' && answers['q4']?.id === 'q4-2') {
        feedback.push("مخاطرة سوقية عالية: ابتكار جديد كلياً على نطاق عالمي.");
    }

    // Tech Risk
    if (answers['q5']?.id === 'q5-3' && answers['q7']?.id === 'q7-3') {
        feedback.push("مخاطرة تقنية: تصنيع أجهزة (Hardware) بدون خبرة تقنية داخلية.");
    }

    // Revenue Risk
    if (answers['q9']?.id === 'q9-4') {
        feedback.push("نموذج الربح: الاعتماد الكلي على الإعلانات غير مستدام في البداية.");
    }

    const status = (percentage > 60 && feedback.length === 0) ? 'pass' : 'refine';

    let savedId: string | undefined;

    // 3. Database Persistence
    try {
        const { data, error } = await supabase
            .from('marfa_ideas')
            .insert([
                {
                    user_id: submission.userId || null,
                    market_score: marketScore, // These need to be properly aggregated from specific questions
                    tech_score: techScore,
                    revenue_score: revenueScore,
                    total_score: Math.round(percentage),
                    status: status === 'pass' ? 'validated' : 'draft',
                    description: JSON.stringify(feedback) // Storing feedback as temporary description or separate field
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Error saving idea:", error);
        } else {
            savedId = data?.id;
        }
    } catch (err) {
        console.error("Supabase connection error:", err);
    }

    return {
        id: savedId,
        score: Math.round(percentage),
        status,
        feedback,
        breakdown: { market: marketScore, tech: techScore, revenue: revenueScore }
    };
}

export async function saveMVPBlueprint(ideaId: string, features: any[]) {
    // Save features to marfa_mvp_features
    const records = features.map(f => ({
        idea_id: ideaId,
        feature_name: f.name,
        value_score: f.value,
        complexity_score: f.complexity,
        category: f.category
    }));

    const { error } = await supabase.from('marfa_mvp_features').insert(records);
    return { success: !error, error };
}

export async function triggerInvestorMatch(ideaId: string) {
    // 1. Check if idea score > 80 (A-Grade)
    const { data: idea } = await supabase.from('marfa_ideas').select('total_score').eq('id', ideaId).single();

    if (idea && idea.total_score > 80) {
        // 2. "Simulate" sending to investors
        console.log(`[LogicEngine] Idea ${ideaId} is HOT! Triggering investor alerts...`);

        // In a real app, we would insert into a 'notifications' table or send emails here
        return { matched: true, message: "Idea sent to matching investors" };
    }

    return { matched: false, message: "Score too low for auto-match" };
}
