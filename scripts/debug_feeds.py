import feedparser

feeds = [
    'https://www.argaam.com/ar/rss/latest-news',
    'https://finance.yahoo.com/news/rssindex',
    'https://www.marketwatch.com/rss/markets'
]

print("Testing RSS Feeds...")
for url in feeds:
    print(f"\n--- {url} ---")
    try:
        d = feedparser.parse(url)
        print(f"Status: {d.get('status', 'Unknown')}")
        print(f"Entries found: {len(d.entries)}")
        if d.entries:
            print(f"First title: {d.entries[0].title}")
        else:
            print("No entries found!")
            if 'bozo_exception' in d:
                print(f"Error: {d.bozo_exception}")
    except Exception as e:
        print(f"Exception: {e}")
