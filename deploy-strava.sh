#!/bin/bash
# Deploy Strava Integration to GitHub

echo "📦 Deploying Strava Integration..."
echo ""

cd /Volumes/Samsung/investment-bridge

echo "📝 Staging all changes..."
git add -A

echo "✅ Committing changes..."
git commit -m "feat: replace Nike mock data with real Strava API integration

- Add Strava OAuth authentication flow (/api/strava/connect & callback)
- Create strava_connections database table with RLS policies
- Implement StravaService for token management & activity aggregation  
- Add StravaConnectButton component for user authentication
- Update technical reports page to use real Strava data
- Add environment variables for Strava API credentials
- Create database migration and helper scripts"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✨ Deployment complete!"
echo ""
echo "🔔 Next steps:"
echo "  1. Get Strava API credentials from https://www.strava.com/settings/api"
echo "  2. Update .env.local with real Client ID and Secret"
echo "  3. For production, update NEXT_PUBLIC_STRAVA_REDIRECT_URI"
