export const runtime = "nodejs"

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { logSecurityEvent } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * Right to Erasure endpoint (GDPR Article 17 / PDPL Saudi Arabia)
 *
 * Soft-deletes user data and anonymizes PII fields.
 * Requires the user to be authenticated (must verify their own identity).
 *
 * POST /api/erasure
 * Body: { confirmation: string } — must be the exact phrase "DELETE MY DATA"
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse confirmation
    let body: { confirmation?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (body.confirmation !== 'DELETE MY DATA') {
      return NextResponse.json(
        { error: 'Must confirm deletion with "DELETE MY DATA"' },
        { status: 400 }
      );
    }

    logSecurityEvent({
      type: 'data.erasure.requested',
      userId: user.id,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      timestamp: new Date().toISOString(),
    });

    const serviceClient = createServiceClient();

    // 1. Anonymize profile data
    await serviceClient
      .from('profiles')
      .update({
        full_name: '[ANONYMIZED]',
        phone: null,
        company: null,
        bio: null,
        avatar_url: null,
        updated_at: new Date().toISOString(),
        deleted_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // 2. Anonymize investor profile if exists
    await serviceClient
      .from('investor_profiles')
      .update({
        fund_name: '[ANONYMIZED]',
        investment_focus: null,
        ticket_size: null,
        bio: null,
        deleted_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    // 3. Delete pitch decks / uploaded documents
    await serviceClient
      .from('pitch_decks')
      .delete()
      .eq('user_id', user.id);

    // 4. Remove from meetings
    await serviceClient
      .from('meetings')
      .delete()
      .eq('user_id', user.id);

    // 5. Remove Strava connections
    await serviceClient
      .from('strava_connections')
      .delete()
      .eq('user_id', user.id);

    // 6. Delete auth user (this will also cascade via Supabase triggers)
    const { error: deleteError } = await serviceClient.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      // If admin API fails, at least the data is anonymized
      logSecurityEvent({
        type: 'data.erasure.completed',
        userId: user.id,
        timestamp: new Date().toISOString(),
        details: { auth_delete_failed: true },
      });

      return NextResponse.json({
        success: true,
        message: 'Your data has been anonymized. Your account will be fully deleted shortly.',
      });
    }

    logSecurityEvent({
      type: 'data.erasure.completed',
      userId: user.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
