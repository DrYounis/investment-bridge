/**
 * Content sanitization — strip ALL third-party source references.
 *
 * All content on marfa.sa must appear as original marfa.sa content.
 * Never expose the scraping source (Argaam or any other) to visitors.
 */

/**
 * Strip ALL references to Argaam/أرقام from any text.
 * Also removes source attribution patterns and leaked prompt artifacts.
 */
export function sanitizeContent(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // ── Source brand references ──────────────────────────────────────

  // Argaam references (Arabic + English + encoded variants)
  cleaned = cleaned.replace(/أرقام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/أرقـام/gi, 'marfa.sa');
  cleaned = cleaned.replace(/argaam/gi, 'marfa.sa');
  cleaned = cleaned.replace(/Argaam/gi, 'marfa.sa');

  // Remove source attribution patterns
  cleaned = cleaned.replace(/ـ خاص\s*/g, '');
  cleaned = cleaned.replace(/\s*خاص\s*$/g, '');
  cleaned = cleaned.replace(/\bخاص\b/g, '');
  cleaned = cleaned.replace(/لـ\s*marfa\.sa\s*[:\-]?\s*/g, '');

  // Remove Argaam-specific URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]*argaam[^\s]*/gi, '');

  // Remove "شاشة تداول السوق السعودي ترصد "أرقـام"" pattern
  cleaned = cleaned.replace(/شاشة تداول.*?ترصد.*?[""][^""]*[""]\s*/g, '');
  cleaned = cleaned.replace(/[""]أرقـام[""]/g, '');

  // ── Claude prompt artifacts (in case they leak) ──────────────────

  cleaned = cleaned.replace(/^\*\*العنوان المحسّن[：:]\s*\*\*\s*/gm, '');
  cleaned = cleaned.replace(/^\*\*تحليل العنوان[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*عدد الأحرف[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*الكلمة المفتاحية[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^\*\*مزايا هذا العنوان[：:]\s*\*\*[\s\S]*?(?=\n|$)/gm, '');
  cleaned = cleaned.replace(/^العنوان المحسّن[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^تحليل العنوان[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^التحليل[：:]\s*/gm, '');
  cleaned = cleaned.replace(/^#+\s*العنوان المحسّن.*$/gm, '');
  cleaned = cleaned.replace(/^#+\s*تحليل العنوان.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*عدد الأحرف[：:].*$/gm, '');
  cleaned = cleaned.replace(/^-\s*يتضمن الكلمة المفتاحية.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*الكلمة المفتاحية المستخدمة[：:].*$/gm, '');
  cleaned = cleaned.replace(/^-\s*يحافظ على.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*واضح ومباشر.*$/gm, '');
  cleaned = cleaned.replace(/^-\s*مزايا هذا العنوان[：:].*$/gm, '');

  // Remove consecutive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}
