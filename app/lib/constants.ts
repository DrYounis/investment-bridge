/**
 * Constants & Configuration
 * Investment Bridge Platform
 */

// ==================== App Configuration ====================

export const APP_NAME = 'مرفأ';
export const APP_NAME_AR = 'مرفأ';
export const APP_DESCRIPTION = 'منصة لربط المستثمرين بالفرص الاستثمارية المناسبة';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ==================== Investment Constants ====================

export const INVESTMENT_TYPES = [
    { value: 'equity', label: 'Equity', label_ar: 'حصص' },
    { value: 'debt', label: 'Debt', label_ar: 'ديون' },
    { value: 'real-estate', label: 'Real Estate', label_ar: 'عقارات' },
    { value: 'startup', label: 'Startup', label_ar: 'شركات ناشئة' },
    { value: 'other', label: 'Other', label_ar: 'أخرى' },
] as const;

export const RISK_LEVELS = [
    { value: 1, label: 'Very Low Risk', label_ar: 'مخاطرة منخفضة جداً' },
    { value: 2, label: 'Low Risk', label_ar: 'مخاطرة منخفضة' },
    { value: 3, label: 'Medium Risk', label_ar: 'مخاطرة متوسطة' },
    { value: 4, label: 'High Risk', label_ar: 'مخاطرة عالية' },
    { value: 5, label: 'Very High Risk', label_ar: 'مخاطرة عالية جداً' },
] as const;

export const INVESTMENT_DURATION_OPTIONS = [
    { value: 6, label: '6 Months', label_ar: '6 أشهر' },
    { value: 12, label: '1 Year', label_ar: 'سنة واحدة' },
    { value: 24, label: '2 Years', label_ar: 'سنتان' },
    { value: 36, label: '3 Years', label_ar: '3 سنوات' },
    { value: 60, label: '5 Years', label_ar: '5 سنوات' },
    { value: 120, label: '10 Years', label_ar: '10 سنوات' },
] as const;

export const MIN_INVESTMENT_AMOUNT = 10000; // SAR
export const MAX_INVESTMENT_AMOUNT = 10000000; // SAR

// ==================== User Roles ====================

export const USER_ROLES = [
    { value: 'investor', label: 'Investor', label_ar: 'مستثمر' },
    { value: 'opportunity_provider', label: 'Opportunity Provider', label_ar: 'مقدم فرصة' },
    { value: 'admin', label: 'Admin', label_ar: 'مدير النظام' },
] as const;

// ==================== Status Options ====================

export const USER_STATUS_OPTIONS = [
    { value: 'active', label: 'Active', label_ar: 'نشط', color: 'success' },
    { value: 'pending', label: 'Pending', label_ar: 'قيد المراجعة', color: 'warning' },
    { value: 'suspended', label: 'Suspended', label_ar: 'موقوف', color: 'error' },
    { value: 'inactive', label: 'Inactive', label_ar: 'غير نشط', color: 'gray' },
] as const;

export const OPPORTUNITY_STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft', label_ar: 'مسودة', color: 'gray' },
    { value: 'published', label: 'Published', label_ar: 'منشورة', color: 'success' },
    { value: 'closed', label: 'Closed', label_ar: 'مغلقة', color: 'warning' },
    { value: 'archived', label: 'Archived', label_ar: 'مؤرشفة', color: 'gray' },
] as const;

export const INVESTMENT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', label_ar: 'قيد المراجعة', color: 'warning' },
    { value: 'approved', label: 'Approved', label_ar: 'موافق عليه', color: 'success' },
    { value: 'rejected', label: 'Rejected', label_ar: 'مرفوض', color: 'error' },
    { value: 'completed', label: 'Completed', label_ar: 'مكتمل', color: 'info' },
    { value: 'cancelled', label: 'Cancelled', label_ar: 'ملغي', color: 'gray' },
] as const;

// ==================== Pagination ====================

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// ==================== Validation ====================

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PHONE_REGEX = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==================== File Upload ====================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// ==================== Matching Algorithm ====================

export const MATCHING_WEIGHTS = {
    type_match: 0.3,
    amount_match: 0.25,
    risk_match: 0.2,
    duration_match: 0.15,
    return_match: 0.1,
} as const;

export const MINIMUM_MATCH_SCORE = 60; // Out of 100

// ==================== Notification Settings ====================

export const NOTIFICATION_TYPES = [
    { value: 'info', label: 'Info', icon: 'ℹ️', color: 'info' },
    { value: 'success', label: 'Success', icon: '✅', color: 'success' },
    { value: 'warning', label: 'Warning', icon: '⚠️', color: 'warning' },
    { value: 'error', label: 'Error', icon: '❌', color: 'error' },
] as const;

// ==================== Routes ====================

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    INVESTOR_DASHBOARD: '/dashboard/investor',
    PROVIDER_DASHBOARD: '/dashboard/opportunity-provider',
    ADMIN_DASHBOARD: '/dashboard/admin',
    OPPORTUNITIES: '/opportunities',
    OPPORTUNITY_DETAILS: (id: string) => `/opportunities/${id}`,
    PROFILE: '/profile',
    SETTINGS: '/settings',
    QUESTIONNAIRE: '/questionnaire',
} as const;

// ==================== API Endpoints ====================

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
    },
    USERS: {
        ME: '/api/users/me',
        UPDATE_PROFILE: '/api/users/profile',
    },
    OPPORTUNITIES: {
        LIST: '/api/opportunities',
        CREATE: '/api/opportunities',
        GET: (id: string) => `/api/opportunities/${id}`,
        UPDATE: (id: string) => `/api/opportunities/${id}`,
        DELETE: (id: string) => `/api/opportunities/${id}`,
    },
    INVESTMENTS: {
        LIST: '/api/investments',
        CREATE: '/api/investments',
        GET: (id: string) => `/api/investments/${id}`,
    },
    QUESTIONNAIRE: {
        GET: '/api/questionnaire',
        SUBMIT: '/api/questionnaire/submit',
    },
    MATCHING: {
        GET_MATCHES: '/api/matching',
    },
} as const;

// ==================== Local Storage Keys ====================

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER: 'user',
    LANGUAGE: 'language',
    THEME: 'theme',
    QUESTIONNAIRE_DRAFT: 'questionnaire_draft',
} as const;

// ==================== Error Messages ====================

export const ERROR_MESSAGES = {
    GENERIC: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    NETWORK: 'خطأ في الاتصال بالشبكة. تحقق من اتصالك بالإنترنت.',
    UNAUTHORIZED: 'يجب تسجيل الدخول للمتابعة.',
    FORBIDDEN: 'لا تملك الصلاحيات اللازمة لهذا الإجراء.',
    NOT_FOUND: 'الصفحة المطلوبة غير موجودة.',
    VALIDATION: 'يرجى التحقق من البيانات المدخلة.',
} as const;
