import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Manually parse .env.local to avoid dotenv URL issues
const envContent = readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

function stripJavaScript(text) {
  if (!text) return text;
  let cleaned = text;
  const lines = cleaned.split('\n');
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^\s*\(function\s*\(/.test(trimmed)) return false;
    if (/^\s*(function|var|const|let)\s/.test(trimmed)) return false;
    if (/\b(document|window|console)\./.test(trimmed)) return false;
    if (/\b(FB\.ui|FB\.init|facebook|jssdk|recordSharing|copyToClipboard|setTwitter|setFacebook|setLinkedIn|setWhatsApp|setCopy)/i.test(trimmed)) return false;
    if (/\$\.ajax|\$\.getJSON|\$\.post|document\.execCommand/.test(trimmed)) return false;
    if (/^\s*\}\s*\)\s*;?\s*$/.test(trimmed)) return false;
    if (/^\s*else\s*\{?\s*$/.test(trimmed)) return false;
    if (/^\s*,\s*(function|error|success)\s*:/.test(trimmed)) return false;
    return true;
  });
  cleaned = filtered.join('\n');
  cleaned = cleaned.replace(/\(\(document[^\n]*/g, '');
  cleaned = cleaned.replace(/https?:\/\/arg\.am\/[^\s]*/gi, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function sanitizeContent(text) {
  if (!text) return text;
  let cleaned = String(text);
  cleaned = cleaned.replace(/أرقام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/أرقـام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/argaam/gi, 'marfa.sa');
  cleaned = cleaned.replace(/Argaam/gi, 'marfa.sa');
  cleaned = stripJavaScript(cleaned);
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

async function main() {
  const baseUrl = URL + '/rest/v1/financial_news_articles';
  const headers = { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' };

  const res = await fetch(baseUrl + '?select=id,slug,title,summary,full_content&order=created_at.desc', { headers });
  const articles = await res.json();
  console.log('Fetched', articles.length, 'articles');

  let cleaned = 0, skipped = 0;
  for (const article of articles) {
    const newSummary = sanitizeContent(article.summary || '');
    const newFull = sanitizeContent(article.full_content || '');
    const summaryChanged = newSummary !== (article.summary || '');
    const fullChanged = newFull !== (article.full_content || '');

    if (!summaryChanged && !fullChanged) { skipped++; continue; }

    const patchRes = await fetch(baseUrl + '?id=eq.' + article.id, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary: newSummary, full_content: newFull || null })
    });

    if (patchRes.ok) {
      cleaned++;
      if (cleaned <= 5 || cleaned % 10 === 0) console.log('CLEANED:', article.slug.slice(0, 60));
    } else {
      console.error('FAILED:', article.slug.slice(0, 50), patchRes.status, await patchRes.text());
    }
  }
  console.log('\nDone. Cleaned:', cleaned, 'Skipped:', skipped);
}

main().catch(e => console.error(e));
