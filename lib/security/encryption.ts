import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32; // 256 bits

/**
 * Derive an AES-256 encryption key from the master secret.
 * Uses PBKDF2-equivalent scrypt for key derivation.
 */
function deriveKey(salt?: Buffer): { key: Buffer; salt: Buffer } {
  const masterSecret = process.env.PII_ENCRYPTION_KEY;
  if (!masterSecret) {
    throw new Error('PII_ENCRYPTION_KEY environment variable is not set');
  }

  const saltBuf = salt || randomBytes(SALT_LENGTH);
  const key = scryptSync(masterSecret, saltBuf, KEY_LENGTH);
  return { key, salt: saltBuf };
}

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns base64-encoded ciphertext with IV, auth tag, and salt prepended.
 * Format: <salt:b64>.<iv:b64>.<authTag:b64>.<ciphertext:b64>
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) return plaintext;

  const { key, salt } = deriveKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    salt.toString('base64'),
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.');
}

/**
 * Decrypt a ciphertext string produced by encryptPII.
 */
export function decryptPII(encrypted: string): string {
  if (!encrypted) return encrypted;
  if (!encrypted.includes('.')) return encrypted; // already plaintext

  const parts = encrypted.split('.');
  if (parts.length !== 4) return encrypted;

  const [saltB64, ivB64, authTagB64, ciphertextB64] = parts;

  const salt = Buffer.from(saltB64, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');

  const { key } = deriveKey(salt);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Fields that contain PII and must be encrypted before storage.
 */
export const PII_FIELDS = [
  'national_id',
  'phone',
  'phone_number',
  'email',
  'bank_account',
  'bank_account_number',
  'iban',
  'tax_id',
  'passport_number',
  'address',
  'date_of_birth',
] as const;

/**
 * Deeply encrypt PII fields in an object before storing.
 */
export function encryptPiiFields<T extends Record<string, unknown>>(
  data: T
): T {
  const encrypted = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(encrypted)) {
    if (PII_FIELDS.includes(key as (typeof PII_FIELDS)[number])) {
      const value = encrypted[key];
      if (typeof value === 'string' && value.length > 0) {
        encrypted[key] = encryptPII(value);
      }
    }
  }

  return encrypted as T;
}

/**
 * Deeply decrypt PII fields in an object when reading.
 */
export function decryptPiiFields<T extends Record<string, unknown>>(
  data: T
): T {
  const decrypted = { ...data } as Record<string, unknown>;

  for (const key of Object.keys(decrypted)) {
    if (PII_FIELDS.includes(key as (typeof PII_FIELDS)[number])) {
      const value = decrypted[key];
      if (typeof value === 'string' && value.length > 0) {
        decrypted[key] = decryptPII(value);
      }
    }
  }

  return decrypted as T;
}
