// Server-side feature flags / experiment variants.
// Values are read from Vercel env vars prefixed with EXPERIMENT_.
// Example: EXPERIMENT_JOB_CTA=banner|gate|off

const FLAG_PREFIX = 'EXPERIMENT_';

export function getExperimentFlag(name: string): string | null {
  const raw = process.env[`${FLAG_PREFIX}${name}`];
  const value = raw?.trim();
  return value ? value : null;
}

/**
 * Resolve an experiment variant from an env flag, falling back to `fallback`
 * when the flag is unset or not one of the allowed variants.
 */
export function resolveVariant<T extends string>(
  name: string,
  variants: readonly T[],
  fallback: T,
): T {
  const flag = getExperimentFlag(name);
  if (flag && (variants as readonly string[]).includes(flag)) return flag as T;
  return fallback;
}
