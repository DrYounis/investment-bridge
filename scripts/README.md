# Quick Start Guide - News Aggregator

## 1. Install Dependencies
```bash
cd /Volumes/Samsung/investment-bridge/scripts/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 2. Configure Credentials
```bash
cp .env.example .env
nano .env  # Add your Supabase credentials
```

Required values:
- `SUPABASE_URL`: Get from Supabase Dashboard → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY`: Get from same location (use service_role key)

## 3. Test Run
```bash
./run_news_aggregator.sh
```

## 4. Check Results
- Visit http://localhost:3000
- New news should appear in the ticker
- Check Supabase Dashboard → Table Editor → news_feed

## 5. Set Up Automation (macOS)
```bash
# Run every hour
(crontab -l 2>/dev/null; echo "0 * * * * cd /Volumes/Samsung/investment-bridge/scripts && ./run_news_aggregator.sh >> /tmp/news_aggregator.log 2>&1") | crontab -
```

## Troubleshooting
- **No news found**: Lower relevance threshold in script (line 183: `if relevance < 2`)
- **Connection error**: Verify .env credentials
- **Not running**: Check `tail -f /tmp/news_aggregator.log`

See [NEWS_AGGREGATOR_SETUP.md](NEWS_AGGREGATOR_SETUP.md) for full documentation.
