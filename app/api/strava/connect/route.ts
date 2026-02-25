import { NextRequest, NextResponse } from 'next/server';
import { StravaService } from '@/lib/services/strava-service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify user is authenticated
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.redirect(
                new URL('/csr/technical-reports?error=unauthorized', request.url)
            );
        }

        // Generate state for CSRF protection (optional but recommended)
        const state = user.id;

        // Create Strava service and get authorization URL
        const stravaService = new StravaService();
        const authUrl = stravaService.getAuthorizationUrl(state);

        // Redirect to Strava authorization
        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error('Strava connect error:', error);
        return NextResponse.redirect(
            new URL('/csr/technical-reports?error=server_error', request.url)
        );
    }
}
