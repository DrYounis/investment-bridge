// Single source of truth for meeting membership tiers
// Imported by webhook (server) and ContributorBadge (client) — do not duplicate thresholds

export interface TierInfo {
  key: string;
  ar: string;
  en: string;
  color: string;
}

export const TIERS: { key: string; minAmount: number; ar: string; en: string; color: string }[] = [
  { key: 'anchor',    minAmount: 100,  ar: 'الراسي',   en: 'The Anchor',    color: '#c9a84c' },
  { key: 'navigator', minAmount: 500,  ar: 'الملّاح',   en: 'The Navigator', color: '#e0b84f' },
  { key: 'captain',   minAmount: 5000, ar: 'القبطان',  en: 'The Captain',   color: '#c9a84c' },
];

export const PRESET_AMOUNTS = [100, 500, 5000];
export const CONTRIBUTION_FLOOR = 100; // Minimum SAR, enforced server-side

export function getTier(amount: number): TierInfo | null {
  if (amount < CONTRIBUTION_FLOOR) return null;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (amount >= TIERS[i].minAmount) {
      return { key: TIERS[i].key, ar: TIERS[i].ar, en: TIERS[i].en, color: TIERS[i].color };
    }
  }
  return null;
}

export function getTierByKey(key: string): TierInfo | null {
  return TIERS.find(t => t.key === key) ?? null;
}
