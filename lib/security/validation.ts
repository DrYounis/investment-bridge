/**
 * Input validation utilities for API routes.
 * Prevents injection attacks, XSS, and malformed data.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_STRING_REGEX = /^[\p{L}\p{N}\s\-_.,!?@#$%^&*()+=[\]{}|;:'"<>/~`\u0600-\u06FF]+$/u;

/**
 * Validate a UUID v4 string.
 */
export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Assert a value is a valid UUID, throw if not.
 */
export function assertUUID(value: string, fieldName: string): void {
  if (!isValidUUID(value)) {
    throw new ValidationError(`Invalid ${fieldName}: must be a valid UUID`);
  }
}

/**
 * Validate a URL-friendly slug.
 */
export function isValidSlug(value: string): boolean {
  return SLUG_REGEX.test(value);
}

/**
 * Sanitize a string by stripping HTML tags and dangerous sequences.
 * Server-side equivalent of DOMPurify.
 */
export function sanitizeHtml(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // Remove HTML script/style tags and their content
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Remove dangerous event handler attributes
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|\S+)/gi, '');

  // Remove remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Decode common HTML entities (prevent double-encoding attacks)
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

  // Strip null bytes (null-byte injection)
  cleaned = cleaned.replace(/\0/g, '');

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Validate that a string contains only safe characters.
 * Allows Arabic characters (U+0600-U+06FF range).
 */
export function isSafeString(value: string): boolean {
  return SAFE_STRING_REGEX.test(value);
}

/**
 * Sanitize a string for safe storage — strip HTML and validate.
 */
export function sanitizeInput(text: string): string {
  return sanitizeHtml(text);
}

/**
 * Validate that a value is a positive integer within range.
 */
export function validateIntegerInRange(
  value: unknown,
  min: number,
  max: number,
  fieldName: string
): number {
  const num = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(num) || num < min || num > max || !Number.isInteger(num)) {
    throw new ValidationError(
      `${fieldName} must be an integer between ${min} and ${max}`
    );
  }
  return num;
}

/**
 * Validate that a string is not empty and within length limits.
 */
export function validateString(
  value: unknown,
  minLength: number,
  maxLength: number,
  fieldName: string
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`
    );
  }
  return trimmed;
}

/**
 * Validate an email address format.
 */
export function validateEmail(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value.trim())) {
    throw new ValidationError(`${fieldName} is not a valid email address`);
  }
  return value.trim().toLowerCase();
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
