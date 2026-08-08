// Single source of truth for meeting membership tiers
// Imported by webhook (server) and ContributorBadge (client) — do not duplicate thresholds

export interface TierInfo {
  key: string;
  ar: string;
  en: string;
  color: string;
}

export const TIERS: { key: string; minAmount: number; ar: string; en: string; color: string }[] = [
  { key: 'supporter',  minAmount: 100,  ar: 'الداعم',       en: 'Supporter',        color: '#c9a84c' },
  { key: 'patron',     minAmount: 500,  ar: 'الراعي',       en: 'Patron',           color: '#e0b84f' },
  { key: 'founder',    minAmount: 5000, ar: 'الشريك المؤسس', en: 'Founding Partner', color: '#c9a84c' },
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
