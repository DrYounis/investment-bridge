import 'server-only';
import { createServiceClient } from './service';

const PITCH_DECKS_BUCKET = 'pitch-decks';

/**
 * Ensure the pitch-decks bucket exists (public-read).
 * Run this once via an admin script or the Supabase dashboard.
 */
export async function ensurePitchDecksBucket() {
  const supabase = createServiceClient();

  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === PITCH_DECKS_BUCKET);

  if (!exists) {
    const { error } = await supabase.storage.createBucket(PITCH_DECKS_BUCKET, {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024, // 50 MB
      allowedMimeTypes: [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/pdf',
      ],
    });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
  }
}

/**
 * Get the public URL for a file in the pitch-decks bucket.
 */
export function getPitchDeckUrl(fileName: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${PITCH_DECKS_BUCKET}/${fileName}`;
}
