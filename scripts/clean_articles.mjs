import { readFileSync } from 'fs';

const env = {};
readFileSync('.env.local','utf8').split('\n').forEach(l => { const m = l.match(/^([^=]+)=(.*)/); if(m) env[m[1]]=m[2]; });
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY;

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
    if (/\b(cmtnrd|cmntrd|_us|burl|asyncVal|turl)\b/.test(trimmed)) return false;
    if (/\$temp\./.test(trimmed)) return false;
    if (/^\s*\$\(/.test(trimmed)) return false;
    if (/^\s*(type|url|data|success|error|dataType|async)\s*:\s*/.test(trimmed)) return false;
    if (/'\/ar\/record/.test(trimmed)) return false;
    if (/shareToFacebook|openInNewTab|setToolTip/.test(trimmed)) return false;
    if (/'block'|'none'|'json'/.test(trimmed) && /display|dataType/.test(trimmed)) return false;
    if (/#copy_url|#facebookbtn|data-href/.test(trimmed)) return false;
    if (/^\s*\}\)?\s*;?\s*$/.test(trimmed)) return false;
    if (/^\s*\);\s*$/.test(trimmed)) return false;
    if (/^\s*\}\)?\s*\)?\s*;?\s*$/.test(trimmed)) return false;
    if (/^\s*\w+\s*:\s*['"]\/ar\//.test(trimmed)) return false;
    if (/^\s*return false;\s*$/.test(trimmed)) return false;
    if (/^\s*\)\.fail\(\);\s*$/.test(trimmed)) return false;
    if (/^\s*if\s*\(cmntrd/.test(trimmed)) return false;
    if (/^\s*\{\s*$/.test(trimmed)) return false;
    return true;
  });
  cleaned = filtered.join('\n');
  cleaned = cleaned.replace(/\(\(document[^\n]*/g, '');
  cleaned = cleaned.replace(/https?:\/\/arg\.am\/[^\s]*/gi, '');
  cleaned = cleaned.replace(/\b\d{4}\/\d{2}\/\d{2}\s+marfa\.sa\s*-\s*خاص\s*/g, '');
  cleaned = cleaned.replace(/\b\d{4}\/\d{2}\/\d{2}\s*\n\s*marfa\.sa\s*-\s*خاص\s*/g, '');
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

  const res = await fetch(baseUrl + '?select=id,slug,summary,full_content&order=created_at.desc', { headers });
  const articles = await res.json();
  console.log('Fetched', articles.length, 'articles');

  let polluted = 0;
  for (const a of articles) {
    const ns = sanitizeContent(a.summary || '');
    const nf = sanitizeContent(a.full_content || '');
    if (ns !== (a.summary || '') || nf !== (a.full_content || '')) polluted++;
  }
  console.log('Articles needing cleaning:', polluted);

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
      console.log('CLEANED:', article.slug.slice(0, 60));
    } else {
      console.error('FAILED:', article.slug.slice(0, 50), patchRes.status);
    }
  }
  console.log('\nDone. Cleaned:', cleaned, 'Skipped:', skipped);
}

main().catch(e => console.error(e));
