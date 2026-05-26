#!/usr/bin/env python3
"""
generate_airbnb_case.py
Generate a 2-page Harvard Business School-style case study PDF for Airbnb.
Uses ReportLab platypus for layout.

Output: /Volumes/Samsung/investment-bridge/public/case-studies/Airbnb_Strategy_Case_Study.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Frame, PageTemplate, BaseDocTemplate
)

# ── Paths ────────────────────────────────────────────────────────────────────
OUTPUT_DIR = "/Volumes/Samsung/investment-bridge/public/case-studies"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "Airbnb_Strategy_Case_Study.pdf")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Colours ──────────────────────────────────────────────────────────────────
DARK_RED    = HexColor("#8B0000")
DARK_BLUE   = HexColor("#1F4788")
DARK_GRAY   = HexColor("#333333")
MID_GRAY    = HexColor("#666666")
LIGHT_GRAY  = HexColor("#F5F5F5")
TABLE_LINE  = HexColor("#CCCCCC")
HIGHLIGHT_BG = HexColor("#FFF8E1")

# ── Styles ───────────────────────────────────────────────────────────────────
base_styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    "CaseTitle", parent=base_styles["Title"],
    fontName="Helvetica-Bold", fontSize=20, leading=24,
    textColor=DARK_RED, alignment=TA_CENTER, spaceAfter=4,
)

style_subtitle = ParagraphStyle(
    "CaseSubtitle", parent=base_styles["Normal"],
    fontName="Helvetica", fontSize=13, leading=16,
    textColor=MID_GRAY, alignment=TA_CENTER, spaceAfter=14,
)

style_section = ParagraphStyle(
    "SectionHead", parent=base_styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=11, leading=14,
    textColor=DARK_BLUE, spaceBefore=12, spaceAfter=4,
)

style_body = ParagraphStyle(
    "CaseBody", parent=base_styles["Normal"],
    fontName="Helvetica", fontSize=9, leading=12.5,
    textColor=DARK_GRAY, alignment=TA_JUSTIFY, spaceAfter=6,
)

style_body_small = ParagraphStyle(
    "CaseBodySmall", parent=style_body,
    fontSize=8.5, leading=11.5,
)

style_table_cell = ParagraphStyle(
    "TableCell", parent=style_body,
    fontSize=8, leading=10, alignment=TA_LEFT,
)

style_table_header = ParagraphStyle(
    "TableHeader", parent=style_table_cell,
    fontName="Helvetica-Bold", textColor=black,
)

style_page_header = ParagraphStyle(
    "PageHeader", parent=base_styles["Normal"],
    fontName="Helvetica", fontSize=8, leading=10,
    textColor=MID_GRAY, alignment=TA_RIGHT,
)

style_footer = ParagraphStyle(
    "Footer", parent=base_styles["Normal"],
    fontName="Helvetica", fontSize=7.5, leading=10,
    textColor="#555555", alignment=TA_CENTER,
)

style_question = ParagraphStyle(
    "DiscussionQ", parent=style_body_small,
    fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=1,
)

style_question_body = ParagraphStyle(
    "DiscussionQBody", parent=style_body_small,
    leftIndent=10, spaceBefore=0, spaceAfter=2,
)

style_dilemma = ParagraphStyle(
    "Dilemma", parent=style_body,
    fontName="Helvetica-BoldOblique", fontSize=9.5, leading=13,
    textColor=DARK_RED, alignment=TA_CENTER,
)

style_bullet = ParagraphStyle(
    "Bullet", parent=style_body_small,
    leftIndent=18, bulletIndent=6, spaceBefore=1, spaceAfter=1,
)


# ── Helpers ──────────────────────────────────────────────────────────────────
def header_row(text):
    """Wrap text in a bold table-cell paragraph."""
    return Paragraph(text, style_table_header)


def cell(text):
    """Wrap text in a normal table-cell paragraph."""
    return Paragraph(text, style_table_cell)


def section(title):
    """Return a section heading paragraph."""
    return Paragraph(title, style_section)


def body(text):
    """Return a body paragraph."""
    return Paragraph(text, style_body)


def body_small(text):
    """Return a smaller body paragraph."""
    return Paragraph(text, style_body_small)


def bullet(text):
    """Return a bullet point."""
    return Paragraph(f"\u2022  {text}", style_bullet)


def question(q):
    """Return a bold discussion question."""
    return Paragraph(q, style_question)


def question_body(q):
    """Return an indented follow-up to a discussion question."""
    return Paragraph(q, style_question_body)


# ── Content ──────────────────────────────────────────────────────────────────

def build_story():
    story = []

    # ===================================================================
    # PAGE 1
    # ===================================================================

    # -- Title block --
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("MBA CASE STUDY", style_title))
    story.append(Paragraph(
        "Airbnb: Platform Strategy and Market Entry", style_subtitle))
    story.append(Spacer(1, 0.15 * inch))

    # -- Metadata table --
    meta_data = [
        [header_row("Company"),       cell("Airbnb, Inc.")],
        [header_row("Industry"),      cell("Hospitality / Platform Economy")],
        [header_row("Founded"),       cell("2008 by Brian Chesky, Joe Gebbia, Nathan Blecharczyk")],
        [header_row("Headquarters"),  cell("San Francisco, California, USA")],
        [header_row("Key Metrics"),   cell(
            "Revenue 2023: $9.9B &nbsp;|&nbsp; "
            "IPO Valuation: $100B+ &nbsp;|&nbsp; "
            "Listings: 7M+ &nbsp;|&nbsp; "
            "Countries: 220+")],
        [header_row("Case Focus"),    cell(
            "Platform strategy, trust mechanisms, regulatory navigation, "
            "and network effects in the sharing economy")],
        [header_row("Teaching<br/>Objective"), cell(
            "Evaluate how a two-sided platform can create and capture value "
            "in an industry dominated by asset-heavy incumbents")],
    ]

    meta_table = Table(meta_data, colWidths=[1.3 * inch, 5.0 * inch])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), LIGHT_GRAY),
        ("BACKGROUND", (1, 0), (1, -1), white),
        ("GRID",       (0, 0), (-1, -1), 0.5, TABLE_LINE),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING",   (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.1 * inch))

    # -- Synopsis --
    story.append(section("Synopsis"))
    story.append(body(
        "In 2008, two designers — Brian Chesky and Joe Gebbia — were struggling "
        "to pay rent on their San Francisco apartment. When a design conference "
        "filled every hotel in the city, they inflated three air mattresses, "
        "threw together a simple website called <i>AirBed &amp; Breakfast</i>, and "
        "charged $80 a night. Three guests showed up. The hospitality industry "
        "did not notice — and for good reason. The idea that strangers would "
        "pay to sleep in someone else's home (or on a living-room floor) seemed "
        "ludicrous. Hotels dominated the trillion-dollar travel sector with "
        "brands, loyalty programmes, and purpose-built real estate. Yet within "
        "fifteen years, Airbnb would list more rooms than the five largest "
        "hotel chains combined."
    ))
    story.append(body(
        "Early investors laughed — literally. Chesky and Gebbia, later joined by "
        "engineer Nathan Blecharczyk, pitched dozens of venture capitalists who "
        "dismissed home-sharing as a niche fantasy. One prominent VC emailed "
        "back: \"We're not interested — the market is too small.\" The founders "
        "resorted to selling collectible cereal boxes (\"Obama O's\" and "
        "\"Cap'n McCain's\") during the 2008 election, generating $30,000 that "
        "kept the company alive. Paul Graham at Y Combinator accepted them into "
        "the winter 2009 batch — not because he believed in the idea, but "
        "because he admired founders who would sell breakfast cereal to keep "
        "their startup alive."
    ))
    story.append(body(
        "This case study examines how a \"crazy idea\" — trusting strangers with "
        "your home, your couch, or a tent in your backyard — became a $100 "
        "billion platform. Students will analyse the role of network effects, "
        "trust infrastructure, regulatory strategy, and the platform business "
        "model in disrupting one of the world's oldest industries."
    ))

    # -- Background / History --
    story.append(section("Background and History"))
    story.append(body(
        "Airbnb's founding myth is now legendary in Silicon Valley. Brian Chesky "
        "and Joe Gebbia met at the Rhode Island School of Design and moved to "
        "San Francisco in 2007. Facing steep rent, they noticed that every hotel "
        "room in the city was booked for the Industrial Design Society of "
        "America's annual conference. They purchased three air mattresses, built "
        "a simple landing page, and hosted three guests — a 30-year-old Indian "
        "man, a 35-year-old woman from Boston, and a 45-year-old father of four "
        "from Utah. Chesky later described the experience as revealing a "
        "fundamental human insight: people are willing to trust strangers when "
        "the context is right, and hosts love the economic and social benefits "
        "of sharing their space."
    ))
    story.append(body(
        "The early days were brutal. After the conference ended, traffic "
        "disappeared. The founders iterated through multiple concepts — a "
        "roommate-matching service, a short-term sublet board — before returning "
        "to the conference-lodging insight. Nathan Blecharczyk, a Harvard "
        "computer-science graduate and former Microsoft engineer, joined as the "
        "third co-founder and built the platform's early infrastructure. The "
        "company applied to Y Combinator in late 2008 with almost no traction. "
        "During the interview, Paul Graham asked about the cereal boxes the "
        "founders had been selling to fund operations. Chesky handed him a box "
        "of \"Obama O's.\" Graham was impressed not by the business model, but "
        "by the founders' resourcefulness: \"If you can convince people to pay "
        "$40 for a $4 box of cereal, you can probably convince them to stay in "
        "a stranger's home.\" They were accepted."
    ))
    story.append(body(
        "After Y Combinator, Airbnb struggled to raise a Series A. Sequoia "
        "Capital passed. So did Benchmark, Greylock, and dozens of others. "
        "Fred Wilson at Union Square Ventures famously wrote a post explaining "
        "why he would not invest. Sequoia eventually reconsidered and led a "
        "$7.2 million Series A in 2010, after the founders showed them growth "
        "charts that Sequoia partner Greg McAdoo described as \"a hockey stick "
        "that had just started to bend.\" From that point, network effects "
        "kicked in: more listings attracted more guests, more guests attracted "
        "more hosts, and the platform's value grew exponentially. Airbnb "
        "expanded internationally, weathered regulatory battles in New York, "
        "Barcelona, Berlin, and Tokyo, and went public in December 2020 at a "
        "valuation exceeding $100 billion — the largest tech IPO of the year."
    ))
    story.append(body(
        "The COVID-19 pandemic nearly destroyed the company. Bookings collapsed "
        "80% in eight weeks. Airbnb laid off 25% of its workforce. Yet the "
        "crisis validated the platform's asset-light model: unlike hotel chains "
        "that were stuck with fixed costs on empty properties, Airbnb hosts "
        "could simply delist. When travel rebounded, Airbnb was the first to "
        "recover, as travellers sought private, standalone accommodations over "
        "crowded hotels. The pandemic pivot — refocusing on core hosting, "
        "cutting non-core projects, and redesigning for long-term stays — became "
        "a case study in crisis management."
    ))

    # -- Challenge / Decision Point --
    story.append(section("The Challenge: Convincing Investors and Users to Trust Strangers"))
    story.append(body(
        "The central challenge Airbnb faced was existential: how do you convince "
        "a homeowner to hand their keys to a stranger, and how do you convince a "
        "traveller to sleep in a stranger's home? Every investor who passed on "
        "Airbnb asked the same question: \"What about the axe murderer?\" The "
        "founders' answer was to build trust infrastructure — a system of "
        "verified IDs, two-way reviews, a $1 million host guarantee, host "
        "protection insurance, and 24/7 customer support. These mechanisms "
        "transformed trust from an abstract concern into a designed feature."
    ))
    story.append(body(
        "Regulatory battles compounded the challenge. New York City passed laws "
        "restricting short-term rentals. Barcelona fined Airbnb \u20ac600,000. "
        "Berlin banned short-term rentals of entire homes without a permit. "
        "Each regulatory fight threatened to undermine the platform's network "
        "effects in key markets. Airbnb's response evolved from confrontation "
        "to collaboration — striking tax-collection agreements with hundreds of "
        "cities and positioning itself as an economic lifeline for middle-class "
        "households. The question for students is whether this trust-and-"
        "regulation playbook is replicable and what trade-offs it entails."
    ))

    # -- Key Data Table --
    story.append(section("Key Milestones"))
    kd_header = [header_row("Year"), header_row("Listings"),
                 header_row("Revenue"), header_row("Milestone")]
    kd_rows = [
        kd_header,
        [cell("2008"), cell("3"),   cell("N/A"),       cell("AirBed &amp; Breakfast launched")],
        [cell("2009"), cell("2,500"), cell("N/A"),     cell("Y Combinator; name changed to Airbnb")],
        [cell("2011"), cell("50,000"), cell("N/A"),    cell("Series B; 1M nights booked")],
        [cell("2014"), cell("550,000"), cell("$436M"), cell("Rebrand; global expansion accelerates")],
        [cell("2017"), cell("4M"), cell("$2.6B"),      cell("Profitability milestone; Experiences launched")],
        [cell("2019"), cell("6M+"), cell("$4.8B"),     cell("Direct listing announced (later delayed)")],
        [cell("2020"), cell("5.6M"), cell("$3.4B"),    cell("COVID crash; IPO December at $100B+")],
        [cell("2023"), cell("7M+"), cell("$9.9B"),     cell("Record revenue; long-term stay growth")],
    ]

    kd_table = Table(kd_rows, colWidths=[0.65*inch, 0.85*inch, 0.9*inch, 3.9*inch])
    kd_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT_GRAY),
        ("GRID",       (0, 0), (-1, -1), 0.5, TABLE_LINE),
        ("VALIGN",     (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
    ]))
    story.append(kd_table)

    # ===================================================================
    # PAGE BREAK
    # ===================================================================
    story.append(PageBreak())

    # ===================================================================
    # PAGE 2
    # ===================================================================

    # -- Page header --
    story.append(Paragraph("Case Study: Airbnb &nbsp; (Page 2 of 2)", style_page_header))
    story.append(Spacer(1, 0.12 * inch))

    # -- Discussion Questions --
    story.append(section("Discussion Questions"))

    # Topic 1: Platform Strategy & Network Effects
    story.append(question("Topic 1: Platform Strategy &amp; Network Effects"))
    story.append(question_body(
        "1. How did Airbnb's two-sided marketplace create value for both hosts "
        "and guests in ways that traditional hotels could not replicate?"))
    story.append(question_body(
        "2. At what point did Airbnb's network effects become self-sustaining? "
        "Identify the inflection point using the case data."))
    story.append(question_body(
        "3. What are the key risks of a platform model in hospitality — "
        "specifically around quality control and supply consistency? How did "
        "Airbnb mitigate them?"))
    story.append(question_body(
        "4. Compare Airbnb's network effects with Uber's. Which platform has "
        "stronger defensibility, and why?"))

    # Topic 2: Trust & Safety
    story.append(question("Topic 2: Trust &amp; Safety Mechanisms"))
    story.append(question_body(
        "1. Airbnb's trust infrastructure — verified IDs, reviews, insurance, "
        "host guarantee — was foundational. Which of these is most critical to "
        "the platform's survival, and which is most replicable by competitors?"))
    story.append(question_body(
        "2. How does the two-way review system create incentives for good "
        "behaviour? What are its limitations?"))
    story.append(question_body(
        "3. Could Airbnb have achieved the same scale without the $1M host "
        "guarantee? Analyse the insurance mechanism as both a trust signal "
        "and a cost centre."))

    # Topic 3: Regulatory Strategy
    story.append(question("Topic 3: Regulatory Strategy"))
    story.append(question_body(
        "1. Airbnb's regulatory strategy evolved from \"ask forgiveness, not "
        "permission\" to proactive tax-collection agreements. What drove this "
        "shift, and was it successful?"))
    story.append(question_body(
        "2. Compare Airbnb's regulatory outcomes in New York, Barcelona, "
        "and Tokyo. What explains the variation?"))
    story.append(question_body(
        "3. Should platforms be responsible for enforcing local housing "
        "regulations, or is that the government's role? Construct arguments "
        "for both sides."))
    story.append(question_body(
        "4. How should Airbnb balance the interests of hosts, guests, cities, "
        "and hotel incumbents in its regulatory positioning?"))

    # Topic 4: Competitive Positioning
    story.append(question("Topic 4: Competitive Positioning"))
    story.append(question_body(
        "1. Who is Airbnb's biggest competitive threat today — Booking.com, "
        "Vrbo, Marriott's Homes &amp; Villas, or a new entrant? Justify your "
        "answer with strategic reasoning."))
    story.append(question_body(
        "2. How defensible is Airbnb's brand moat? Is \"Airbnb\" becoming a "
        "generic verb like \"Uber\" or \"Google,\" and does that help or "
        "hurt the company?"))
    story.append(question_body(
        "3. Airbnb has expanded into Experiences and long-term stays. Evaluate "
        "these moves through a diversification lens — are they strengthening "
        "or diluting the core platform?"))
    story.append(question_body(
        "4. How should Airbnb respond to the rise of \"professional hosts\" "
        "who manage dozens of properties — a trend that blurs the line between "
        "home-sharing and unlicensed hotels?"))

    # -- Key Frameworks --
    story.append(section("Key Strategic Frameworks"))
    story.append(bullet(
        "<b>Porter's Five Forces:</b> Analyse the hospitality industry's "
        "competitive intensity — threat of new entrants, bargaining power of "
        "buyers and suppliers, threat of substitutes, and industry rivalry — "
        "before and after Airbnb's entry."))
    story.append(bullet(
        "<b>Network Effects Theory:</b> Apply direct and indirect network "
        "effects to Airbnb's two-sided marketplace. Consider cross-side "
        "effects (more hosts attract more guests) and same-side effects "
        "(more guests may create congestion for other guests)."))
    story.append(bullet(
        "<b>Blue Ocean Strategy:</b> How did Airbnb create uncontested market "
        "space rather than competing head-to-head with hotels? Map the "
        "strategy canvas — which factors did Airbnb eliminate, reduce, raise, "
        "and create?"))
    story.append(bullet(
        "<b>Platform Business Model Canvas:</b> Map Airbnb's value creation, "
        "value delivery, and value capture using the platform canvas, paying "
        "special attention to the trust layer and the curation of supply."))

    # -- Teaching Objectives --
    story.append(section("Teaching Objectives"))
    story.append(bullet(
        "Understand how two-sided platforms create and capture value through "
        "network effects, trust infrastructure, and asset-light scalability."))
    story.append(bullet(
        "Analyse the strategic trade-offs between growth, trust, and regulatory "
        "compliance in platform businesses operating in regulated industries."))
    story.append(bullet(
        "Apply platform strategy frameworks to evaluate market-entry decisions "
        "in new geographies, including emerging tourism markets."))

    # -- Central Dilemma --
    story.append(Spacer(1, 0.12 * inch))
    dilemma_data = [[Paragraph(
        "<b>CENTRAL DILEMMA</b><br/><br/>"
        "You are an investor in 2008. Two designers pitch \"renting air "
        "mattresses in their living room to strangers.\" Hotels are a "
        "trillion-dollar industry. The founders have no hospitality "
        "experience. They funded their company by selling breakfast cereal. "
        "No major VC has invested. The addressable market appears — at "
        "best — unproven.<br/><br/>"
        "<b>Do you invest? Why or why not?</b>",
        style_dilemma)]]

    dilemma_table = Table(dilemma_data, colWidths=[6.3 * inch])
    dilemma_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HIGHLIGHT_BG),
        ("BOX", (0, 0), (-1, -1), 1, DARK_RED),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ]))
    story.append(dilemma_table)

    # -- Saudi / Hail Local Application --
    story.append(section("Local Application: Platform Strategy for Hail Tourism"))
    story.append(body_small(
        "The Hail region in north-central Saudi Arabia offers a compelling "
        "test case for applying Airbnb's platform model to an emerging "
        "tourism market. Under Saudi Vision 2030, the Kingdom aims to attract "
        "100 million annual visits by 2030, with Hail positioned as a "
        "gateway to some of the country's most distinctive natural and "
        "cultural assets."
    ))

    story.append(bullet(
        "<b>Aja Mountain Homestays (&#1580;&#1576;&#1604; &#1571;&#1580;&#1575;):</b> "
        "The granite peaks of the Aja Mountains offer dramatic landscapes and "
        "cooler temperatures. Local families could list rooms and traditional "
        "mountain homes, providing cultural immersion that hotels cannot match. "
        "A platform approach would aggregate this fragmented supply, create "
        "trust through reviews and verified listings, and market Aja homestays "
        "to domestic and international tourists."))

    story.append(bullet(
        "<b>Nafud Desert Tent Rentals (&#1589;&#1581;&#1585;&#1575;&#1569; &#1575;&#1604;&#1606;&#1601;&#1608;&#1583;):</b> "
        "The Nafud Desert, with its iconic red sand dunes, is prime territory "
        "for glamping and Bedouin-style tent experiences. A platform model "
        "could connect desert camp operators with adventure tourists, "
        "standardise quality, and build a branded category around Arabian "
        "desert hospitality. Trust mechanisms — photo verification, guide "
        "certification, guest reviews — would be critical in this "
        "low-infrastructure environment."))

    story.append(bullet(
        "<b>Winter Festival Lodging:</b> Hail's annual winter festival "
        "(typically December–January) draws large domestic crowds for camel "
        "races, cultural events, and desert activities. During the festival, "
        "hotel capacity is overwhelmed. A home-sharing platform could unlock "
        "local housing supply to absorb peak demand — exactly the original "
        "Airbnb use case (conference overflow) applied to a Saudi context."))

    story.append(bullet(
        "<b>Regulatory Partner — SCTH:</b> The Saudi Commission for Tourism "
        "and National Heritage (SCTH, &#1575;&#1604;&#1607;&#1610;&#1574;&#1577; "
        "&#1575;&#1604;&#1587;&#1593;&#1608;&#1583;&#1610;&#1577; "
        "&#1604;&#1604;&#1587;&#1610;&#1575;&#1581;&#1577; &#1608;&#1575;&#1604;&#1578;&#1585;&#1575;&#1579; "
        "&#1575;&#1604;&#1608;&#1591;&#1606;&#1610;) regulates tourism "
        "accommodation. A platform entering the Hail market would need to "
        "collaborate with SCTH on host licensing, quality standards, and tax "
        "collection — following Airbnb's evolved playbook of proactive "
        "regulatory engagement rather than confrontation."))

    story.append(bullet(
        "<b>Vision 2030 Alignment:</b> Home-sharing in Hail advances multiple "
        "Vision 2030 goals: boosting non-oil GDP through tourism, creating "
        "micro-entrepreneurship opportunities for Saudi households (especially "
        "women and rural families), distributing tourism spend beyond major "
        "cities, and showcasing Saudi cultural heritage to the world. The "
        "platform model's asset-light, distributed nature is inherently aligned "
        "with the goal of broad-based economic participation."))

    # -- Pre-Class Assignment --
    story.append(section("Pre-Class Assignment"))
    story.append(body_small(
        "Complete the following tasks before the case discussion:"))
    story.append(bullet(
        "<b>Task 1:</b> Read the Airbnb S-1 filing summary (3 pages). "
        "Identify the three most important strategic risks Airbnb disclosed "
        "to investors and rank them by severity. Come prepared to defend "
        "your ranking."))
    story.append(bullet(
        "<b>Task 2:</b> Using Porter's Five Forces, prepare a one-page "
        "strategic analysis of the hospitality industry in 2008 (pre-Airbnb) "
        "versus 2024. What changed, and which force shifted most dramatically?"))
    story.append(bullet(
        "<b>Task 3:</b> Write a half-page investment memo: would you have "
        "invested in Airbnb's 2009 seed round? Take a clear yes/no position "
        "and support it with specific evidence from the case."))

    # -- Footer --
    story.append(Spacer(1, 0.15 * inch))
    footer_data = [[Paragraph(
        "Sources: Airbnb S-1 Filing (2020), Y Combinator, Harvard Business Review, "
        "Sequoia Capital, TechCrunch. &nbsp;|&nbsp; "
        "Prepared for Marfa.sa &mdash; Meeting 1, June 4, 2026. &nbsp;|&nbsp; "
        "Format: Harvard Business School Case Method.",
        style_footer)]]

    footer_table = Table(footer_data, colWidths=[6.3 * inch])
    footer_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
        ("BOX", (0, 0), (-1, -1), 0.5, TABLE_LINE),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(footer_table)

    return story


# ── Page Template with margins ────────────────────────────────────────────────

def on_first_page(canvas, doc):
    """No header/footer on page 1 — margins only."""
    canvas.saveState()
    canvas.restoreState()


def on_later_pages(canvas, doc):
    """No additional decoration; page 2 header is built into the story."""
    canvas.saveState()
    canvas.restoreState()


# ── Build PDF ─────────────────────────────────────────────────────────────────

def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title="Airbnb: Platform Strategy and Market Entry — MBA Case Study",
        author="Marfa.sa",
        subject="MBA Strategy Case Study",
    )

    story = build_story()
    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)

    file_size_kb = os.path.getsize(OUTPUT_FILE) / 1024
    print(f"✅ PDF generated successfully!")
    print(f"   File: {OUTPUT_FILE}")
    print(f"   Pages: 2")
    print(f"   Size: {file_size_kb:.1f} KB")
    print(f"   Format: Harvard Business School Case Method")
    print(f"   Meeting: 1, Date: June 4, 2026")


if __name__ == "__main__":
    build_pdf()
