#!/usr/bin/env python3
"""
Converts English case study PDFs to clean WeasyPrint versions with @page running header.
Rasterizes each page to image, wraps in HTML, applies marfa header in margin.
"""
import os, base64, sys
from pdf2image import convert_from_path
import weasyprint

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CASE_DIR = os.path.join(SCRIPT_DIR, "..", "public", "case-studies")
TMP_DIR = os.path.join(SCRIPT_DIR, "..", "public", "case-studies", ".tmp")
os.makedirs(TMP_DIR, exist_ok=True)

CSS = """
@page {
  size: A4;
  margin: 38mm 15mm 20mm 15mm;
  @top-left { content: element(pageHeader); }
  @bottom-center { content: counter(page); font-family: 'Cairo', sans-serif; font-size: 8pt; color: #666; }
}
#page-header {
  position: running(pageHeader);
  height: 22mm;
  box-sizing: border-box;
  background: #0a0f1e;
  border-bottom: 3px solid #c9a84c;
  padding: 4mm 6mm;
  font-family: 'Cairo', sans-serif;
}
#page-header .brand-name { font-size: 15pt; font-weight: 700; color: #c9a84c; }
#page-header .brand-domain { font-size: 9pt; color: #ffffff; font-weight: 400; }
#page-header .slogan { font-size: 8pt; color: #d8d5cc; margin-top: 2px; }
body { margin: 0; padding: 0; }
.page-img { width: 100%; display: block; margin: 0; padding: 0; }
"""

HEADER_HTML = """
<div id="page-header">
  <span class="brand-name">مرفأ</span>
  <span class="brand-domain">marfa.sa</span>
  <div class="slogan">حيث تَرسو الطموحات — MBA Case Study</div>
</div>
"""

def convert_pdf(pdf_path, out_path):
    """Convert one English PDF to WeasyPrint with header."""
    print(f"  Converting {os.path.basename(pdf_path)}...")
    
    # Rasterize pages at high DPI
    pages = convert_from_path(pdf_path, dpi=200, fmt='png')
    
    # Build HTML with images
    html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>{CSS}</style></head>
<body>
{HEADER_HTML}
"""
    for i, page in enumerate(pages):
        img_path = os.path.join(TMP_DIR, f'page_{i}.png')
        page.save(img_path, 'PNG')
        html += f'<img class="page-img" src="file://{img_path}" alt="Page {i+1}">\n'
    
    html += '</body>\n</html>'
    
    # Generate PDF with WeasyPrint
    doc = weasyprint.HTML(string=html)
    doc.write_pdf(out_path)
    print(f"    -> {os.path.basename(out_path)} ({len(pages)} pages)")

def main():
    from sys import argv
    
    if len(argv) > 1:
        # Single file mode
        pdf_path = argv[1]
        out_path = os.path.join(CASE_DIR, os.path.basename(pdf_path))
        convert_pdf(pdf_path, out_path)
    else:
        # All English PDFs
        for topic in ['Airbnb_Strategy','Amazon_Operations','Google_Aristotle_HR','IKEA_Expansion','JnJ_Crisis','Liquid_Death_Marketing','Netflix_Innovation','Patagonia_Sustainability','Quibi_Feasibility','Saudi_German_Health','SharkTank_Negotiation','Theranos_Risk','WeWork_Finance','Zappos_Leadership']:
            pdf_path = os.path.join(CASE_DIR, topic + '_Case_Study.pdf')
            out_path = os.path.join(CASE_DIR, topic + '_Case_Study.pdf')
            if os.path.exists(pdf_path):
                convert_pdf(pdf_path, out_path)
    
    # Clean up
    import shutil
    if os.path.exists(TMP_DIR):
        shutil.rmtree(TMP_DIR)

if __name__ == '__main__':
    main()
