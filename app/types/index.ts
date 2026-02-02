/**
 * TypeScript Types للمشروع
 * Investment Bridge Platform
 */

// ==================== User Types ====================

export type UserRole = 'investor' | 'opportunity_provider' | 'admin';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export interface User {
    id: string;
    email: string;
    full_name: string;
    full_name_ar?: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

// ==================== Question Types ====================

export type QuestionType = 'single-choice' | 'multiple-choice' | 'text' | 'number' | 'range';

export interface QuestionOption {
    id: string;
    label: string;
    label_ar?: string;
    value: string;
    next_question_id?: string | null; // للأسئلة المتفرعة
}

export interface Question {
    id: string;
    title: string;
    title_ar?: string;
    description?: string;
    description_ar?: string;
    type: QuestionType;
    options?: QuestionOption[];
    required: boolean;
    order: number;
    category: string;
    parent_question_id?: string | null;
    condition_value?: string | null; // القيمة التي تؤدي لظهور هذا السؤال
    created_at: string;
    updated_at: string;
}

// ==================== Answer Types ====================

export interface Answer {
    id: string;
    user_id: string;
    question_id: string;
    value: string | string[] | number;
    created_at: string;
    updated_at: string;
}

export interface QuestionnaireSubmission {
    id: string;
    user_id: string;
    answers: Answer[];
    completed: boolean;
    started_at: string;
    completed_at?: string | null;
}

// ==================== Investment Opportunity Types ====================

export type OpportunityStatus = 'draft' | 'published' | 'closed' | 'archived';

export type InvestmentType = 'equity' | 'debt' | 'real-estate' | 'startup' | 'other';

export interface InvestmentOpportunity {
    id: string;
    provider_id: string; // User ID of opportunity provider
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    type: InvestmentType;
    min_investment: number;
    max_investment?: number | null;
    target_amount: number;
    current_amount: number;
    expected_return: number; // نسبة العائد المتوقع
    duration_months: number;
    risk_level: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = high
    status: OpportunityStatus;
    images?: string[];
    documents?: string[];
    created_at: string;
    updated_at: string;
    published_at?: string | null;
    closed_at?: string | null;
}

// ==================== Investment Types ====================

export type InvestmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';

export interface Investment {
    id: string;
    investor_id: string;
    opportunity_id: string;
    amount: number;
    status: InvestmentStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
    approved_at?: string | null;
    completed_at?: string | null;
}

// ==================== Matching Types ====================

export interface InvestorProfile {
    user_id: string;
    investment_types: InvestmentType[];
    min_investment_amount: number;
    max_investment_amount: number;
    preferred_risk_level: 1 | 2 | 3 | 4 | 5;
    preferred_duration_months: number;
    expected_return: number;
    questionnaire_completed: boolean;
}

export interface MatchScore {
    opportunity_id: string;
    investor_id: string;
    score: number; // 0-100
    matching_factors: {
        type_match: boolean;
        amount_match: boolean;
        risk_match: boolean;
        duration_match: boolean;
        return_match: boolean;
    };
}

// ==================== Notification Types ====================

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    title_ar?: string;
    message: string;
    message_ar?: string;
    type: NotificationType;
    read: boolean;
    action_url?: string | null;
    created_at: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}
