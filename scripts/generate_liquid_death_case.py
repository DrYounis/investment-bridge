#!/usr/bin/env python3
"""
Generate a 2-page Harvard Business School-style case study PDF for Liquid Death.
Output: /Volumes/Samsung/investment-bridge/public/case-studies/Liquid_Death_Marketing_Case_Study.pdf

Requires: reportlab (pip install reportlab)
"""

import os
import io
import base64
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black, white, gray
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Image
)

# ---------------------------------------------------------------------------
# Output path — resolve relative to script location
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "public", "case-studies")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "Liquid_Death_Marketing_Case_Study.pdf")

# ---------------------------------------------------------------------------
# Marfa Branded Header (page 1 only)
# ---------------------------------------------------------------------------
MARFA_NAVY = HexColor("#0a0f1e")
MARFA_GOLD = HexColor("#c9a84c")
MARFA_CREAM = HexColor("#d8d5cc")

# QR code → https://www.marfa.sa/meetings
QR_BASE64 = ("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")

def on_first_page(canvas, doc):
    """Draws the marfa branded header on page 1."""
    canvas.saveState()
    page_w = letter[0]
    page_h = letter[1]

    # Navy header background
    canvas.setFillColor(MARFA_NAVY)
    canvas.rect(0, page_h - 52, page_w, 52, fill=1, stroke=0)

    # Brand name
    canvas.setFillColor(MARFA_GOLD)
    canvas.setFont("Helvetica-Bold", 18)
    canvas.drawString(22, page_h - 30, "مرفأ")

    # Domain
    canvas.setFillColor(white)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(62, page_h - 28, "marfa.sa")

    # Slogan
    canvas.setFillColor(MARFA_CREAM)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(22, page_h - 42, "حيث تَرسو الطموحات — MBA Case Study")

    # QR code (right side)
    qr_size = 68
    qr_x = page_w - 22 - qr_size
    qr_y = page_h - 52 + 2
    try:
        qr_data = base64.b64decode(QR_BASE64)
        qr_img = io.BytesIO(qr_data)
        canvas.drawImage(qr_img, qr_x + 2, qr_y + 2, qr_size - 4, qr_size - 4, mask='auto')
    except:
        pass

    # White QR frame
    canvas.setFillColor(white)
    canvas.setStrokeColor(white)
    canvas.setLineWidth(0.5)
    canvas.roundRect(qr_x, qr_y, qr_size, qr_size, 3, fill=0, stroke=1)

    # QR caption
    canvas.setFillColor(MARFA_GOLD)
    canvas.setFont("Helvetica", 6)
    canvas.drawCentredString(qr_x + qr_size / 2, qr_y - 10, "Scan to join sessions")

    # Gold rule
    canvas.setFillColor(MARFA_GOLD)
    canvas.setStrokeColor(MARFA_GOLD)
    canvas.setLineWidth(2)
    canvas.line(0, page_h - 54, page_w, page_h - 54)

    canvas.restoreState()

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
DARK_RED = HexColor("#8B0000")
DARK_BLUE = HexColor("#1F4788")
TABLE_GRAY = HexColor("#F5F5F5")
HIGHLIGHT_BG = HexColor("#FFF3CD")
BORDER_GRAY = HexColor("#CCCCCC")

MARGIN = 0.75 * inch

# ---------------------------------------------------------------------------
# Styles (tightened for 2-page fit)
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

body_style = ParagraphStyle(
    "Body85",
    parent=styles["Normal"],
    fontSize=8.5,
    leading=10.2,
    alignment=TA_JUSTIFY,
    spaceAfter=2,
    fontName="Helvetica",
)

body_bold = ParagraphStyle(
    "Body85Bold",
    parent=body_style,
    fontName="Helvetica-Bold",
)

heading_style = ParagraphStyle(
    "CaseHeading",
    parent=styles["Heading2"],
    fontSize=10,
    leading=12.5,
    textColor=DARK_BLUE,
    fontName="Helvetica-Bold",
    spaceBefore=5,
    spaceAfter=1,
)

subtitle_style = ParagraphStyle(
    "Subtitle",
    parent=body_style,
    fontSize=9.5,
    leading=12,
    alignment=TA_CENTER,
    textColor=HexColor("#333333"),
    fontName="Helvetica-Oblique",
    spaceAfter=4,
)

title_style = ParagraphStyle(
    "MBATitle",
    parent=styles["Title"],
    fontSize=16,
    leading=19,
    textColor=DARK_RED,
    fontName="Helvetica-Bold",
    alignment=TA_CENTER,
    spaceAfter=1,
)

table_cell = ParagraphStyle(
    "TableCell",
    parent=body_style,
    fontSize=7.5,
    leading=9.5,
    alignment=TA_LEFT,
)

table_cell_center = ParagraphStyle(
    "TableCellCenter",
    parent=table_cell,
    alignment=TA_CENTER,
)

table_header_style = ParagraphStyle(
    "TableHeader",
    parent=table_cell,
    fontName="Helvetica-Bold",
    textColor=white,
    fontSize=7.5,
    leading=10,
    alignment=TA_CENTER,
)

small_style = ParagraphStyle(
    "SmallText",
    parent=body_style,
    fontSize=7,
    leading=9,
    textColor=HexColor("#555555"),
)

box_text = ParagraphStyle(
    "BoxText",
    parent=body_style,
    fontSize=8.5,
    leading=11,
    fontName="Helvetica-Oblique",
    textColor=HexColor("#6B4C00"),
)

footer_style = ParagraphStyle(
    "Footer",
    parent=body_style,
    fontSize=6.5,
    leading=8.5,
    textColor=HexColor("#888888"),
    alignment=TA_LEFT,
)

page_header_style = ParagraphStyle(
    "PageHeader",
    parent=body_style,
    fontSize=7.5,
    textColor=HexColor("#666666"),
    alignment=TA_CENTER,
)

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def make_meta_table(rows):
    col_widths = [1.3 * inch, 5.2 * inch]
    data = []
    for label, value in rows:
        data.append([
            Paragraph(f"<b>{label}</b>", table_cell),
            Paragraph(value, table_cell),
        ])
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TABLE_GRAY),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("BACKGROUND", (0, 0), (0, -1), HexColor("#E8E8E8")),
    ]))
    return t


def make_data_table(headers, rows):
    avail = 6.5 * inch
    col_widths = [0.65*inch, 0.85*inch, 0.95*inch, 1.15*inch, 2.9*inch]
    data = [[Paragraph(h, table_header_style) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), table_cell_center) for c in row])
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), DARK_BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), TABLE_GRAY))
    t.setStyle(TableStyle(style_cmds))
    return t


def make_highlight_box(text):
    data = [[Paragraph(text, box_text)]]
    t = Table(data, colWidths=[6.5 * inch], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HIGHLIGHT_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("BOX", (0, 0), (-1, -1), 1.5, HexColor("#D4A017")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return t


def heading(text):
    return Paragraph(text, heading_style)


def body(text):
    return Paragraph(text, body_style)


def body_b(text):
    return Paragraph(text, body_bold)


def hr():
    return HRFlowable(width="100%", thickness=0.4, color=BORDER_GRAY, spaceBefore=2, spaceAfter=2)


# ---------------------------------------------------------------------------
# Page 1
# ---------------------------------------------------------------------------
def build_page1():
    story = []

    story.append(Paragraph("MBA CASE STUDY", title_style))
    story.append(Paragraph(
        "Liquid Death: Branding a Commodity — How to Sell Water Like It's a Rock Concert",
        subtitle_style,
    ))

    # Metadata table
    meta_rows = [
        ("Company:", "Liquid Death Mountain Water"),
        ("Industry:", "Beverage / Consumer Packaged Goods"),
        ("Founded / HQ:", "2018 — Los Angeles, California, USA"),
        (
            "Key Metrics:",
            "$130M+ revenue (2022)  |  $700M valuation (2023)  |  60,000+ retail locations<br/>"
            "5M+ TikTok followers  |  Whole Foods, Target, 7-Eleven, Amazon",
        ),
        ("Case Focus:", "Marketing &amp; Brand Differentiation"),
        (
            "Teaching Objective:",
            "Understand how radical branding transforms a commodity into a premium product, "
            "and extract lessons applicable to Hail local products (dates, honey, coffee, bakery) on Marfa.sa.",
        ),
    ]
    story.append(make_meta_table(meta_rows))
    story.append(Spacer(1, 6))

    # Synopsis
    story.append(heading("Synopsis"))
    story.append(body(
        "Water. It falls from the sky. It is free. The bottled-water market is dominated by Evian, Fiji, "
        "and Dasani — brands that sell \"purity,\" \"wellness,\" and mountain imagery. Then comes "
        "<b>Liquid Death</b>: water in a tallboy can with a skull logo, a punk-rock aesthetic, and the "
        "tagline <i>\"Murder Your Thirst.\"</i> Within five years: $130 million in revenue, a $700 million "
        "valuation, and distribution in over 60,000 retail locations. How did a literal commodity — municipal "
        "tap water in a can — become one of the most differentiated brands in the world? This case examines "
        "the branding strategy, viral marketing tactics, and cultural positioning that turned Liquid Death "
        "from a joke into a juggernaut."
    ))

    # Background
    story.append(heading("Background"))
    story.append(body(
        "Mike Cessario, a former creative director at Netflix, had a simple insight: <b>water marketing is "
        "boring.</b> Every major brand relied on the same visual language — pristine mountains, clear streams, "
        "abstract promises of purity. Cessario asked: <i>What if water was marketed like beer or energy drinks?</i> "
        "The answer was a tallboy can (the same format as Monster Energy), death-metal branding, and a name "
        "designed to make people do a double-take. Early viral stunts cemented the brand's irreverent identity — "
        "including a surfboard made of recycled aluminum cans, priced at $1,500, which sold out immediately. "
        "Liquid Death was not selling hydration; it was selling attitude, identity, and entertainment."
    ))

    # The Challenge
    story.append(heading("The Challenge"))
    story.append(body(
        "Cessario faced a daunting competitive landscape. The U.S. bottled-water market is controlled by "
        "<b>Coca-Cola</b> (Dasani, Smartwater), <b>PepsiCo</b> (Aquafina, LIFEWTR), and <b>Nestlé</b>. These "
        "incumbents command massive advertising budgets, decades-old distribution networks, and deep shelf-space "
        "relationships. Liquid Death launched with virtually no advertising budget. Its growth engine was pure viral "
        "marketing — social-media content that people shared because it was genuinely funny, shocking, or unlike "
        "anything they had seen from a water company. The central question: is Liquid Death a niche gimmick riding "
        "a wave of internet irony, or a <b>sustainable brand platform</b> built on authentic cultural insight?"
    ))
    story.append(Spacer(1, 4))

    # Key Data Table
    story.append(heading("Key Financial &amp; Growth Data"))
    data_headers = ["Year", "Revenue", "Valuation", "Retail Locations", "Key Campaign / Milestone"]
    data_rows = [
        ["2018", "—", "—", "—", "Brand launch; DTC e-commerce only"],
        ["2019", "~$3M", "—", "~500", "Whole Foods pilot; tallboy can goes viral on Instagram"],
        ["2020", "~$15M", "—", "~3,000", "\"Murder Your Thirst\" campaign; Amazon launch"],
        ["2021", "~$45M", "—", "~15,000", "7-Eleven, Target rollout; TikTok explodes (1M+ followers)"],
        ["2022", "$130M+", "$525M", "~40,000", "Series C ($70M); Super Bowl ad parody goes viral"],
        ["2023", "$195M+", "$700M", "60,000+", "Series D; iced tea line; 5M+ TikTok; international expansion"],
    ]
    story.append(make_data_table(data_headers, data_rows))
    story.append(Paragraph(
        "<i>Sources: Company filings, Crunchbase, Forbes, Bloomberg. Figures rounded. DTC = Direct-to-Consumer.</i>",
        small_style,
    ))

    return story


# ---------------------------------------------------------------------------
# Page 2
# ---------------------------------------------------------------------------
def build_page2():
    story = []

    story.append(Paragraph(
        "<b>Case Study: Liquid Death</b> &nbsp;|&nbsp; Marketing &amp; Brand Differentiation &nbsp;|&nbsp; Page 2 of 2",
        page_header_style,
    ))
    story.append(hr())

    # Discussion Questions
    story.append(heading("Discussion Questions"))

    story.append(body_b("1. Brand Differentiation Strategy"))
    story.append(body(
        "Liquid Death competes in a category where the core product is functionally identical across all "
        "competitors. How did the brand create a moat using identity and design rather than product features? "
        "What role did the tallboy can format play in signaling a different category membership — and how did "
        "this reframe consumer expectations about price, occasion, and taste?"
    ))

    story.append(body_b("2. Viral Marketing &amp; Social Media"))
    story.append(body(
        "With virtually no traditional advertising spend, Liquid Death relied on viral social-media content "
        "and user-generated sharing. Analyze the brand's TikTok and Instagram strategy: why did consumers "
        "voluntarily share Liquid Death content? What does the \"Tony Hawk's blood-infused skateboard deck\" "
        "stunt reveal about the relationship between shock value, authenticity, and earned media?"
    ))

    story.append(body_b("3. Commodity vs. Premium Positioning"))
    story.append(body(
        "Liquid Death sells essentially municipal tap water at ~$2.00 per 16.9 oz can — roughly the same "
        "price as premium imported water. How does the brand justify this premium? Is the value created by "
        "the aluminum can's sustainability story, the brand's entertainment value, or something else? Apply "
        "<b>Kapferer's Brand Identity Prism</b> to deconstruct the six facets of the Liquid Death brand."
    ))

    story.append(body_b("4. Scaling Without Losing Edge"))
    story.append(body(
        "As Liquid Death expands into iced teas, flavor variants, and international markets, it faces "
        "the classic challenger-brand dilemma: how do you grow without diluting the edgy, anti-establishment "
        "identity that made the brand successful? Compare with Red Bull, which managed to go mass-market "
        "while maintaining a countercultural aura."
    ))
    story.append(Spacer(1, 3))

    # Key Frameworks
    story.append(heading("Key Frameworks"))
    story.append(body(
        "<b>Kapferer's Brand Identity Prism:</b> Physique (tallboy can, skull logo), Personality (irreverent, "
        "punk), Culture (anti-corporate, pro-planet), Relationship (insider/outsider dynamic), Reflection "
        "(\"I don't take myself too seriously\"), Self-Image (\"I'm in on the joke\"). | "
        "<b>Porter's Differentiation:</b> Liquid Death does not compete on price or purity; it competes "
        "on a unique identity costly for incumbents to imitate. | "
        "<b>Jobs-to-be-Done:</b> Consumers do not \"hire\" Liquid Death to quench thirst — they hire it "
        "to signal identity and participate in internet culture. | "
        "<b>Cultural Branding (Holt):</b> The brand taps into Gen Z's distrust of traditional advertising, "
        "love of irony, and demand for brands that entertain rather than preach."
    ))

    # Teaching Objectives
    story.append(heading("Teaching Objectives"))
    story.append(body(
        "• Analyze how brand identity and visual design create differentiation in a commodity market.<br/>"
        "• Evaluate viral marketing and social media as substitutes for traditional advertising spend.<br/>"
        "• Apply Kapferer's Brand Identity Prism, Porter's differentiation, and Jobs-to-be-Done to a real brand.<br/>"
        "• Extract actionable branding lessons for local Saudi products (dates, honey, coffee, bakery) sold by "
        "Hail-based producers on the Marfa.sa platform."
    ))
    story.append(Spacer(1, 4))

    # Central Dilemma
    story.append(make_highlight_box(
        "<b>CENTRAL DILEMMA</b><br/><br/>"
        "Liquid Death sells tap water in a can for $2.00. Is this one of the most brilliant marketing plays "
        "in history — exposing the uncomfortable truth that <i>all</i> branding is manufactured meaning — or a "
        "cynical manipulation of Gen Z consumers who pay a premium for packaging over substance? Where do you "
        "draw the line between clever brand storytelling and deceptive marketing — and does the distinction "
        "even matter to the consumer?"
    ))
    story.append(Spacer(1, 6))

    # Saudi / Hail Application
    story.append(heading("Application: Branding Hail Local Products for the Saudi Market"))
    story.append(body(
        "The Liquid Death playbook offers a direct lens for repositioning <b>Hail-region products</b> on "
        "Marfa.sa from commodities into premium, story-driven brands:"
    ))
    story.append(body(
        "<b>Dates:</b> Saudi Arabia produces world-class dates (Sukkary, Ajwa, Medjool), yet they are "
        "overwhelmingly sold in bulk as an undifferentiated commodity. A Hail date brand could repackage "
        "dates in luxury gift boxes with bold, contemporary Saudi design — positioning them as a year-round "
        "lifestyle product and premium corporate gift. Brand story: <i>\"Grown in the heart of Hail, where "
        "2,000-year-old palms meet modern Saudi ambition.\"</i>"
    ))
    story.append(body(
        "<b>Honey:</b> Sidr and Talh honey from Hail's acacia groves have a compelling provenance story. "
        "Instead of a plain jar, imagine a branded wellness experience: minimalist packaging, QR-code "
        "traceability to the specific apiary and harvest date, and content showing the beekeeper's craft. "
        "The honey becomes a <i>story</i> about Hail's land, tradition, and purity — not just a condiment."
    ))
    story.append(body(
        "<b>Coffee:</b> Saudi coffee culture is undergoing a renaissance. Hail roasters can differentiate "
        "through visual identity: custom-illustrated bags depicting Hail landmarks (Qishlah Palace, Aarif "
        "Fort), origin stories about the roaster's family trade, and artist collaborations for limited-edition "
        "packaging — transforming a bag of beans into a cultural artifact."
    ))
    story.append(body(
        "<b>Cultural Considerations:</b> Can \"shock marketing\" work in Saudi Arabia? The death-metal "
        "aesthetic would not translate directly, but the <i>underlying principle</i> — that brands must be "
        "entertaining, culturally literate, and visually distinctive — is universal. Saudi Gen Z and "
        "Millennials are among the world's most digitally engaged populations; they respond to brands that "
        "respect their intelligence, reflect their identity, and contribute to the cultural conversation. "
        "The opportunity: build brands that are unmistakably Saudi, unapologetically premium, and shareable."
    ))
    story.append(Spacer(1, 4))

    # Pre-Class Assignment
    story.append(heading("Pre-Class Assignment"))
    story.append(body(
        "1. Watch Liquid Death brand film \"Murder Your Thirst\" (YouTube, 2 min).<br/>"
        "2. Browse liquiddeath.com for 10 minutes. Note every design choice unexpected for a water brand.<br/>"
        "3. Read the course-pack article: \"Liquid Death: How a Canned Water Brand Killed Boring Marketing.\"<br/>"
        "4. Prepare a 1-page memo: <i>Pick one Hail product (dates, honey, or coffee). Outline a brand "
        "identity concept inspired by Liquid Death, including name, visual direction, target audience, "
        "social-media strategy, and pricing rationale.</i>"
    ))
    story.append(Spacer(1, 6))

    # Footer / Sources
    story.append(hr())
    story.append(Paragraph(
        "<b>Sources:</b> Crunchbase, Forbes, Bloomberg, The Hustle, Liquid Death company filings, "
        "Kapferer (2012) <i>The New Strategic Brand Management</i>, Porter (1980) <i>Competitive Strategy</i>, "
        "Holt (2004) <i>How Brands Become Icons</i>, Christensen et al. (2016) <i>Competing Against Luck</i>.",
        footer_style,
    ))
    story.append(Paragraph(
        "Prepared for <b>Marfa.sa</b> — Meeting 4, July 16, 2026. HBS case-study format. "
        "All trademarks and copyrights belong to their respective owners. For educational use only.",
        footer_style,
    ))

    return story


# ---------------------------------------------------------------------------
# Page footer callback
# ---------------------------------------------------------------------------
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(BORDER_GRAY)
    canvas.setLineWidth(0.4)
    canvas.line(MARGIN, 0.5 * inch, letter[0] - MARGIN, 0.5 * inch)
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(HexColor("#999999"))
    canvas.drawString(MARGIN, 0.32 * inch, "CONFIDENTIAL — For Educational Use Only")
    canvas.drawRightString(letter[0] - MARGIN, 0.32 * inch, f"Page {canvas.getPageNumber()}")
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Build PDF
# ---------------------------------------------------------------------------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.55 * inch,
        bottomMargin=0.65 * inch,
    )

    story = []
    story.extend(build_page1())
    story.append(PageBreak())
    story.extend(build_page2())

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
