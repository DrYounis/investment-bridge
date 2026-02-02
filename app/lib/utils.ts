/**
 * Utility Functions
 * Investment Bridge Platform
 */

// ==================== Format Functions ====================

/**
 * تنسيق الأرقام مع فواصل
 */
export function formatNumber(num: number, locale: string = 'ar-SA'): string {
    return new Intl.NumberFormat(locale).format(num);
}

/**
 * تنسيق المبالغ المالية
 */
export function formatCurrency(
    amount: number,
    currency: string = 'SAR',
    locale: string = 'ar-SA'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}

/**
 * تنسيق النسب المئوية
 */
export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * تنسيق التواريخ
 */
export function formatDate(
    date: string | Date,
    locale: string = 'ar-SA',
    options?: Intl.DateTimeFormatOptions
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * تنسيق الوقت النسبي (منذ ساعة، منذ يومين، إلخ)
 */
export function formatRelativeTime(date: string | Date, locale: string = 'ar'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return locale === 'ar' ? 'الآن' : 'now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return locale === 'ar' ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return locale === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return locale === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
    } else {
        return formatDate(dateObj, locale);
    }
}

// ==================== Validation Functions ====================

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف السعودي
 */
export function isValidSaudiPhone(phone: string): boolean {
    const phoneRegex = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
    return phoneRegex.test(phone);
}

/**
 * التحقق من قوة كلمة المرور
 */
export function validatePasswordStrength(password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    errors: string[];
} {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    if (errors.length === 0) {
        strength = 'strong';
    } else if (errors.length <= 2) {
        strength = 'medium';
    }

    return {
        isValid: errors.length === 0,
        strength,
        errors,
    };
}

// ==================== String Functions ====================

/**
 * اختصار النصوص الطويلة
 */
export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * تحويل النص إلى slug
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ==================== Array Functions ====================

/**
 * تجميع العناصر حسب property معين
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, item) => {
        const group = String(item[key]);
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

/**
 * ترتيب عشوائي للمصفوفة
 */
export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ==================== Calculation Functions ====================

/**
 * حساب نسبة الإنجاز
 */
export function calculatePercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
}

/**
 * حساب العائد على الاستثمار (ROI)
 */
export function calculateROI(initialInvestment: number, finalValue: number): number {
    if (initialInvestment === 0) return 0;
    return ((finalValue - initialInvestment) / initialInvestment) * 100;
}

/**
 * حساب القيمة المستقبلية للاستثمار
 */
export function calculateFutureValue(
    principal: number,
    annualRate: number,
    years: number,
    compoundingPerYear: number = 12
): number {
    const rate = annualRate / 100;
    const n = compoundingPerYear;
    const t = years;
    return principal * Math.pow(1 + rate / n, n * t);
}

// ==================== Class Names Utility ====================

/**
 * دمج class names بشكل شرطي (مثل clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

// ==================== Debounce & Throttle ====================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ==================== Storage Helpers ====================

/**
 * حفظ البيانات في localStorage بشكل آمن
 */
export function setLocalStorage(key: string, value: any): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * قراءة البيانات من localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue ?? null;
    }
}

/**
 * حذف البيانات من localStorage
 */
export function removeLocalStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}
