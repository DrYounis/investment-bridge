import { Resend, type CreateEmailOptions } from 'resend';

export interface BatchItemFailure {
  index: number;
  message: string;
}

export interface BatchSendResult {
  sent: number;
  failed: number;
  failures: BatchItemFailure[];
}

const CHUNK_SIZE = 100;

/**
 * Send an array of distinct email objects via Resend's batch API (≤100 per
 * request) instead of N individual `emails.send()` calls with a 600ms sleep.
 * N emails cost N/100 HTTP round-trips, so cron functions no longer risk the
 * Vercel serverless timeout as recipient lists grow.
 *
 * `failures[].index` is the position in the input array, so callers can map
 * each failure back to its recipient.
 */
export async function sendBatch(resend: Resend, emails: CreateEmailOptions[]): Promise<BatchSendResult> {
  let sent = 0;
  let failed = 0;
  const failures: BatchItemFailure[] = [];

  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);
    const { data, error } = await resend.batch.send(chunk, { batchValidation: 'permissive' });

    if (error || !data) {
      // Top-level failure (auth/config) — treat the whole chunk as failed
      const message = error?.message || 'Batch request failed';
      for (let j = 0; j < chunk.length; j++) {
        failures.push({ index: i + j, message });
      }
      failed += chunk.length;
      continue;
    }

    // data.data = created email IDs; data.errors = per-item failures
    sent += data.data.length;
    for (const item of data.errors) {
      failures.push({ index: i + item.index, message: item.message });
      failed++;
    }
  }

  return { sent, failed, failures };
}
