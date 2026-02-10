#!/bin/bash
# Simple cron setup for news aggregator
# This will run every hour and fetch fresh news

# Add the cron job
(crontab -l 2>/dev/null | grep -v "news_aggregator.py"; echo "0 * * * * cd /Volumes/Samsung/investment-bridge/scripts && /Library/Frameworks/Python.framework/Versions/3.10/bin/python3 news_aggregator.py >> /tmp/news_aggregator.log 2>&1") | crontab -

echo "✅ Cron job installed!"
echo "News will be fetched automatically every hour."
echo ""
echo "To check if it's working:"
echo "  tail -f /tmp/news_aggregator.log"
echo ""
echo "To see current cron jobs:"
echo "  crontab -l"
echo ""
echo "To test manually:"
echo "  python3 news_aggregator.py"
