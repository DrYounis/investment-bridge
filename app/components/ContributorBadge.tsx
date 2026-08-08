// ContributorBadge — pill showing meeting membership tier next to user names
// Renders nothing for regular members (tier = null/undefined)

import { getTierByKey } from '@/lib/contributionTiers';

interface Props {
  tier: string | null | undefined;
  size?: 'sm' | 'md';
}

export default function ContributorBadge({ tier, size = 'md' }: Props) {
  if (!tier) return null;

  const tierDef = getTierByKey(tier);
  if (!tierDef) return null;

  const cls = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 rounded'
    : 'text-xs px-2 py-0.5 rounded-full';

  return (
    <span
      className={`inline-flex items-center font-bold shrink-0 ${cls}`}
      style={{
        background: `${tierDef.color}18`,
        color: tierDef.color,
        border: `1px solid ${tierDef.color}40`,
      }}
    >
      {tier === 'captain' ? '✦ ' : ''}{tierDef.ar}
    </span>
  );
}
