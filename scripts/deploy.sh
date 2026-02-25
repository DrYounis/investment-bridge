#!/bin/bash
# Deploy script - run from repository root

cd "$(dirname "$0")"

echo "📦 Deploying Strava Integration..."
git add -A
git commit -m "feat: add Strava API integration to replace Nike mock data" || echo "No changes to commit"
git push
echo "✨ Done!"
