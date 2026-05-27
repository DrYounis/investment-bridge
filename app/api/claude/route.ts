import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };
const MAX_PROMPT_LENGTH = 5000;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Origin check
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Rate limiting by IP
  const ip = getClientIP(req);
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': String(limit.remaining),
        },
      }
    );
  }

  // 3. Parse body
  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json({ error: `Prompt too long. Max ${MAX_PROMPT_LENGTH} characters.` }, { status: 400 });
  }

  // 4. Block injection patterns
  const lower = prompt.toLowerCase();
  if (
    lower.includes('ignore previous') ||
    lower.includes('ignore all instructions') ||
    lower.includes('system prompt') ||
    lower.includes('you are now') ||
    lower.includes('api key') ||
    lower.includes('api_key') ||
    lower.includes('bearer') ||
    lower.includes('authorization')
  ) {
    return NextResponse.json({ error: 'Prompt rejected' }, { status: 400 });
  }

  // 5. Call Anthropic
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Anthropic API error:', res.status, err.error?.message);
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ text: data.content[0].text });
  } catch (err) {
    console.error('Claude proxy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
