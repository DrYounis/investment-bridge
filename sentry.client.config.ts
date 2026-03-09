// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Define how likely traces are sampled
  tracesSampleRate: 0.1,

  // Define how likely Replay events are sampled
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs
  replaysOnErrorSampleRate: 1.0,

  // Set environment
  environment: process.env.NODE_ENV || 'development',

  // Don't log errors in development
  enabled: process.env.NODE_ENV === 'production',
})
