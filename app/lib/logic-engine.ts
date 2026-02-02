import { supabase } from './supabase';

// --- Advanced Marfa Scoring Algorithm Types ---

export type GeographicScope = 'Local' | 'Regional' | 'National' | 'International';
export type CompetitionLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type ComplexityLevel = 'Low' | 'Medium' | 'High';
export type ExecutionCapability = 'Weak' | 'Average' | 'Strong';
export type MVPStatus = 'Concept' | 'Design' | 'Prototype' | 'Live';

export interface MarfaScoringInput {
    market: {
        tam_value?: number; // Total Addressable Market in SAR
        geographic_scope: GeographicScope;
        competition_level: CompetitionLevel;
        value_proposition_unique: boolean;
        is_saturated?: boolean;
    };
    financial: {
        roi_percent: number;
        payback_period_months: number;
        profit_margin_percent: number;
    };
    technical: {
        complexity_score: ComplexityLevel;
        has_technical_team: boolean;
    };
    team: {
        execution_strategy: ExecutionCapability;
        mvp_readiness: MVPStatus;
    };
}

export interface MarfaScoreOutput {
    total_score: number; // 0-100
    pillar_scores: {
        market: number;
        financial: number;
        technical: number;
        team: number;
    };
    investment_tier: 'Seed' | 'Growth' | 'Refine';
    logic_notes: string;
}

// --- The Marfa Logic Engine ---

/**
 * Calculates the "Readiness Score" for a startup idea based on the Marfa Algorithm.
 * 
 * Weights:
 * 1. Market Demand (40%)
 * 2. Financial Viability (30%)
 * 3. Technical Feasibility (20%)
 * 4. Team/Strategy (10%)
 */
export function calculateMarfaScore(input: MarfaScoringInput): MarfaScoreOutput {
    const logic_notes_arr: string[] = [];

    // --- 1. Market Demand (40%) ---
    // Factors: TAM, Geographic Scope, Competition

    // TAM Score (0-10) - Heuristic for KSA/Hail Regional Hubs
    const tam = input.market.tam_value || 0;
    let tam_score = 0;
    if (tam < 500000) tam_score = 4;        // Small local niche
    else if (tam < 2000000) tam_score = 7;  // Viable regional
    else if (tam < 10000000) tam_score = 9; // Strong national
    else tam_score = 10;                    // Unicorn potential

    // Competition Score (0-10)
    let comp_score = 0;
    switch (input.market.competition_level) {
        case 'Low': comp_score = 10; break;
        case 'Moderate': comp_score = 7; break;
        case 'High': comp_score = 4; break;
        case 'Critical': comp_score = 1; break;
    }

    // Geographic Scope Score (0-10) - Preference for "Local Market Gap" vs Saturation
    // If Local + Low Competition = High Value
    let geo_score = 5;
    if (input.market.geographic_scope === 'Local') {
        if (input.market.competition_level === 'Low') {
            geo_score = 10; // Perfect local gap match
            logic_notes_arr.push("Strong local market gap identified.");
        } else if (input.market.competition_level === 'High' || input.market.competition_level === 'Critical') {
            geo_score = 2; // Saturated local market
            logic_notes_arr.push("Risk: Local market appears saturated.");
        } else {
            geo_score = 6;
        }
    } else {
        // Broad scope is generally good if supported by Team/Tech, but treated via Bonus mostly
        geo_score = 7;
    }

    // Calculate Market Pillar (Target 40 points)
    // Avg of components * 4 (since max is 10 for each, we want max 40 total? No, weighting.)
    // Let's treat TAM (30%), Comp (40%), Geo (30%) within the pillar
    const market_raw = (tam_score * 0.3) + (comp_score * 0.4) + (geo_score * 0.3); // 0-10 scale
    const market_total = market_raw * 4; // Scale to 40


    // --- 2. Financial Viability (30%) ---
    // Factors: ROI, Payback, Margin using detailed logic

    // ROI Score (0-10)
    let roi_score = 0;
    const roi = input.financial.roi_percent;
    if (roi >= 30) roi_score = 10;
    else if (roi >= 20) roi_score = 8;
    else if (roi >= 15) roi_score = 6;
    else roi_score = 3;

    // Payback Score (0-10) - Target < 18-24 months for SMB, < 36 acceptable
    let payback_score = 0;
    const payback = input.financial.payback_period_months;
    if (payback <= 12) payback_score = 10;
    else if (payback <= 24) payback_score = 8;
    else if (payback <= 36) payback_score = 5;
    else payback_score = 2;

    // Profit Margin Score (0-10)
    let margin_score = 0;
    const margin = input.financial.profit_margin_percent;
    if (margin >= 25) margin_score = 10;
    else if (margin >= 15) margin_score = 8;
    else if (margin > 0) margin_score = 5;
    else margin_score = 0; // Red flag handles negative

    // Calculate Financial Pillar (Target 30 points)
    const financial_raw = (roi_score * 0.4) + (payback_score * 0.3) + (margin_score * 0.3); // 0-10
    let financial_total = financial_raw * 3; // Scale to 30

    // Financial Penalties
    if (roi < 15) {
        financial_total -= 5;
        logic_notes_arr.push("Penalty: ROI < 15%.");
    }
    if (payback > 36) {
        financial_total -= 5;
        logic_notes_arr.push("Penalty: Payback > 36 months.");
    }
    financial_total = Math.max(0, financial_total);


    // --- 3. Technical Feasibility (20%) ---
    // Inverse relationship with Complexity Score

    let complexity_points = 0; // 0-10, where 10 is "Feasible"
    switch (input.technical.complexity_score) {
        case 'Low': complexity_points = 10; break;
        case 'Medium': complexity_points = 7; break;
        case 'High': complexity_points = 4; break;
    }

    // Risk Adjustment: High Complexity + No Team
    if (input.technical.complexity_score === 'High' && !input.technical.has_technical_team) {
        complexity_points -= 4; // Severe penalty
        logic_notes_arr.push("High Risk: Complex tech without technical team.");
    } else if (!input.technical.has_technical_team) {
        complexity_points -= 2; // General penalty
    }

    complexity_points = Math.max(0, complexity_points);
    const technical_total = complexity_points * 2; // Scale 0-10 to 0-20


    // --- 4. Team/Strategy (10%) ---
    // Execution Strategy & MVP

    let strategy_score = 0;
    switch (input.team.execution_strategy) {
        case 'Strong': strategy_score = 10; break;
        case 'Average': strategy_score = 6; break;
        default: strategy_score = 2;
    }

    let mvp_score = 0;
    switch (input.team.mvp_readiness) {
        case 'Live': mvp_score = 10; break;
        case 'Prototype': mvp_score = 8; break;
        case 'Design': mvp_score = 5; break;
        default: mvp_score = 2;
    }

    const team_raw = (strategy_score + mvp_score) / 2;
    const team_total = team_raw * 1; // Scale 0-10 to 0-10 (10%)


    // --- Final Calculation & Rules ---

    let total_score = market_total + financial_total + technical_total + team_total;

    // "The Red Flag Rule"
    // Deduct 25 points if Profit Margin < 0 OR (Competition Critical AND no Unique Value)
    if (input.financial.profit_margin_percent < 0) {
        total_score -= 25;
        logic_notes_arr.push("RED FLAG: Negative Profit Margin.");
    } else if (input.market.competition_level === 'Critical' && !input.market.value_proposition_unique) {
        total_score -= 25;
        logic_notes_arr.push("RED FLAG: Critical Competition without Unique Value.");
    }

    // "The Scalability Bonus"
    // +5-10 points for National/International
    if (input.market.geographic_scope === 'International') {
        total_score += 10;
        logic_notes_arr.push("Scalability Bonus (+10): International Scope.");
    } else if (input.market.geographic_scope === 'National') {
        total_score += 5;
        logic_notes_arr.push("Scalability Bonus (+5): National Scope.");
    }

    // Clamping
    total_score = Math.min(100, Math.max(0, total_score));

    // Determine Tier
    let investment_tier: 'Seed' | 'Growth' | 'Refine' = 'Refine';
    if (total_score >= 80) investment_tier = 'Growth';
    else if (total_score >= 60) investment_tier = 'Seed';
    else investment_tier = 'Refine';

    // Final Logic Note
    const primary_note = logic_notes_arr.length > 0 ? logic_notes_arr.join(" | ") : "Balanced Profile. No major risks detected.";

    return {
        total_score: Math.round(total_score),
        pillar_scores: {
            market: Math.round(market_total),
            financial: Math.round(financial_total),
            technical: Math.round(technical_total),
            team: Math.round(team_total)
        },
        investment_tier,
        logic_notes: primary_note
    };
}


// --- Legacy Logic / Existing Functions (Preserved) ---

export interface IdeaSubmission {
    userId?: string;
    answers: Record<string, any>;
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

export async function processIdeaValidation(submission: IdeaSubmission): Promise<ValidationResult> {
    const { answers } = submission;
    let totalScore = 0;
    const feedback: string[] = [];

    // Basic scoring (Legacy)
    Object.values(answers).forEach((ans: any) => {
        const score = ans.score || 0;
        totalScore += score;
    });

    // Approximate max score normalization logic would go here
    // For now, using a simple heuristic based on the previous file content
    const percentage = Math.min(100, (totalScore / (Object.keys(answers).length * 3)) * 100);

    // Heuristic Risk Checks
    if (answers['q2']?.id === 'q2-4' && answers['q4']?.id === 'q4-2') {
        feedback.push("مخاطرة سوقية عالية: ابتكار جديد كلياً على نطاق عالمي.");
    }
    if (answers['q9']?.id === 'q9-4') {
        feedback.push("نموذج الربح: الاعتماد الكلي على الإعلانات غير مستدام في البداية.");
    }

    const status = (percentage > 60 && feedback.length === 0) ? 'pass' : 'refine';

    // Save to DB (Legacy Flow)
    let savedId: string | undefined;
    try {
        const { data, error } = await supabase
            .from('marfa_ideas')
            .insert([{
                user_id: submission.userId || null,
                market_score: 0, // Placeholder
                tech_score: 0,   // Placeholder
                revenue_score: 0,// Placeholder
                total_score: Math.round(percentage),
                status: status === 'pass' ? 'validated' : 'draft',
                description: JSON.stringify(feedback)
            }])
            .select()
            .single();

        if (!error) savedId = data?.id;
    } catch (err) {
        console.error("Supabase error:", err);
    }

    return {
        id: savedId,
        score: Math.round(percentage),
        status,
        feedback,
        breakdown: { market: 0, tech: 0, revenue: 0 }
    };
}

export async function saveMVPBlueprint(ideaId: string, features: any[]) {
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
    const { data: idea } = await supabase.from('marfa_ideas').select('total_score').eq('id', ideaId).single();
    if (idea && idea.total_score > 80) {
        return { matched: true, message: "Idea sent to matching investors" };
    }
    return { matched: false, message: "Score too low for auto-match" };
}
