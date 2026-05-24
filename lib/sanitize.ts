/**
 * Content sanitization — strip ALL third-party source references,
 * leaked Claude prompt artifacts, and JavaScript code.
 *
 * All content on marfa.sa must appear as original marfa.sa content.
 * Never expose the scraping source (Argaam or any other) to visitors.
 */

/**
 * Strip JavaScript code artifacts that get scraped along with article text.
 * Argaam pages embed share-button scripts inline — remove them aggressively.
 */
function stripJavaScript(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // Remove lines that are entirely or primarily JavaScript
  const lines = cleaned.split('\n');
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (!trimmed) return false; // drop blank lines (handled later)

    // Pure JS indicators — drop the whole line
    if (/^\s*\(function\s*\(/.test(trimmed)) return false;
    if (/^\s*(function|var|const|let)\s/.test(trimmed)) return false;
    if (/\b(document|window|console)\./.test(trimmed)) return false;
    if (/\b(FB\.ui|FB\.init|facebook|jssdk|recordSharing|copyToClipboard|setTwitter|setFacebook|setLinkedIn|setWhatsApp|setCopy)/i.test(trimmed)) return false;
    if (/\$\.ajax|\$\.getJSON|\$\.post|document\.execCommand/.test(trimmed)) return false;
    if (/^\s*\}\s*\)\s*;?\s*$/.test(trimmed)) return false; // closing }); patterns
    if (/^\s*else\s*\{?\s*$/.test(trimmed)) return false;
    if (/^\s*,\s*(function|error|success)\s*:/.test(trimmed)) return false; // AJAX callback params

    // Argaam-specific JS variable names and share-button code
    if (/\b(cmtnrd|cmntrd|_us|burl|asyncVal|turl)\b/.test(trimmed)) return false;
    if (/\$temp\./.test(trimmed)) return false; // jQuery $temp assignments
    if (/^\s*\$\(/.test(trimmed)) return false; // jQuery selectors e.g. $("body")
    if (/^\s*(type|url|data|success|error|dataType|async)\s*:\s*/.test(trimmed)) return false;
    if (/'\/ar\/record/.test(trimmed)) return false;
    if (/shareToFacebook|openInNewTab|setToolTip/.test(trimmed)) return false;
    if (/'block'|'none'|'json'/.test(trimmed) && /display|dataType/.test(trimmed)) return false;
    if (/#copy_url|#facebookbtn|data-href/.test(trimmed)) return false;

    // Lines that are just JS punctuation/syntax in a code block
    if (/^\s*\}\)?\s*;?\s*$/.test(trimmed)) return false;
    if (/^\s*\);\s*$/.test(trimmed)) return false;
    if (/^\s*\}\)?\s*\)?\s*;?\s*$/.test(trimmed)) return false;

    // Lines that look like object properties (key: value, with JS-like values)
    if (/^\s*\w+\s*:\s*['"]\/ar\//.test(trimmed)) return false;

    // JS-only statements that can never be Arabic content
    if (/^\s*return false;\s*$/.test(trimmed)) return false;
    if (/^\s*\)\.fail\(\);\s*$/.test(trimmed)) return false;
    if (/^\s*if\s*\(cmntrd/.test(trimmed)) return false;
    if (/^\s*\{\s*$/.test(trimmed)) return false;

    return true;
  });

  cleaned = filtered.join('\n');

  // Remove inline JS patterns (everything from "((document" to the next line break)
  cleaned = cleaned.replace(/\(\(document[^\n]*/g, '');

  // Remove URL-like patterns that are really Argaam share links
  cleaned = cleaned.replace(/https?:\/\/arg\.am\/[^\s]*/gi, '');

  // Remove Argaam date/attribution stamps embedded in content
  cleaned = cleaned.replace(/\b\d{4}\/\d{2}\/\d{2}\s+marfa\.sa\s*-\s*خاص\s*/g, '');
  cleaned = cleaned.replace(/\b\d{4}\/\d{2}\/\d{2}\s*\n\s*marfa\.sa\s*-\s*خاص\s*/g, '');

  // Clean up multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Strip ALL references to Argaam/أرقام from any text.
 * Also removes source attribution patterns and leaked prompt artifacts.
 */
export function sanitizeContent(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // ── Source brand references ──────────────────────────────────────

  cleaned = cleaned.replace(/أرقام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/أرقـام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/argaam/gi, 'marfa.sa');
  cleaned = cleaned.replace(/Argaam/gi, 'marfa.sa');

  cleaned = cleaned.replace(/ـ خاص\s*/g, '');
  cleaned = cleaned.replace(/\s*خاص\s*$/g, '');
  cleaned = cleaned.replace(/\bخاص\b/g, '');
  cleaned = cleaned.replace(/لـ\s*marfa\.sa\s*[:\-]?\s*/g, '');

  cleaned = cleaned.replace(/https?:\/\/[^\s]*argaam[^\s]*/gi, '');
  cleaned = cleaned.replace(/شاشة تداول.*?ترصد.*?[""][^""]*[""]\s*/g, '');
  cleaned = cleaned.replace(/[""]أرقـام[""]/g, '');

  // ── Claude "here's your SEO title" preamble ─────────────────────

  cleaned = cleaned.replace(/^إليك عنوان SEO محسّن[：:]\s*/gim, '');
  cleaned = cleaned.replace(/^إليك عنواناً محسّناً[：:]\s*/gim, '');

  // ── Strip trailing analysis from titles ──────────────────────────
  // The real title is everything before these markers:

  // "--- **تحليل العنوان:** ..." (and everything after)
  cleaned = cleaned.replace(/\s*---+\s*\*\*تحليل العنوان[：:]\*\*[\s\S]*$/gim, '');
  cleaned = cleaned.replace(/\s*---+\s*\*\*البدائل[：:]\*\*[\s\S]*$/gim, '');

  // " **عدد الأحرف:** XX حرف ..." (and everything after)
  cleaned = cleaned.replace(/\s*\*\*عدد الأحرف[：:]\*\*[\s\S]*$/gim, '');
  cleaned = cleaned.replace(/\s*\*\*الكلمة المفتاحية[：:]\*\*[\s\S]*$/gim, '');
  cleaned = cleaned.replace(/\s*\*\*مزايا هذا العنوان[：:]\*\*[\s\S]*$/gim, '');
  cleaned = cleaned.replace(/\s*\*\*تحليل العنوان[：:]\*\*[\s\S]*$/gim, '');

  // "الكلمات المفتاحية المستخدمة: ..." (and everything after)
  cleaned = cleaned.replace(/\s*الكلمات المفتاحية المستخدمة[：:][\s\S]*$/gim, '');

  // "هذا العنوان:" / "هذا العنوان محسّن" followed by analysis
  cleaned = cleaned.replace(/\s*هذا العنوان[：:]\s*[\s\S]*$/gim, '');
  cleaned = cleaned.replace(/\s*العنوان محسّن لمحركات البحث[\s\S]*$/gim, '');

  // "**(XX حرف ...)**" and "*(XX حرف ...)*" trailing metadata
  cleaned = cleaned.replace(/\s*\*{1,2}\(\d{2}\s*حرف[^)]*\)\*{1,2}\s*$/g, '');
  cleaned = cleaned.replace(/\s*\(\d{2}\s*حرف[^)]*\)\s*$/g, '');

  // "**(XX حرف بالضبط)**" variants
  cleaned = cleaned.replace(/\s*\*{1,2}\d{2}\s*حرف[^*]*\*{1,2}\s*$/g, '');

  // Strip bullet-point analysis lines that follow a title on the same line
  cleaned = cleaned.replace(/\s*-\s*عدد الأحرف[：:][^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*يتضمن (?:الكلمة|كلمتين) المفتاحية[^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*الكلمة المفتاحية المستخدمة[：:][^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*يحافظ على[^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*واضح ومباشر[^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*مزايا هذا العنوان[：:][^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*✅\s*[^\n]*/g, '');
  cleaned = cleaned.replace(/\s*-\s*✓\s*[^\n]*/g, '');

  // Remove standalone bold prompt artifacts
  cleaned = cleaned.replace(/^\*\*العنوان المحسّن[：:]\s*\*\*\s*/gm, '');
  cleaned = cleaned.replace(/^العنوان المحسّن[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^تحليل العنوان[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^التحليل[：:]\s*/gm, '');

  // Remove markdown headings that are just prompt instructions
  cleaned = cleaned.replace(/^#+\s*العنوان المحسّن.*$/gm, '');
  cleaned = cleaned.replace(/^#+\s*تحليل العنوان.*$/gm, '');

  // Strip any JavaScript code that leaked through
  cleaned = stripJavaScript(cleaned);

  // Clean up whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Sanitize a title specifically — more aggressive stripping.
 * If the title has leaked Claude analysis, extract just the actual title.
 */
export function sanitizeTitle(title: string): string {
  if (!title) return title;

  let cleaned = sanitizeContent(title);

  // If after sanitization the title is still very long (>120 chars),
  // it's likely still an analysis blob. Extract the first sentence/line.
  if (cleaned.length > 120) {
    // Take first line that looks like a title (30+ chars, no bullet)
    const lines = cleaned.split(/[\n\r]+/).filter(l => l.trim().length >= 30 && !l.trim().startsWith('-') && !l.trim().startsWith('*'));
    if (lines.length > 0) {
      cleaned = lines[0].trim();
    }
  }

  // Strip any remaining ** markers around the title
  cleaned = cleaned.replace(/^\*{1,2}\s*/g, '');
  cleaned = cleaned.replace(/\s*\*{1,2}$/g, '');

  return cleaned;
}
