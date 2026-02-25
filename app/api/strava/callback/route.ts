import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { StravaService } from '@/lib/services/strava-service';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle authorization denial
    if (error) {
        return NextResponse.redirect(
            new URL('/csr/technical-reports?error=access_denied', request.url)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL('/csr/technical-reports?error=no_code', request.url)
        );
    }

    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.redirect(
                new URL('/csr/technical-reports?error=unauthorized', request.url)
            );
        }

        // Exchange code for tokens
        const stravaService = new StravaService();
        const tokenData = await stravaService.exchangeToken(code);

        // Store connection in database
        const { error: dbError } = await supabase
            .from('strava_connections')
            .upsert({
                user_id: user.id,
                athlete_id: tokenData.athlete.id,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: tokenData.expires_at,
                athlete_name: `${tokenData.athlete.firstname} ${tokenData.athlete.lastname}`,
                athlete_profile_url: tokenData.athlete.profile,
            }, {
                onConflict: 'user_id'
            });

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.redirect(
                new URL('/csr/technical-reports?error=db_error', request.url)
            );
        }

        // Success! Redirect back to technical reports
        return NextResponse.redirect(
            new URL('/csr/technical-reports?success=connected', request.url)
        );
    } catch (error) {
        console.error('Strava callback error:', error);
        return NextResponse.redirect(
            new URL('/csr/technical-reports?error=server_error', request.url)
        );
    }
}
