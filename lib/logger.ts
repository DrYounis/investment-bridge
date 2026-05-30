/**
 * Structured logger for marfa.sa
 *
 * In production: emits JSON to stdout for Vercel log aggregation.
 * In development: pretty-prints with level prefix.
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('User signed in', { userId: 'abc' })
 *   logger.error('Payment failed', err)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  source: string;
  environment: string;
  [key: string]: unknown;
}

const isProd = process.env.NODE_ENV === 'production';

function formatMessage(level: LogLevel, message: string, meta?: unknown): void {
  if (isProd) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      source: 'marfa-sa',
      environment: 'production',
    };

    if (meta instanceof Error) {
      entry.error = meta.message;
      entry.stack = meta.stack;
    } else if (meta !== undefined && meta !== null) {
      if (typeof meta === 'object') {
        Object.assign(entry, meta);
      } else {
        entry.detail = String(meta);
      }
    }

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
    return;
  }

  // Development: pretty print
  const prefixes: Record<LogLevel, string> = {
    debug: '🔍',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
  };

  const prefix = prefixes[level];
  const ts = new Date().toISOString().slice(11, 19);

  if (meta instanceof Error) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`${prefix} [${ts}] ${message}`, meta.message);
  } else if (meta !== undefined && meta !== null) {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`${prefix} [${ts}] ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`${prefix} [${ts}] ${message}`);
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) => formatMessage('debug', message, meta),
  info: (message: string, meta?: unknown) => formatMessage('info', message, meta),
  warn: (message: string, meta?: unknown) => formatMessage('warn', message, meta),
  error: (message: string, meta?: unknown) => formatMessage('error', message, meta),
};

export default logger;
