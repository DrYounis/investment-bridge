/**
 * Draws a clean text-only repeating header on EVERY page of ALL 28 PDFs.
 * Uses pdf-lib with embedded Cairo font for Arabic + English text.
 * NO QR code, NO images, NO fixed/absolute positioning.
 * 
 * Run: node scripts/draw-marfa-header.mjs
 */

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CASE_STUDIES_DIR = path.resolve(__dirname, '..', 'public', 'case-studies');
const CAIRO_FONT_PATH = path.resolve(__dirname, '..', 'fonts', 'Cairo.ttf');

const TOPICS = [
  'Airbnb_Strategy', 'Amazon_Operations', 'Google_Aristotle_HR',
  'IKEA_Expansion', 'JnJ_Crisis', 'Liquid_Death_Marketing',
  'Netflix_Innovation', 'Patagonia_Sustainability', 'Quibi_Feasibility',
  'Saudi_German_Health', 'SharkTank_Negotiation', 'Theranos_Risk',
  'WeWork_Finance', 'Zappos_Leadership',
];

const NAVY = rgb(0.039, 0.059, 0.118);
const GOLD = rgb(0.788, 0.659, 0.298);
const WHITE = rgb(1, 1, 1);
const CREAM = rgb(0.847, 0.835, 0.800);

const A4_W = 595, A4_H = 842;
// Header height: 30mm ≈ 85pt — tall enough to fully cover original content + 8mm breathing gap below gold line
const HEADER_H = 85;

function filename(topic, isArabic) {
  return topic + (isArabic ? '_Arabic_Case_Study.pdf' : '_Case_Study.pdf');
}

async function main() {
  // 1. Load Cairo font
  let cairoBytes = null;
  let fontGateBilingual = false;
  try {
    cairoBytes = fs.readFileSync(CAIRO_FONT_PATH);
    // Verify font can be embedded
    const tmpDoc = await PDFDocument.create();
    tmpDoc.registerFontkit(fontkit);
    await tmpDoc.embedFont(cairoBytes);
    fontGateBilingual = true;
    console.log('Font gate: BILINGUAL (Cairo loaded OK)');
  } catch (e) {
    console.log('Font gate: ENGLISH-ONLY (', e.message, ')');
  }

  // 2. Process all PDFs
  let ok = 0, fail = 0;

  for (const topic of TOPICS) {
    for (const isArabic of [true, false]) {
      const fname = filename(topic, isArabic);
      const fp = path.join(CASE_STUDIES_DIR, fname);

      if (!fs.existsSync(fp)) {
        console.log(`SKIP ${fname}`);
        continue;
      }

      try {
        const doc = await PDFDocument.load(fs.readFileSync(fp));
        doc.registerFontkit(fontkit);

        let embeddedFont = undefined;
        if (fontGateBilingual && cairoBytes) {
          embeddedFont = await doc.embedFont(cairoBytes);
        }

        const pages = doc.getPages();
        for (const page of pages) {
          const { width: w, height: h } = page.getSize();

          // Navy header background
          page.drawRectangle({ x: 0, y: h - HEADER_H, width: w, height: HEADER_H, color: NAVY });

          // Gold rule below header
          page.drawLine({
            start: { x: 0, y: h - HEADER_H },
            end: { x: w, y: h - HEADER_H },
            thickness: 2,
            color: GOLD,
          });

          if (fontGateBilingual && embeddedFont) {
            // ── BILINGUAL: separate draw calls per script to avoid bidi reversal ──
            const ar = '\u0645\u0631\u0641\u0623';
            const en = 'MARFA.SA';
            const arSlogan = '\u062D\u064A\u062B \u062A\u064E\u0631\u0633\u0648 \u0627\u0644\u0637\u0645\u0648\u062D\u0627\u062A \u2014';
            const enSlogan = 'MBA Case Study';

            // Line 1: Arabic brand + English domain
            const arW = embeddedFont.widthOfTextAtSize(ar, 15);
            page.drawText(ar, { x: 22, y: h - 18, size: 15, color: GOLD, font: embeddedFont });
            page.drawText(en, { x: 22 + arW + 6, y: h - 18, size: 9, color: WHITE, font: embeddedFont });

            // Line 2: Arabic slogan + English tagline
            const arSloganW = embeddedFont.widthOfTextAtSize(arSlogan, 8);
            page.drawText(arSlogan, { x: 22, y: h - 38, size: 8, color: CREAM, font: embeddedFont });
            page.drawText(enSlogan, { x: 22 + arSloganW + 4, y: h - 38, size: 8, color: CREAM, font: embeddedFont });
          } else {
            // ── ENGLISH-ONLY fallback ──
            page.drawText('MARFA.SA', { x: 22, y: h - 18, size: 15, color: GOLD });
            page.drawText('Where Ambitions Anchor \u2014 MBA Case Study', {
              x: 22, y: h - 38, size: 8, color: CREAM,
            });
          }
        }

        fs.writeFileSync(fp, await doc.save());
        console.log(`OK   ${fname} (${pages.length}p, ${fontGateBilingual ? 'bilingual' : 'english'})`);
        ok++;
      } catch (e) {
        console.error(`FAIL ${fname}: ${e.message}`);
        fail++;
      }
    }
  }

  console.log(`\nDone: ${ok} OK, ${fail} failed`);
  if (ok !== 28) console.error(`WARNING: expected 28, got ${ok}`);
}

main().catch(e => { console.error(e); process.exit(1); });
