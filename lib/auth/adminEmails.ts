// Single source of truth for the super-admin email allowlist.
// Framework-neutral: safe to import from client, server, and edge middleware.
// Contains no secrets (these emails already ship in the client bundle).

export const SUPER_ADMIN_EMAILS = [
  'op.younis@gmail.com',
  'mohamedy2003@gmail.com',
  '10.younis@gmail.com',
] as const;

export function isSuperAdminEmail(
  email: string | null | undefined,
  extraEmails: string[] = []
): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const all = [...SUPER_ADMIN_EMAILS, ...extraEmails].map((e) =>
    e.trim().toLowerCase()
  );
  return all.includes(normalized);
}
