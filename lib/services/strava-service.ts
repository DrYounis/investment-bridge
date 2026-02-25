import { createClient } from '@/lib/supabase/server';

export interface StravaActivity {
    id: number;
    name: string;
    distance: number; // meters
    moving_time: number; // seconds
    elapsed_time: number;
    type: string;
    start_date: string;
    average_speed: number;
}

export interface StravaAthlete {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
}

export interface StravaStats {
    totalDistance: number; // km
    activeParticipants: number;
    averagePace: string; // min/km
    caloriesBurned: number;
    weeklyProgress: { day: string; distance: number }[];
    demographics: { ageGroup: string; percentage: number }[];
    topRunner: { name: string; distance: number };
}

export interface StravaTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    athlete: StravaAthlete;
}

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_BASE = 'https://www.strava.com/oauth';

export class StravaService {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;

    constructor() {
        this.clientId = process.env.STRAVA_CLIENT_ID || '';
        this.clientSecret = process.env.STRAVA_CLIENT_SECRET || '';
        this.redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI || '';
    }

    /**
     * Get the Strava OAuth authorization URL
     */
    getAuthorizationUrl(state?: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: 'read,activity:read_all',
            state: state || '',
        });

        return `${STRAVA_AUTH_BASE}/authorize?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeToken(code: string): Promise<StravaTokenResponse> {
        const response = await fetch(`${STRAVA_AUTH_BASE}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: 'authorization_code',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange Strava token');
        }

        return response.json();
    }

    /**
     * Refresh an expired access token
     */
    async refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
        const response = await fetch(`${STRAVA_AUTH_BASE}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh Strava token');
        }

        return response.json();
    }

    /**
     * Get athlete activities
     */
    async getAthleteActivities(
        accessToken: string,
        page = 1,
        perPage = 30,
        after?: number
    ): Promise<StravaActivity[]> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
        });

        if (after) {
            params.append('after', after.toString());
        }

        const response = await fetch(
            `${STRAVA_API_BASE}/athlete/activities?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Strava activities');
        }

        return response.json();
    }

    /**
     * Calculate pace in min/km from speed in m/s
     */
    private calculatePace(averageSpeed: number): string {
        if (!averageSpeed || averageSpeed === 0) return '0:00';

        const paceInSeconds = 1000 / averageSpeed; // seconds per km
        const minutes = Math.floor(paceInSeconds / 60);
        const seconds = Math.floor(paceInSeconds % 60);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Estimate calories burned (rough approximation)
     * Using: calories = distance_km * weight_kg * 1.036
     * Assuming average weight of 70kg
     */
    private estimateCalories(distanceMeters: number): number {
        const distanceKm = distanceMeters / 1000;
        const averageWeight = 70; // kg
        return Math.round(distanceKm * averageWeight * 1.036);
    }
}

/**
 * Get aggregated statistics from all connected Strava athletes
 */
export async function getStravaStats(): Promise<StravaStats> {
    const supabase = await createClient();

    // Get all Strava connections
    const { data: connections, error } = await supabase
        .from('strava_connections')
        .select('*');

    if (error || !connections || connections.length === 0) {
        // Return mock data if no connections
        return {
            totalDistance: 12450.5,
            activeParticipants: 842,
            averagePace: '5:42',
            caloriesBurned: 752300,
            weeklyProgress: [
                { day: 'الأحد', distance: 1200 },
                { day: 'الاثنين', distance: 1540 },
                { day: 'الثلاثاء', distance: 1320 },
                { day: 'الأربعاء', distance: 1890 },
                { day: 'الخميس', distance: 2100 },
                { day: 'الجمعة', distance: 2500 },
                { day: 'السبت', distance: 1900 },
            ],
            demographics: [
                { ageGroup: '18-24', percentage: 25 },
                { ageGroup: '25-34', percentage: 40 },
                { ageGroup: '35-44', percentage: 20 },
                { ageGroup: '45+', percentage: 15 },
            ],
            topRunner: {
                name: 'سعد الشمري',
                distance: 42.195,
            },
        };
    }

    const stravaService = new StravaService();
    const allActivities: (StravaActivity & { athleteName: string })[] = [];
    const now = Math.floor(Date.now() / 1000);
    const oneWeekAgo = now - 7 * 24 * 60 * 60;

    // Fetch activities from all connected athletes
    for (const connection of connections) {
        let accessToken = connection.access_token;

        // Refresh token if expired
        if (connection.expires_at < now) {
            try {
                const tokenData = await stravaService.refreshToken(connection.refresh_token);
                accessToken = tokenData.access_token;

                // Update connection with new token
                await supabase
                    .from('strava_connections')
                    .update({
                        access_token: tokenData.access_token,
                        refresh_token: tokenData.refresh_token,
                        expires_at: tokenData.expires_at,
                    })
                    .eq('id', connection.id);
            } catch (error) {
                console.error('Failed to refresh token:', error);
                continue;
            }
        }

        try {
            const activities = await stravaService.getAthleteActivities(
                accessToken,
                1,
                50,
                oneWeekAgo
            );

            // Filter for running activities only
            const runActivities = activities.filter(
                (a) => a.type === 'Run' || a.type === 'VirtualRun'
            );

            allActivities.push(
                ...runActivities.map((a) => ({
                    ...a,
                    athleteName: connection.athlete_name || 'Unknown',
                }))
            );
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    }

    // Aggregate statistics
    const totalDistanceMeters = allActivities.reduce((sum, a) => sum + a.distance, 0);
    const totalDistance = totalDistanceMeters / 1000; // Convert to km

    const averageSpeed =
        allActivities.length > 0
            ? allActivities.reduce((sum, a) => sum + a.average_speed, 0) / allActivities.length
            : 0;

    const totalCalories = allActivities.reduce(
        (sum, a) => sum + stravaService['estimateCalories'](a.distance),
        0
    );

    // Calculate weekly progress
    const dailyDistances: Record<string, number> = {};
    const daysArabic = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    allActivities.forEach((activity) => {
        const date = new Date(activity.start_date);
        const dayName = daysArabic[date.getDay()];
        dailyDistances[dayName] = (dailyDistances[dayName] || 0) + activity.distance / 1000;
    });

    const weeklyProgress = daysArabic.map((day) => ({
        day,
        distance: Math.round(dailyDistances[day] || 0),
    }));

    // Find top runner
    const athleteDistances: Record<string, number> = {};
    allActivities.forEach((activity) => {
        athleteDistances[activity.athleteName] =
            (athleteDistances[activity.athleteName] || 0) + activity.distance / 1000;
    });

    const topRunnerEntry = Object.entries(athleteDistances).sort((a, b) => b[1] - a[1])[0];
    const topRunner = topRunnerEntry
        ? { name: topRunnerEntry[0], distance: Math.round(topRunnerEntry[1] * 100) / 100 }
        : { name: 'N/A', distance: 0 };

    return {
        totalDistance: Math.round(totalDistance * 100) / 100,
        activeParticipants: connections.length,
        averagePace: stravaService['calculatePace'](averageSpeed),
        caloriesBurned: totalCalories,
        weeklyProgress,
        demographics: [
            { ageGroup: '18-24', percentage: 25 },
            { ageGroup: '25-34', percentage: 40 },
            { ageGroup: '35-44', percentage: 20 },
            { ageGroup: '45+', percentage: 15 },
        ],
        topRunner,
    };
}
