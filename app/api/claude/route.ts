import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, getClientIP, isValidOrigin } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/security';

export const dynamic = 'force-dynamic';

const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };
const MAX_PROMPT_LENGTH = 5000;

const ClaudeSchema = z.object({
  prompt: z.string().min(1).max(MAX_PROMPT_LENGTH),
});

// Injection patterns to block
const INJECTION_PATTERNS = [
  'ignore previous',
  'ignore all instructions',
  'system prompt',
  'you are now',
  'api key',
  'api_key',
  'bearer',
  'authorization',
  '<|im_start|>',
  '<|im_end|>',
  '<|endoftext|>',
] as const;

function hasInjection(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return INJECTION_PATTERNS.some(pattern => lower.includes(pattern));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Origin check
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limiting
  const ip = getClientIP(req);
  const limit = rateLimit(ip, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': String(limit.remaining),
        },
      }
    );
  }

  // Parse and validate body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }

  const parsed = ClaudeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { prompt } = parsed.data;

  // Block injection patterns
  if (hasInjection(prompt)) {
    return NextResponse.json({ error: 'Prompt rejected' }, { status: 400 });
  }

  // Sanitize input
  const sanitizedPrompt = sanitizeInput(prompt);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
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
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: sanitizedPrompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
    }

    const data = await res.json();

    const text = Array.isArray(data.content)
      ? data.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n')
      : '';

    if (!text) {
      console.error('CLAUDE_EMPTY_RESPONSE', JSON.stringify(data).slice(0, 200));
      return NextResponse.json({ error: 'Empty response' }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error('CLAUDE_REQUEST_FAIL', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
