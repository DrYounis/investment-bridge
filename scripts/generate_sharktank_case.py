#!/usr/bin/env python3
"""
generate_sharktank_case.py
Generates a 2-page Harvard Business School-style case study PDF about
Shark Tank negotiation dynamics, using ReportLab.

Output: public/case-studies/SharkTank_Negotiation_Case_Study.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, grey, lightgrey
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "docs", "case-studies")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "SharkTank_Negotiation_Case_Study.pdf")

DARK_RED = HexColor("#8B0000")
DARK_BLUE = HexColor("#1F4788")
TABLE_GRAY = HexColor("#F5F5F5")
BOX_BG = HexColor("#FFF8F0")
BOX_BORDER = HexColor("#CC6600")

MARGIN = 0.55 * inch
PAGE_W, PAGE_H = letter  # 612 x 792
USABLE_W = PAGE_W - 2 * MARGIN  # ~533 pt

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

body = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontSize=9,
    leading=10.5,
    alignment=TA_JUSTIFY,
    spaceAfter=0,
    fontName="Helvetica",
)

body_b = ParagraphStyle(
    "BodyBold", parent=body, fontName="Helvetica-Bold",
)

h = ParagraphStyle(
    "H",
    parent=styles["Heading3"],
    fontSize=11,
    leading=12,
    textColor=DARK_BLUE,
    fontName="Helvetica-Bold",
    spaceBefore=5,
    spaceAfter=0,
)

title_st = ParagraphStyle(
    "T",
    parent=styles["Title"],
    fontSize=15,
    leading=17,
    textColor=DARK_RED,
    fontName="Helvetica-Bold",
    alignment=TA_CENTER,
    spaceAfter=0,
)

sub_st = ParagraphStyle(
    "Sub",
    parent=body,
    fontSize=9.5,
    leading=11,
    alignment=TA_CENTER,
    fontName="Helvetica-Bold",
    spaceAfter=3,
)

tc = ParagraphStyle("TC", parent=body, fontSize=7, leading=9, spaceAfter=0, spaceBefore=0)
tcb = ParagraphStyle("TCB", parent=tc, fontName="Helvetica-Bold")

bul = ParagraphStyle(
    "Bul", parent=body, bulletIndent=10, leftIndent=22, spaceBefore=0, spaceAfter=0, leading=10,
)

box_st = ParagraphStyle(
    "Box", parent=body, fontSize=8.5, leading=11, fontName="Helvetica-Bold", textColor=HexColor("#8B4513"),
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def P(text, s=body):
    return Paragraph(text, s)


def H(text):
    return Paragraph(text, h)


def B(text):
    return Paragraph(text, body_b)


def bu(text):
    return Paragraph(f"\u2022  {text}", bul)


def T(data, col_widths=None, hr=1):
    if col_widths is None:
        col_widths = [USABLE_W / len(data[0])] * len(data[0])
    t = Table(data, colWidths=col_widths, repeatRows=hr)
    c = [
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, lightgrey),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(hr):
        c.append(("BACKGROUND", (0, i), (-1, i), TABLE_GRAY))
        c.append(("FONTNAME", (0, i), (-1, i), "Helvetica-Bold"))
        c.append(("FONTSIZE", (0, i), (-1, i), 7))
    for r in range(hr, len(data)):
        if r % 2 == 0:
            c.append(("BACKGROUND", (0, r), (-1, r), HexColor("#FAFAFA")))
    t.setStyle(TableStyle(c))
    return t


def S(pt=2):
    return Spacer(1, pt)


# ---------------------------------------------------------------------------
# Page callbacks
# ---------------------------------------------------------------------------
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 6.5)
    canvas.setFillColor(grey)
    canvas.drawCentredString(
        PAGE_W / 2, MARGIN - 15,
        "Sources: Shark Tank / ABC, Forbes, CNBC. "
        "Prepared for Marfa.sa \u2014 Meeting 6, August 13, 2026. HBS Format.",
    )
    canvas.restoreState()
    if doc.page == 2:
        canvas.saveState()
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(DARK_BLUE)
        canvas.drawString(MARGIN, PAGE_H - MARGIN + 13, "Case Study: Shark Tank (Page 2 of 2)")
        canvas.setStrokeColor(DARK_BLUE)
        canvas.setLineWidth(0.4)
        canvas.line(MARGIN, PAGE_H - MARGIN + 10, PAGE_W - MARGIN, PAGE_H - MARGIN + 10)
        canvas.restoreState()


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT_PATH, pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN + 14,
        title="MBA Case Study \u2014 Shark Tank Negotiation", author="Marfa.sa",
    )
    S_ = story = []

    # ---- PAGE 1 ----
    S_ += [P("MBA CASE STUDY", title_st)]
    S_ += [P("Shark Tank: The Art and Science of Negotiation \u2014 What Makes Investors Say Yes?", sub_st)]

    # Metadata
    S_ += [T([
        [P("<b>Show</b>", tcb), P("Shark Tank (U.S.), 2009\u2013Present (17 seasons)", tc)],
        [P("<b>Total Pitches / Invested</b>", tcb), P("1,500+ pitches / $200M+ invested", tc)],
        [P("<b>Case Focus</b>", tcb), P("Negotiation &amp; Deal Structuring", tc)],
        [P("<b>Teaching Objective</b>", tcb),
         P("Evaluate term sheets, negotiate valuation, understand investor psychology in early-stage fundraising", tc)],
    ], col_widths=[1.15 * inch, USABLE_W - 1.15 * inch])]
    S_ += [S(2)]

    # Synopsis
    S_ += [H("Synopsis")]
    S_ += [P(
        "Four Shark Tank deals reveal the dynamics that separate funded founders from those who walk away. "
        "<b>Scrub Daddy:</b> a smiling sponge, $200K \u2192 $300M empire. "
        "<b>Ring:</b> smart doorbell rejected by all Sharks \u2192 sold to Amazon for $1B (their biggest miss). "
        "<b>Bombas:</b> mission-driven socks, $200K \u2192 $1B+ revenue. "
        "<b>Coffee Meets Bagel:</b> founders reject $30M buyout (largest offer in show history) \u2192 later valued at $150M. "
        "This case examines why investors bet on sponges and socks but pass on world-changing technology \u2014 "
        "revealing the psychology, frameworks, and structural levers behind every deal."
    )]

    # Deal Analyses
    S_ += [H("Deal Analyses")]
    S_ += [P(
        "<b>Scrub Daddy (2012) \u2014 Why It Worked.</b> "
        "Aaron Krause\u2019s smiley-faced sponge changed texture with water temperature. "
        "Lori Greiner invested $200K for 20% ($1M pre-money). Simple product, highly demonstrable, "
        "~75% gross margins. Krause was humble, coachable, and manufacturing-ready. "
        "Result: $300M+ in retail sales \u2014 the most successful Shark Tank product ever."
    )]
    S_ += [P(
        "<b>Ring / DoorBot (2013) \u2014 Why It Failed.</b> "
        "Jamie Siminoff sought $700K for 10% ($7M valuation). Every Shark passed: "
        "the demo malfunctioned, Siminoff was defensive, zero shipped units, patent uncertainty. "
        "Amazon later acquired Ring for $1B. The Sharks\u2019 rejection was rational: "
        "a great idea without execution proof is a gamble, not an investment."
    )]
    S_ += [P(
        "<b>Bombas (2014) \u2014 Why It Worked.</b> "
        "David Heath and Randy Goldberg pitched athletic socks with a buy-one-give-one model. "
        "Daymond John invested $200K for 17.5%. Deep category expertise, ~70% margins, tested DTC playbook. "
        "Result: $1B+ lifetime revenue, 100M+ items donated."
    )]
    S_ += [P(
        "<b>Coffee Meets Bagel (2015) \u2014 The $30M Rejection.</b> "
        "The Kang sisters rejected Mark Cuban\u2019s $30M offer for 100% of their dating app. "
        "A later Series A valued the company at ~$150M, validating their conviction. "
        "Classic BATNA question: when does refusing a life-changing offer become hubris rather than vision?"
    )]

    # Key Data Table
    S_ += [S(2), H("Key Deal Summary")]
    dcol = [0.88 * inch, 0.78 * inch, 0.82 * inch, 0.92 * inch, 1.88 * inch]
    S_ += [T([
        [P("<b>Deal</b>", tcb), P("<b>Ask</b>", tcb), P("<b>Offer</b>", tcb), P("<b>Outcome</b>", tcb), P("<b>Lesson</b>", tcb)],
        [P("Scrub Daddy", tc), P("$100K/10%", tc), P("$200K/20%", tc), P("$300M+ sales", tc), P("Simple, great demo, likable founder", tc)],
        [P("Ring", tc), P("$700K/10%", tc), P("No offer", tc), P("$1B exit (Amazon)", tc), P("Poor demo, no traction \u2014 biggest miss", tc)],
        [P("Bombas", tc), P("$200K/5%", tc), P("$200K/17.5%", tc), P("$1B+ revenue", tc), P("Mission + margins = win", tc)],
        [P("Coffee Meets Bagel", tc), P("$500K/5%", tc), P("$30M/100%", tc), P("Rejected; $150M", tc), P("Know your BATNA first", tc)],
    ], col_widths=dcol)]

    # ---- PAGE 2 ----
    S_ += [PageBreak(), S(1)]

    # Discussion Questions
    S_ += [H("Discussion Questions")]
    S_ += [P(
        "<b>1. Valuation &amp; Terms.</b> How do Sharks value pre-revenue companies? "
        "Why did Scrub Daddy accept a lower per-share price while CMB walked from $30M? "
        "When should valuation outweigh partner quality?"
    )]
    S_ += [P(
        "<b>2. Investor Psychology.</b> Sharks favor simple consumer products over tech. "
        "Rational heuristic or cognitive bias? How does television distort decision-making? "
        "What role does founder likeability play vs. fundamentals?"
    )]
    S_ += [P(
        "<b>3. Founder Traits.</b> Compare Krause (humble, prepared) vs. Siminoff (defensive). "
        "How much does personality influence outcomes \u2014 and what can founders do about it?"
    )]
    S_ += [P(
        "<b>4. Deal Structure.</b> Equity (Scrub Daddy, Bombas) vs. acquisition (CMB). "
        "When do royalties, convertible notes, or advisory shares change the dynamic? "
        "Trade-offs of minority stake vs. full sale?"
    )]

    # Frameworks
    S_ += [S(2), H("Key Frameworks")]
    fcol = [0.9 * inch, 1.75 * inch, 2.65 * inch]
    S_ += [T([
        [P("<b>Framework</b>", tcb), P("<b>Definition</b>", tcb), P("<b>Shark Tank Example</b>", tcb)],
        [P("BATNA", tc), P("Best Alternative to a Negotiated Agreement", tc),
         P("CMB\u2019s organic-growth BATNA was strong enough to reject $30M", tc)],
        [P("Anchoring", tc), P("First number sets a psychological reference point", tc),
         P("Scrub Daddy: $100K/10% anchor; Lori countered $200K/20%", tc)],
        [P("ZOPA", tc), P("Zone of Possible Agreement \u2014 where both sides say yes", tc),
         P("Ring: ZOPA empty \u2014 $7M ask vs. zero valuation", tc)],
        [P("VC Method", tc), P("Valuation = Terminal Value / (1 + Target IRR)^Years", tc),
         P("Sharks target 5\u201310x in 3\u20135 yrs; drives every deal", tc)],
        [P("Due Diligence", tc), P("Verification: financials, IP, market, founder background", tc),
         P("Ring patents; Scrub Daddy manufacturing readiness", tc)],
    ], col_widths=fcol)]

    # Teaching Objectives
    S_ += [S(2), H("Teaching Objectives")]
    S_ += [bu("Analyze term sheets through BATNA, ZOPA, and anchoring.")]
    S_ += [bu("Distinguish price-based vs. value-based negotiation strategies.")]
    S_ += [bu("Evaluate founder traits that correlate with funding success.")]
    S_ += [bu("Apply the Venture Capital Method to early-stage valuation.")]
    S_ += [bu("Contextualize U.S. deal dynamics for the Saudi ecosystem.")]
    S_ += [S(2)]

    # Central Dilemma box
    dilemma = (
        "<b>CENTRAL DILEMMA</b><br/><br/>"
        "You are a Saudi entrepreneur pitching to a Riyadh family office. "
        "They offer <b>SAR 500,000 for 40% equity</b>. Your business generates "
        "<b>SAR 50,000 monthly profit</b>, growing <b>20% MoM</b>. The family office "
        "argues Saudi early-stage deals rarely exceed SAR 2M valuation and that "
        "their network and wasta are worth more than cash.<br/><br/>"
        "<b>Do you accept, counter, or walk away?</b> What is your BATNA \u2014 and "
        "theirs? How does the Saudi context change the calculus?"
    )
    box = Table([[Paragraph(dilemma, box_st)]], colWidths=[USABLE_W])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BOX_BG),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LINEABOVE", (0, 0), (-1, 0), 1.5, BOX_BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, BOX_BORDER),
        ("LINEBEFORE", (0, 0), (0, 0), 1.5, BOX_BORDER),
        ("LINEAFTER", (0, 0), (-1, 0), 1.5, BOX_BORDER),
    ]))
    S_ += [box, S(3)]

    # Saudi / Hail Application
    S_ += [H("Application: Pitching to Saudi Family Offices (Hail Focus)")]
    S_ += [P(
        "Saudi fundraising differs from Silicon Valley: <b>family offices dominate "
        "early-stage capital</b>, prioritizing trust, relationships, and strategic "
        "alignment over pure financial returns. Expect multiple relationship-building "
        "meetings before numbers are discussed."
    )]
    S_ += [P(
        "<b>Cultural Norms.</b> Negotiation is relationship-first. Direct confrontation "
        "or aggressive anchoring can backfire. Frame collaboratively. Silence is a "
        "negotiation tool. Hospitality (coffee, dates) precedes business. Many investors "
        "prefer Arabic for complex financial terms. Build rapport before you build a term sheet."
    )]
    S_ += [P(
        "<b>Common Mistakes.</b> (1) Silicon Valley valuations without SV exit markets. "
        "(2) Neglecting Sharia compliance (asset-backed revenue, no riba). "
        "(3) Excessive equity dilution without a clear use-of-funds plan. "
        "(4) Undervaluing wasta \u2014 the investor\u2019s network often exceeds their capital in value."
    )]
    S_ += [P(
        "<b>Hail-Specific Dynamics.</b> Hail family offices apply lower valuation multiples "
        "(2\u20134x revenue vs. 5\u201310x in Riyadh) due to perceived market size. However, "
        "Hail investors bring deeper operational support and government access. Emphasize "
        "regional expansion \u2014 Hail to Riyadh to GCC. Align with <b>Vision 2030</b>: "
        "tourism, entertainment, logistics, and digital transformation have government "
        "tailwinds that de-risk capital."
    )]
    S_ += [P(
        "<b>Deal Structuring.</b> Consider a <b>SAFE note</b> to defer valuation, or "
        "<b>Mudaraba</b> (profit-sharing) for Sharia compliance. For the SAR 500K/40% "
        "scenario: at SAR 50K/mo profit, 20% MoM growth, annualized run rate is SAR 600K. "
        "40% for SAR 500K = SAR 1.25M post-money = 2.1x revenue \u2014 below market even "
        "for Hail. Counter: SAR 500K for 15\u201320%, framing the family office\u2019s "
        "network and government access as the premium."
    )]

    # Pre-Class Assignment
    S_ += [S(2), H("Pre-Class Assignment")]
    S_ += [bu("Watch Scrub Daddy (S4E7) and Ring (S5E9) pitches on YouTube.")]
    S_ += [bu("Write down your venture\u2019s BATNA: best outcome without any investor.")]
    S_ += [bu("Research one Saudi family office: last 12 months of deals, portfolio focus.")]
    S_ += [bu("Prepare a one-page term sheet: valuation range, equity offer, non-negotiables.")]

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF written to {OUTPUT_PATH}")
    return OUTPUT_PATH


if __name__ == "__main__":
    build()
