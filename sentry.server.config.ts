// This file configures the initialization of Sentry on the server.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled
  tracesSampleRate: 0.1,

  // Set environment
  environment: process.env.NODE_ENV || 'development',

  // Don't log errors in development
  enabled: process.env.NODE_ENV === 'production',

  // Disable Spotlight in production
  spotlight: process.env.NODE_ENV === 'development',
})
