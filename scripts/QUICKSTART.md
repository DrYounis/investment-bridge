# Quick Setup Guide - Automate News Updates

## Run these commands in your terminal:

```bash
# 1. Go to scripts directory
cd /Volumes/Samsung/investment-bridge/scripts

# 2. Install Python packages (may take 1-2 minutes)
pip3 install --user requests beautifulsoup4 feedparser lxml html5lib

# 3. Test the news aggregator once
python3 news_aggregator.py

# 4. Install cron job for hourly updates
bash install_cron.sh
```

## What happens:
- ✅ Fetches news from Argaam, Yahoo Finance, MarketWatch
- ✅ Filters for Saudi investment/entrepreneurship topics  
- ✅ Inserts into your Supabase database
- ✅ Appears in your ticker automatically
- ✅ Runs every hour forever

## Check if it's working:
```bash
# View logs
tail -f /tmp/news_aggregator.log

# See cron schedule
crontab -l

# Test manually anytime
python3 news_aggregator.py
```

## That's it! 
News will update automatically every hour. Check http://localhost:3000 to see it in action!
