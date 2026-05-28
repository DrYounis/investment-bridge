/**
 * Structured security audit logging.
 * Logs security-relevant events without PII.
 * In production, these go to Sentry and can be exported to SIEM.
 */

type AuditEventType =
  | 'auth.login.failed'
  | 'auth.login.success'
  | 'auth.logout'
  | 'auth.password_reset'
  | 'auth.signup'
  | 'access.denied'
  | 'access.admin'
  | 'data.erasure.requested'
  | 'data.erasure.completed'
  | 'rate_limit.exceeded'
  | 'csrf.failed'
  | 'permission.denied'
  | 'upload.scan_failed'
  | 'upload.scan_passed'
  | 'api.error'
  | 'suspicious.activity';

interface AuditEvent {
  type: AuditEventType;
  timestamp: string;
  ip?: string;
  userId?: string;
  userRole?: string;
  path?: string;
  method?: string;
  details?: Record<string, string | number | boolean | null | undefined>;
}

/**
 * Log a security audit event.
 * Does NOT log PII — only IDs, roles, and operational metadata.
 */
export function logSecurityEvent(event: AuditEvent): void {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    source: 'marfa-sa',
    environment: process.env.NODE_ENV || 'development',
  };

  // Strip potentially sensitive fields
  if (logEntry.details) {
    delete logEntry.details.password;
    delete logEntry.details.token;
    delete logEntry.details.email;
    delete logEntry.details.phone;
    delete logEntry.details.nationalId;
  }

  // In production, use structured JSON so it can be ingested by log aggregation
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(logEntry));
  } else {
    // In dev, pretty print for readability
    // eslint-disable-next-line no-console
    console.log(`[AUDIT] ${logEntry.type}`, {
      ip: logEntry.ip,
      userId: logEntry.userId,
      path: logEntry.path,
      method: logEntry.method,
    });
  }
}

/**
 * Convenience helpers for common audit events.
 */
export const audit = {
  failedLogin: (ip: string, email?: string) =>
    logSecurityEvent({
      type: 'auth.login.failed',
      ip,
      timestamp: new Date().toISOString(),
      details: { email: email ? email.slice(0, 3) + '***' : undefined },
    }),

  successfulLogin: (userId: string, role: string, ip: string) =>
    logSecurityEvent({
      type: 'auth.login.success',
      userId,
      userRole: role,
      ip,
      timestamp: new Date().toISOString(),
    }),

  logout: (userId: string, ip: string) =>
    logSecurityEvent({
      type: 'auth.logout',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    }),

  accessDenied: (userId: string | undefined, path: string, method: string, ip: string) =>
    logSecurityEvent({
      type: 'access.denied',
      userId,
      path,
      method,
      ip,
      timestamp: new Date().toISOString(),
    }),

  adminAccess: (userId: string, path: string, ip: string) =>
    logSecurityEvent({
      type: 'access.admin',
      userId,
      path,
      ip,
      timestamp: new Date().toISOString(),
    }),

  csrfFailed: (ip: string, path: string) =>
    logSecurityEvent({
      type: 'csrf.failed',
      ip,
      path,
      timestamp: new Date().toISOString(),
    }),

  suspiciousActivity: (details: AuditEvent['details']) =>
    logSecurityEvent({
      type: 'suspicious.activity',
      timestamp: new Date().toISOString(),
      details,
    }),
};
