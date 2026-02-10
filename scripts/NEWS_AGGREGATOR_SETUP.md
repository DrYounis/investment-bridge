# Automated News Aggregator - Setup & Deployment Guide

## Overview

This automated system fetches financial news from multiple sources (Argaam, Yahoo Finance, MarketWatch, etc.), filters for Saudi investment/entrepreneurship relevance, and inserts directly into your Supabase `news_feed` table. The news automatically appears in your real-time ticker without any manual intervention.

## Features

✅ **Direct Supabase Integration** - Inserts news directly into your existing `news_feed` table  
✅ **Real-time Updates** - News appears instantly on your site via existing real-time subscriptions  
✅ **Smart Filtering** - Relevance scoring based on Saudi investment/entrepreneurship keywords  
✅ **Duplicate Detection** - Prevents duplicate news items  
✅ **Multi-source** - Fetches from Argaam (Arabic) and international financial sources  
✅ **Automatic Cleanup** - Removes news older than 7 days  
✅ **Easy Deployment** - Simple cron job setup

---

## Quick Start

### 1. Install Dependencies

```bash
cd /Volumes/Samsung/investment-bridge/scripts/

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your Supabase credentials
nano .env
```

Add your Supabase credentials to `.env`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Where to find credentials:**
> - Supabase Dashboard → Project Settings → API
> - Use the `service_role` key (NOT the `anon` key)

### 3. Test Manually

```bash
# Run once to test
./run_news_aggregator.sh
```

Expected output:
```
============================================================
News Aggregator Starting - 2026-02-09 23:00:00
============================================================

Fetching argaam...
  ✓ Found 5 relevant items from argaam
Fetching yahoo_finance...
  ✓ Found 3 relevant items from yahoo_finance
...

✓ Successfully inserted 12 news items into Supabase
✓ Cleaned up news older than 7 days

============================================================
Summary: 12 new items added
============================================================
```

### 4. Check Your Website

Visit your dashboard at http://localhost:3000 - you should see the new news items appear in the ticker automatically!

---

## Automated Scheduling

### Option 1: Cron Job (Simple)

Run every hour:

```bash
crontab -e

# Add this line:
0 * * * * cd /Volumes/Samsung/investment-bridge/scripts && ./run_news_aggregator.sh >> /tmp/news_aggregator.log 2>&1
```

Run every 30 minutes:
```bash
*/30 * * * * cd /Volumes/Samsung/investment-bridge/scripts && ./run_news_aggregator.sh >> /tmp/news_aggregator.log 2>&1
```

### Option 2: macOS LaunchAgent (Recommended for Mac)

Create file `~/Library/LaunchAgents/com.marfa.newsaggregator.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.marfa.newsaggregator</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Volumes/Samsung/investment-bridge/scripts/run_news_aggregator.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Volumes/Samsung/investment-bridge/scripts</string>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>StandardOutPath</key>
    <string>/tmp/news_aggregator.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/news_aggregator.error.log</string>
</dict>
</plist>
```

Load and start:
```bash
launchctl load ~/Library/LaunchAgents/com.marfa.newsaggregator.plist
launchctl start com.marfa.newsaggregator
```

### Option 3: Linux systemd (For Production Server)

Create `/etc/systemd/system/news-aggregator.service`:

```ini
[Unit]
Description=Marfa News Aggregator
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/var/www/marfa.sa/scripts
ExecStart=/var/www/marfa.sa/scripts/run_news_aggregator.sh
StandardOutput=journal
StandardError=journal
```

Create `/etc/systemd/system/news-aggregator.timer`:

```ini
[Unit]
Description=Run News Aggregator Every Hour

[Timer]
OnBootSec=5min
OnUnitActiveSec=1h

[Install]
WantedBy=timers.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable news-aggregator.timer
sudo systemctl start news-aggregator.timer
```

---

## Customization

### Adjust News Sources

Edit `news_aggregator.py`, modify `NEWS_SOURCES` dictionary:

```python
NEWS_SOURCES = {
    'argaam': {
        'enabled': True,  # Set to False to disable
        'rss': 'https://www.argaam.com/ar/rss/latest-news',
        'source_type': 'local',
        'language': 'ar'
    },
    'your_custom_source': {
        'enabled': True,
        'rss': 'https://example.com/rss',
        'source_type': 'global',
        'language': 'en'
    }
}
```

### Adjust Relevance Scoring

Modify the `KEYWORDS` dictionary in `news_aggregator.py`:

```python
KEYWORDS = {
    'high_priority': [
        'استثمار', 'investment',  # Add more keywords
    ],
    'exclude': [
        'رياضة', 'sports',  # Add topics to exclude
    ]
}
```

### Change Update Frequency

Modify how many news items to insert (default: 20):

```python
# In insert_to_supabase method
news_items = news_items[:20]  # Change to 30, 50, etc.
```

### Adjust Cleanup Period

Change how long to keep news (default: 7 days):

```python
# In run method
self.cleanup_old_news(days=7)  # Change to 14, 30, etc.
```

---

## Monitoring

### View Logs

```bash
# Cron job logs
tail -f /tmp/news_aggregator.log

# systemd logs
journalctl -u news-aggregator.service -f

# LaunchAgent logs (macOS)
tail -f /tmp/news_aggregator.log
```

### Test Database Connection

```bash
cd scripts
source venv/bin/activate
python3 -c "
from news_aggregator import NewsAggregator
agg = NewsAggregator()
print('✓ Successfully connected to Supabase')
print(f'Existing news items: {len(agg.seen_hashes)}')
"
```

### Check Supabase

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM news_feed;
SELECT * FROM news_feed ORDER BY created_at DESC LIMIT 10;
```

---

## Troubleshooting

### No news items found

**Cause**: Keywords might be too restrictive  
**Solution**: Lower minimum relevance score or add more keywords

```python
# In insert_to_supabase method, change:
if relevance < 2:  # Lower to 1 or 0
```

### Supabase connection error

**Cause**: Wrong credentials or URL  
**Solution**: Verify `.env` file

```bash
# Test connection
curl -H "apikey: YOUR_SERVICE_KEY" \
     -H "Authorization: Bearer YOUR_SERVICE_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/news_feed?limit=1"
```

### Duplicate news appearing

**Cause**: Hash collision or different wording  
**Solution**: Increase similarity threshold or check source feeds

### Script not running automatically

**Cause**: Cron/systemd/LaunchAgent not configured correctly  
**Solution**: Check logs and verify paths are absolute

```bash
# Test cron job manually
cd /Volumes/Samsung/investment-bridge/scripts && ./run_news_aggregator.sh
```

---

## Production Deployment

### For VPS/Cloud Server

1. **Upload files** to `/var/www/marfa.sa/scripts/`
2. **Set permissions**:
   ```bash
   sudo chown -R www-data:www-data /var/www/marfa.sa/scripts/
   sudo chmod 755 /var/www/marfa.sa/scripts/*.sh
   sudo chmod 644 /var/www/marfa.sa/scripts/*.py
   ```
3. **Configure systemd timer** (see above)
4. **Test**: `sudo -u www-data /var/www/marfa.sa/scripts/run_news_aggregator.sh`

### Security Best Practices

1. **Keep service key secret** - Never commit `.env` to git
2. **Use restrictive permissions**: `chmod 600 .env`
3. **Monitor logs** for suspicious activity
4. **Rate limiting** - Don't fetch more than once per 30 minutes

---

## Files Structure

```
scripts/
├── news_aggregator.py          # Main Python script
├── requirements.txt            # Python dependencies
├── run_news_aggregator.sh     # Runner script
├── .env.example               # Environment template
├── .env                       # Your credentials (gitignored)
└── venv/                      # Virtual environment (auto-created)
```

---

## Integration with Existing System

The aggregator works seamlessly with your existing real-time infrastructure:

1. **Inserts** → Python script adds to `news_feed` table
2. **Real-time trigger** → Supabase broadcasts change
3. **React listens** → `NewsContext` receives update
4. **Ticker updates** → `SmartNewsTicker` displays new news

No changes needed to your React code!

---

## Next Steps

1. ✅ Test manually: `./run_news_aggregator.sh`
2. ✅ Verify news appears on website
3. ✅ Set up automation (cron/systemd/LaunchAgent)
4. ✅ Monitor for 24 hours
5. ✅ Adjust keywords/sources as needed

---

## Support

Questions? Check:
- Logs: `/tmp/news_aggregator.log`
- Supabase Dashboard → Table Editor → news_feed
- Script output when run manually
