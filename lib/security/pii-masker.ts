/**
 * PII data masking for API responses.
 * Masks sensitive fields based on the requesting user's role.
 *
 * Saudi PDPL and GDPR require that PII is not unnecessarily exposed.
 */

type UserRole = 'admin' | 'investor' | 'entrepreneur' | 'anonymous';

interface MaskRule {
  fields: string[];
  maskFn: (value: string) => string;
}

const emailMask = (v: string): string => {
  const [local, domain] = v.split('@');
  if (!domain) return v.slice(0, 2) + '***';
  const visible = Math.min(local.length, 3);
  return local.slice(0, visible) + '***@' + domain;
};

const phoneMask = (v: string): string => {
  const cleaned = v.replace(/\D/g, '');
  if (cleaned.length < 4) return '***';
  return cleaned.slice(0, 2) + '****' + cleaned.slice(-2);
};

const nationalIdMask = (v: string): string => {
  return '****' + v.slice(-4);
};

const bankAccountMask = (v: string): string => {
  return '****' + v.slice(-4);
};

const addressMask = (v: string): string => {
  return v.slice(0, 5) + '...' + v.slice(-5);
};

const fullMask = (_: string): string => '******';

const ROLE_MASKS: Record<UserRole, MaskRule[]> = {
  admin: [
    // Admins see everything — no masking
    { fields: ['*'], maskFn: (v) => v },
  ],
  investor: [
    { fields: ['national_id', 'passport_number', 'tax_id', 'bank_account', 'iban', 'bank_account_number', 'date_of_birth'], maskFn: fullMask },
    { fields: ['phone', 'phone_number'], maskFn: phoneMask },
    { fields: ['email'], maskFn: emailMask },
    { fields: ['address'], maskFn: addressMask },
  ],
  entrepreneur: [
    { fields: ['national_id', 'passport_number', 'tax_id', 'bank_account', 'iban', 'bank_account_number', 'date_of_birth', 'address'], maskFn: fullMask },
    { fields: ['phone', 'phone_number'], maskFn: phoneMask },
    { fields: ['email'], maskFn: emailMask },
  ],
  anonymous: [
    { fields: ['*'], maskFn: fullMask },
  ],
};

/**
 * Mask PII fields in an object based on the user's role.
 * Only masks fields that are present — does not add or remove keys.
 */
export function maskPii<T extends Record<string, unknown>>(
  data: T,
  role: UserRole
): T {
  if (role === 'admin') return data;

  const rules = ROLE_MASKS[role] || ROLE_MASKS.anonymous;
  const masked = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(masked)) {
    for (const rule of rules) {
      if (rule.fields.includes('*') || rule.fields.includes(key)) {
        const value = masked[key];
        if (typeof value === 'string' && value.length > 0) {
          // Don't mask already-masked values
          if (!value.includes('***') && !value.includes('******')) {
            masked[key] = rule.maskFn(value);
          }
        }
      }
    }
  }

  return masked as T;
}

/**
 * Strip PII fields entirely from an object.
 * Used before logging or sending to third-party services.
 */
export function stripPii<T extends Record<string, unknown>>(data: T): T {
  const piiKeys = [
    'national_id', 'phone', 'phone_number', 'email',
    'bank_account', 'bank_account_number', 'iban',
    'tax_id', 'passport_number', 'address', 'date_of_birth',
    'password', 'token', 'secret', 'api_key',
  ];

  const cleaned = { ...data } as Record<string, unknown>;
  for (const key of piiKeys) {
    if (key in cleaned) {
      cleaned[key] = '[REDACTED]';
    }
  }
  return cleaned as T;
}
