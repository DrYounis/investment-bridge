# 🚀 marfa-argaam-scraper

**مجمع الأخبار المالية السعودية من أرقام مع تلخيص بالذكاء الاصطناعي**

Next.js 14+ application that scrapes Saudi financial news from [Argaam.com](https://www.argaam.com), summarizes articles using Anthropic's Claude API, and saves them as uniquely-named markdown files.

---

## 📁 Project Structure

```
marfa-argaam-scraper/
├── app/
│   ├── api/
│   │   ├── scrape/argaam/route.ts    ← POST trigger, GET status
│   │   └── cron/daily/route.ts       ← Scheduled daily scrape
│   ├── dashboard/page.tsx            ← Dashboard UI
│   ├── layout.tsx                    ← Root layout (RTL/Arabic)
│   └── page.tsx                      ← Landing page
├── components/
│   ├── ArticleCard.tsx               ← Reusable article card
│   └── ScraperStatus.tsx             ← Status overview cards
├── lib/
│   ├── scraper.ts                    ← Puppeteer-based web scraper
│   ├── summarizer.ts                 ← Claude AI summarization
│   └── markdown.ts                   ← Markdown file generation
├── content/news/argaam/              ← Saved markdown files
│   └── EXAMPLE.md                    ← Example output format
├── scripts/
│   └── manual-scrape.ts              ← CLI manual scrape tool
├── .env.example                      ← Environment variables template
└── README.md
```

---

## 🔧 Setup

### 1. Install dependencies

```bash
cd marfa-argaam-scraper
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
CRON_SECRET=your_random_secret_token_here
```

**Get an Anthropic API key:** https://console.anthropic.com/

### 3. Run locally

```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

---

## 🎯 Usage

### Web Dashboard

1. Open `http://localhost:3000/dashboard`
2. Select number of articles (1-10)
3. Click **"بدء التجريف"** (Start Scraping)
4. Wait ~1-2 minutes while articles are scraped and summarized
5. View results in the table and file browser

### Manual CLI Scrape

```bash
# Scrape 5 articles (default)
npm run scrape

# Scrape 10 articles
npm run scrape -- --max=10
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/scrape/argaam` | Status check + list saved files |
| `POST` | `/api/scrape/argaam` | Trigger scraping (body: `{ "maxArticles": 5 }`) |
| `GET`/`POST` | `/api/cron/daily?token=SECRET` | Scheduled daily trigger |

### Cron / Scheduled Scraping

Protect the cron endpoint with a secret token:

1. Set `CRON_SECRET` in `.env.local`
2. Configure an external cron service (Vercel Cron, cron-job.org, etc.)
3. Call: `GET /api/cron/daily?token=YOUR_SECRET`

**Vercel Cron example** (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/daily?token=YOUR_SECRET",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs daily at 8:00 AM Riyadh time (configured for UTC+3 in Vercel).

---

## 📄 Output Format

Each scraped article is saved as:

```
content/news/argaam/2026-05-23-السوق-السعودي-يرتفع-123456.md
```

Files include YAML frontmatter with:
- SEO-optimized title
- Original title
- Source URL
- Publication date
- Tags and keywords
- Full markdown body with summary + original content

See `content/news/argaam/EXAMPLE.md` for the exact format.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, API routes, RSC |
| **TypeScript** | Type safety |
| **Puppeteer** | Web scraping (Argaam has JS-rendered content) |
| **Claude API** | AI summarization (Sonnet 4) |
| **gray-matter** | YAML frontmatter parsing |
| **Tailwind CSS** | Styling + dark mode + RTL |
| **date-fns** | Date formatting |

---

## 🐛 Troubleshooting

### "Cannot find module 'puppeteer'"
```bash
npm install
```

### "ANTHROPIC_API_KEY is not set"
Create `.env.local` with your Anthropic API key.

### No articles found
Argaam may have changed their HTML structure. Check `lib/scraper.ts` selectors and update as needed. Run with `headless: false` for debugging:
```ts
// In lib/scraper.ts, change:
headless: false,  // see what the browser sees
```

### 504 Timeout
Scraping 10 articles with Claude summaries takes ~1-2 minutes. For Vercel (10s timeout on hobby), use the Pro plan or trigger via cron instead.

---

## 📦 Deployment

### Vercel
```bash
npm run build
# Deploy via Vercel Git integration
```

Add `ANTHROPIC_API_KEY` and `CRON_SECRET` in Vercel Environment Variables.

### VPS / PM2
```bash
npm run build
npm start
# Or with PM2:
pm2 start npm --name "argaam-scraper" -- start
```

---

**© marfa.sa — Saudi Investment Platform**
