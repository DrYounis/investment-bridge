import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { createHash } from 'node:crypto';
import { z } from 'zod';

export const runtime = 'nodejs';

const TrackSchema = z.object({
  path: z.string().min(1).max(300).startsWith('/'),
  referrer: z.string().max(500).optional(),
  utm_source: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  event: z.string().min(1).max(100).optional(),
  event_data: z.record(z.string(), z.unknown()).optional(),
  variant: z.string().max(50).optional(),
});

const BOT_RE = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|gptbot|claudebot|perplexity/i;

// Scripted-traffic heuristics (spoofed normal browser UA)
const BOT_ROLLING_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const BOT_ROLLING_THRESHOLD = 30; // > 30 views in the window
const BOT_ENTRY_PATHS = new Set(['/login', '/register']);

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try { body = await request.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = TrackSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const { path, referrer, utm_source, utm_campaign, event, event_data, variant } = parsed.data;

    // Skip admin and API paths
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return new NextResponse(null, { status: 204 });
    }

    // Bot filter
    const ua = request.headers.get('user-agent') || '';
    if (BOT_RE.test(ua)) {
      return new NextResponse(null, { status: 204 });
    }

    // Auth check — non-blocking: compute user_hash if logged in
    let userHash: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        userHash = createHash('sha256').update(user.id).digest('hex');
      }
    } catch (e) {
      console.error('TRACK_AUTH_CHECK', e instanceof Error ? e.message : String(e));
    }

    // Visitor hash: SHA256(ip|ua|date) — never store raw IP
    const forwarded = request.headers.get('x-forwarded-for') || 'unknown';
    const ip = forwarded.split(',')[0].trim();
    const today = new Date().toISOString().split('T')[0];
    const hash = createHash('sha256').update(`${ip}|${ua}|${today}`).digest('hex');

    const country = request.headers.get('x-vercel-ip-country') || null;
    const device = /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop';

    const svc = createServiceClient();

    // Bot heuristics — flag scripted traffic that spoofs a normal browser UA
    let isLikelyBot = false;
    try {
      // 1. First-ever tracked path is /login or /register (no natural entry point)
      if (BOT_ENTRY_PATHS.has(path)) {
        const { count } = await svc
          .from('page_views')
          .select('id', { count: 'exact', head: true })
          .eq('visitor_hash', hash);
        if (!count) isLikelyBot = true;
      }

      // 2. Exceeds threshold within a short rolling window
      const windowStart = new Date(Date.now() - BOT_ROLLING_WINDOW_MS).toISOString();
      const { count: recent } = await svc
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .eq('visitor_hash', hash)
        .gte('created_at', windowStart);
      if (recent && recent >= BOT_ROLLING_THRESHOLD) isLikelyBot = true;
    } catch (botErr) {
      // Non-fatal — bot detection must never break tracking
      console.error('TRACK_BOT_CHECK', botErr instanceof Error ? botErr.message : String(botErr));
    }

    const { error } = await svc.from('page_views').insert({
      path,
      referrer: referrer || null,
      country,
      device,
      visitor_hash: hash,
      user_hash: userHash,
      utm_source: utm_source || null,
      utm_campaign: utm_campaign || null,
      event_name: event || null,
      event_data: event_data || null,
      variant: variant || null,
      is_likely_bot: isLikelyBot,
    });

    if (error) {
      console.error('TRACK_INSERT_ERROR', error.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('TRACK_ERROR', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
