#!/usr/bin/env python3
"""
Automated News Aggregator for marfa.sa
Fetches financial news from multiple sources and inserts into Supabase
"""

import os
import sys
import json
import time
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests
import feedparser
from bs4 import BeautifulSoup
import ssl

# Bypass SSL verification for legacy feeds
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

# Supabase Configuration
def load_env_file():
    """Load .env file manually if python-dotenv is not installed"""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        try:
            with open(env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        if key not in os.environ:
                            os.environ[key] = value.strip()
            print("✓ Loaded configuration from .env file")
        except Exception as e:
            print(f"Warning: Could not read .env file: {e}")

# Load environment variables
load_env_file()

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set")
    print("Please check your .env file in the scripts directory.")
    sys.exit(1)

# News Sources Configuration
NEWS_SOURCES = {
    'argaam': {
        'enabled': True,
        'rss': 'https://www.argaam.com/ar/rss/latest-news',
        'source_type': 'local',
        'language': 'ar'
    },
    'yahoo_finance': {
        'enabled': True,
        'rss': 'https://finance.yahoo.com/news/rssindex',
        'source_type': 'global',
        'language': 'en'
    },
    'marketwatch': {
        'enabled': True,
        'rss': 'https://www.marketwatch.com/rss/markets',
        'source_type': 'global',
        'language': 'en'
    },
    'investing_com_ar': {
        'enabled': True,
        'rss': 'https://arabic.investing.com/rss/news.rss',
        'source_type': 'global',
        'language': 'ar'
    }
}

# Keywords for relevance scoring (Saudi investment/entrepreneurship focus)
KEYWORDS = {
    'high_priority': [
        'استثمار', 'investment', 'رأس المال', 'capital', 'ريادة الأعمال', 'entrepreneurship',
        'السعودية', 'saudi', 'حائل', 'hail', 'رؤية 2030', 'vision 2030',
        'شركات ناشئة', 'startup', 'تمويل', 'funding', 'مستثمر', 'investor'
    ],
    'medium_priority': [
        'أسهم', 'stocks', 'سوق', 'market', 'اقتصاد', 'economy', 'تجارة', 'trade',
        'مشروع', 'project', 'أعمال', 'business', 'مالية', 'financial'
    ],
    'low_priority': [
        'تقنية', 'technology', 'ابتكار', 'innovation', 'رقمي', 'digital'
    ],
    'exclude': [
        'رياضة', 'sports', 'فن', 'entertainment', 'سياسة', 'politics'
    ]
}


class NewsAggregator:
    def __init__(self):
        self.supabase_headers = {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
            'Content-Type': 'application/json'
        }
        self.seen_hashes = set()
        self.load_existing_hashes()

    def load_existing_hashes(self):
        """Load hashes of existing news items to avoid duplicates"""
        try:
            # Fetch news from last 7 days
            seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
            url = f"{SUPABASE_URL}/rest/v1/news_feed?created_at=gte.{seven_days_ago}"
            
            response = requests.get(url, headers=self.supabase_headers)
            if response.status_code == 200:
                existing_news = response.json()
                for item in existing_news:
                    content_hash = self._hash_content(item.get('text', ''))
                    self.seen_hashes.add(content_hash)
                print(f"Loaded {len(self.seen_hashes)} existing news hashes")
        except Exception as e:
            print(f"Warning: Could not load existing hashes: {e}")

    def _hash_content(self, text: str) -> str:
        """Create hash of news content for duplicate detection"""
        normalized = text.lower().strip()
        return hashlib.md5(normalized.encode()).hexdigest()

    def calculate_relevance_score(self, text: str, title: str = '') -> int:
        """Calculate relevance score based on keywords"""
        content = (title + ' ' + text).lower()
        score = 0
        
        # Check exclude keywords first
        for keyword in KEYWORDS['exclude']:
            if keyword.lower() in content:
                return 0
        
        # Add points for priority keywords
        for keyword in KEYWORDS['high_priority']:
            if keyword.lower() in content:
                score += 3
        
        for keyword in KEYWORDS['medium_priority']:
            if keyword.lower() in content:
                score += 2
        
        for keyword in KEYWORDS['low_priority']:
            if keyword.lower() in content:
                score += 1
        
        return score

    def fetch_rss_feed(self, source_name: str, config: Dict) -> List[Dict]:
        """Fetch and parse RSS feed"""
        news_items = []
        
        try:
            print(f"Fetching {source_name}...")
            feed = feedparser.parse(config['rss'])
            
            for entry in feed.entries[:10]:  # Limit to 10 most recent
                title = entry.get('title', '')
                link = entry.get('link', '')
                
                # Get description/summary
                text = entry.get('summary', entry.get('description', title))
                if text:
                    # Clean HTML tags
                    text = BeautifulSoup(text, 'html.parser').get_text()
                    text = text.strip()[:500]  # Limit length
                
                # Calculate relevance
                relevance = self.calculate_relevance_score(text, title)
                
                # Skip if not relevant enough (lowered threshold for more news)
                if relevance < 1:
                    continue
                
                # Check for duplicates
                content_hash = self._hash_content(text)
                if content_hash in self.seen_hashes:
                    continue
                
                # Determine category based on content
                category = self._determine_category(text, title)
                
                news_items.append({
                    'source': config['source_type'],
                    'category': category,
                    'text': text[:500],  # Limit to 500 chars
                    'link': link,
                    'relevance_score': relevance,
                    'hash': content_hash
                })
                
                self.seen_hashes.add(content_hash)
            
            print(f"  ✓ Found {len(news_items)} relevant items from {source_name}")
            
        except Exception as e:
            print(f"  ✗ Error fetching {source_name}: {e}")
        
        return news_items

    def _determine_category(self, text: str, title: str) -> str:
        """Determine news category based on content"""
        content = (title + ' ' + text).lower()
        
        if any(kw in content for kw in ['حائل', 'hail']):
            return 'فرص حائل'
        elif any(kw in content for kw in ['سعودية', 'saudi', 'تاسي', 'tadawul']):
            return 'السوق السعودي'
        elif any(kw in content for kw in ['استثمار', 'investment', 'vc', 'رأس المال']):
            return 'مصطلح استثماري'
        elif any(kw in content for kw in ['لوائح', 'قانون', 'regulation', 'legal']):
            return 'لوائح'
        else:
            return 'أخبار عامة'

    def insert_to_supabase(self, news_items: List[Dict]) -> int:
        """Insert news items into Supabase"""
        if not news_items:
            return 0
        
        # Sort by relevance score
        news_items = sorted(news_items, key=lambda x: x['relevance_score'], reverse=True)
        
        # Take top 20 items
        news_items = news_items[:20]
        
        # Prepare for insertion
        insert_data = []
        for item in news_items:
            insert_data.append({
                'source': item['source'],
                'category': item['category'],
                'text': item['text'],
                'link': item['link']
            })
        
        try:
            url = f"{SUPABASE_URL}/rest/v1/news_feed"
            response = requests.post(
                url,
                headers=self.supabase_headers,
                json=insert_data
            )
            
            if response.status_code in [200, 201]:
                print(f"\n✓ Successfully inserted {len(insert_data)} news items into Supabase")
                return len(insert_data)
            else:
                print(f"\n✗ Error inserting to Supabase: {response.status_code}")
                print(f"Response: {response.text}")
                return 0
                
        except Exception as e:
            print(f"\n✗ Exception inserting to Supabase: {e}")
            return 0

    def cleanup_old_news(self, days: int = 7):
        """Remove news items older than specified days"""
        try:
            cutoff = (datetime.now() - timedelta(days=days)).isoformat()
            url = f"{SUPABASE_URL}/rest/v1/news_feed?created_at=lt.{cutoff}"
            
            response = requests.delete(url, headers=self.supabase_headers)
            
            if response.status_code in [200, 204]:
                print(f"✓ Cleaned up news older than {days} days")
            
        except Exception as e:
            print(f"Warning: Could not cleanup old news: {e}")

    def run(self):
        """Main execution"""
        print(f"\n{'='*60}")
        print(f"News Aggregator Starting - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}\n")
        
        all_news = []
        
        # Fetch from all enabled sources
        for source_name, config in NEWS_SOURCES.items():
            if config.get('enabled'):
                items = self.fetch_rss_feed(source_name, config)
                all_news.extend(items)
                time.sleep(1)  # Be nice to servers
        
        # Insert to Supabase
        if all_news:
            inserted = self.insert_to_supabase(all_news)
            
            # Cleanup old news
            self.cleanup_old_news(days=7)
            
            print(f"\n{'='*60}")
            print(f"Summary: {inserted} new items added")
            print(f"{'='*60}\n")
        else:
            print("\nNo new relevant news items found.\n")


if __name__ == '__main__':
    aggregator = NewsAggregator()
    aggregator.run()
