/**
 * Generates two single-page header PDFs (Arabic + English) using Puppeteer,
 * then uses pdf-lib to prepend them to all 28 case study PDFs.
 * 
 * Run: node scripts/prepend-marfa-header.mjs
 */

import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CASE_STUDIES_DIR = path.resolve(__dirname, '..', 'public', 'case-studies');
const HEADER_AR_PATH = path.join(CASE_STUDIES_DIR, '_header_ar.pdf');
const HEADER_EN_PATH = path.join(CASE_STUDIES_DIR, '_header_en.pdf');

const TOPICS = [
  'Airbnb_Strategy', 'Amazon_Operations', 'Google_Aristotle_HR',
  'IKEA_Expansion', 'JnJ_Crisis', 'Liquid_Death_Marketing',
  'Netflix_Innovation', 'Patagonia_Sustainability', 'Quibi_Feasibility',
  'Saudi_German_Health', 'SharkTank_Negotiation', 'Theranos_Risk',
  'WeWork_Finance', 'Zappos_Leadership',
];

// QR base64 (same as used in generate-new-arabic-pdfs.mjs)
const QR_B64 = "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";

function headerHTML(isArabic) {
  const slogan = isArabic
    ? 'حيث تَرسو الطموحات — دراسة حالة MBA'
    : 'Where Ambitions Anchor — MBA Case Study';
  const dir = isArabic ? 'rtl' : 'ltr';
  return `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${dir}">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .marfa-header { background: #0a0f1e; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; direction: ${dir}; height: 52px; }
  .brand-name { font-size: 20pt; font-weight: 700; color: #c9a84c; }
  .domain { font-size: 10pt; color: #ffffff; font-weight: 400; }
  .slogan { font-size: 9pt; color: #d8d5cc; margin-top: 2px; }
  .qr-block { text-align: center; }
  .qr-frame { background: #ffffff; padding: 2px; display: inline-block; }
  .qr-img { width: 68px; height: 68px; }
  .qr-caption { font-size: 7pt; color: #c9a84c; margin-top: 2px; }
  .gold-rule { height: 2px; background: #c9a84c; }
</style>
</head>
<body>
<div class="marfa-header">
  <div>
    <div class="brand-name">مرفأ <span class="domain">marfa.sa</span></div>
    <div class="slogan">${slogan}</div>
  </div>
  <div class="qr-block">
    <div class="qr-frame"><img src="data:image/png;base64,${QR_B64}" class="qr-img"></div>
    <div class="qr-caption">امسح للانضمام للجلسات</div>
  </div>
</div>
<div class="gold-rule"></div>
</body>
</html>`;
}

async function generateHeaderPdfs() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Arabic header
  console.log('Generating Arabic header PDF...');
  await page.setContent(headerHTML(true), { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.pdf({ path: HEADER_AR_PATH, format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 }, pageRanges: '1' });
  console.log(`  ✅ ${HEADER_AR_PATH}`);

  // English header
  console.log('Generating English header PDF...');
  await page.setContent(headerHTML(false), { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));
  await page.pdf({ path: HEADER_EN_PATH, format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 }, pageRanges: '1' });
  console.log(`  ✅ ${HEADER_EN_PATH}`);

  await browser.close();
}

function filename(topic, isArabic) {
  return topic + (isArabic ? '_Arabic_Case_Study.pdf' : '_Case_Study.pdf');
}

async function prependToAll() {
  console.log('\nLoading header PDFs...');
  const [headerAr, headerEn] = await Promise.all([
    PDFDocument.load(fs.readFileSync(HEADER_AR_PATH)),
    PDFDocument.load(fs.readFileSync(HEADER_EN_PATH)),
  ]);

  let ok = 0, skip = 0, fail = 0;

  for (const topic of TOPICS) {
    for (const isArabic of [true, false]) {
      const fname = filename(topic, isArabic);
      const fp = path.join(CASE_STUDIES_DIR, fname);

      if (!fs.existsSync(fp)) {
        console.log(`SKIP ${fname}`);
        skip++;
        continue;
      }

      try {
        const existing = await PDFDocument.load(fs.readFileSync(fp));
        const [hp] = await existing.copyPages(isArabic ? headerAr : headerEn, [0]);
        existing.insertPage(0, hp);
        fs.writeFileSync(fp, await existing.save());
        console.log(`OK   ${fname}`);
        ok++;
      } catch (e) {
        console.error(`FAIL ${fname}: ${e.message}`);
        fail++;
      }
    }
  }

  // Cleanup temp header PDFs
  try { fs.unlinkSync(HEADER_AR_PATH); } catch {}
  try { fs.unlinkSync(HEADER_EN_PATH); } catch {}

  console.log(`\nDone: ${ok} OK, ${skip} skipped, ${fail} failed`);
}

async function main() {
  await generateHeaderPdfs();
  await prependToAll();
}

main().catch(e => { console.error(e); process.exit(1); });
