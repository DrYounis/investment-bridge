import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createHash } from 'node:crypto';
import { z } from 'zod';

export const runtime = 'nodejs';

const TrackSchema = z.object({
  path: z.string().min(1).max(300).startsWith('/'),
  referrer: z.string().max(500).optional(),
});

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|gptbot|claudebot|perplexity/i;

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = TrackSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const { path, referrer } = parsed.data;

    // Skip admin and API paths
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return new NextResponse(null, { status: 204 });
    }

    // Bot filter
    const ua = request.headers.get('user-agent') || '';
    if (BOT_RE.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    // Visitor hash: SHA256(ip|ua|date) — never store raw IP
    const forwarded = request.headers.get('x-forwarded-for') || 'unknown';
    const ip = forwarded.split(',')[0].trim();
    const today = new Date().toISOString().split('T')[0];
    const hash = createHash('sha256').update(`${ip}|${ua}|${today}`).digest('hex');

    const country = request.headers.get('x-vercel-ip-country') || null;
    const device = /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop';

    const svc = createServiceClient();
    const { error } = await svc.from('page_views').insert({
      path,
      referrer: referrer || null,
      country,
      device,
      visitor_hash: hash,
    });

    if (error) {
      console.error('TRACK_INSERT_ERROR', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('TRACK_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
