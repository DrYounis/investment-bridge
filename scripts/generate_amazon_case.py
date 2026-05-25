#!/usr/bin/env python3
"""
generate_amazon_case.py
Generates a 2-page Harvard Business School-style case study PDF
for Amazon Logistics using ReportLab.

Output: /Volumes/Samsung/investment-bridge/docs/case-studies/Amazon_Operations_Case_Study.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, PageBreak, NextPageTemplate
)
from reportlab.platypus.flowables import HRFlowable

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
OUTPUT_DIR = "/Volumes/Samsung/investment-bridge/docs/case-studies"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "Amazon_Operations_Case_Study.pdf")

PAGE_W, PAGE_H = letter  # 8.5 x 11 inches
MARGIN = 0.75 * inch
USABLE_W = PAGE_W - 2 * MARGIN
USABLE_H = PAGE_H - 2 * MARGIN

# Colours
DARK_RED = HexColor("#8B0000")
DARK_BLUE = HexColor("#1F4788")
LIGHT_GRAY = HexColor("#F5F5F5")
TABLE_GRAY = HexColor("#E8E8E8")
MEDIUM_GRAY = HexColor("#999999")
BOX_BG = HexColor("#FFF8F0")  # warm highlight for the dilemma box


# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
def build_styles():
    styles = {}

    styles["title"] = ParagraphStyle(
        "Title", fontSize=20, leading=24, textColor=DARK_RED,
        alignment=TA_CENTER, fontName="Helvetica-Bold", spaceAfter=4,
    )
    styles["subtitle"] = ParagraphStyle(
        "Subtitle", fontSize=11, leading=14, textColor=DARK_BLUE,
        alignment=TA_CENTER, fontName="Helvetica-Bold", spaceAfter=10,
    )
    styles["h1"] = ParagraphStyle(
        "H1", fontSize=11, leading=14, textColor=DARK_BLUE,
        fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=4,
    )
    styles["h2"] = ParagraphStyle(
        "H2", fontSize=10, leading=13, textColor=DARK_BLUE,
        fontName="Helvetica-Bold", spaceBefore=8, spaceAfter=3,
    )
    styles["body"] = ParagraphStyle(
        "Body", fontSize=9, leading=12, textColor=black,
        alignment=TA_JUSTIFY, fontName="Helvetica", spaceAfter=4,
    )
    styles["body_small"] = ParagraphStyle(
        "BodySmall", fontSize=8, leading=10.5, textColor=black,
        alignment=TA_JUSTIFY, fontName="Helvetica", spaceAfter=3,
    )
    styles["metadata_label"] = ParagraphStyle(
        "MetaLabel", fontSize=8, leading=10, textColor=HexColor("#555555"),
        fontName="Helvetica-Bold",
    )
    styles["metadata_value"] = ParagraphStyle(
        "MetaValue", fontSize=8, leading=10, textColor=black,
        fontName="Helvetica",
    )
    styles["table_header"] = ParagraphStyle(
        "TableHeader", fontSize=8, leading=10, textColor=white,
        fontName="Helvetica-Bold", alignment=TA_CENTER,
    )
    styles["table_cell"] = ParagraphStyle(
        "TableCell", fontSize=8, leading=10, textColor=black,
        fontName="Helvetica", alignment=TA_CENTER,
    )
    styles["table_cell_left"] = ParagraphStyle(
        "TableCellLeft", fontSize=8, leading=10, textColor=black,
        fontName="Helvetica", alignment=TA_LEFT,
    )
    styles["footer"] = ParagraphStyle(
        "Footer", fontSize=7, leading=9, textColor=MEDIUM_GRAY,
        fontName="Helvetica", alignment=TA_CENTER,
    )
    styles["page_header"] = ParagraphStyle(
        "PageHeader", fontSize=8, leading=10, textColor=MEDIUM_GRAY,
        fontName="Helvetica-Oblique", alignment=TA_LEFT,
    )
    styles["box_body"] = ParagraphStyle(
        "BoxBody", fontSize=9, leading=12, textColor=black,
        alignment=TA_JUSTIFY, fontName="Helvetica-Oblique", spaceAfter=0,
    )
    styles["box_label"] = ParagraphStyle(
        "BoxLabel", fontSize=9, leading=12, textColor=DARK_RED,
        fontName="Helvetica-Bold", spaceAfter=4,
    )

    return styles


# ---------------------------------------------------------------------------
# Helper builders
# ---------------------------------------------------------------------------
def p(text, style):
    """Shorthand for creating a Paragraph."""
    return Paragraph(text, style)


def hr():
    return HRFlowable(width="100%", thickness=0.5, color=MEDIUM_GRAY, spaceBefore=4, spaceAfter=4)


def bullet(text, style):
    """Create a bullet point paragraph."""
    return Paragraph(f"\u2022  {text}", style)


def spacer(height=6):
    return Spacer(1, height)


# ---------------------------------------------------------------------------
# Page 1 content builders
# ---------------------------------------------------------------------------
def build_metadata_table(S):
    """Build the 2-column metadata table at the top of page 1."""
    def row(label, value):
        return [p(f"<b>{label}</b>", S["metadata_label"]), p(value, S["metadata_value"])]

    data = [
        row("Company", "Amazon Logistics (Amazon.com, Inc.)"),
        row("Industry", "E-commerce / Supply Chain / Logistics / Technology"),
        row("Founded", "1994 by Jeff Bezos (logistics transformation began ~2005 with Amazon Prime)"),
        row("Headquarters", "Seattle, Washington, USA"),
        row("Key Metrics",
           "4,000+ delivery stations | 1M+ employees | 200M+ Prime members | "
           "1-day delivery standard | $60B+ annual shipping cost | 500,000+ Kiva robots"),
        row("Case Focus", "Operations &amp; Supply Chain Management"),
        row("Teaching Objective",
           "Analyze the operational trade-offs of Amazon's logistics model: speed vs. cost, "
           "automation vs. labour, efficiency vs. resilience, profit vs. sustainability."),
    ]

    t = Table(data, colWidths=[1.25 * inch, USABLE_W - 1.25 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#CCCCCC")),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, HexColor("#CCCCCC")),
    ]))
    return t


def build_key_data_table(S):
    """Build the Key Data table."""
    header = [
        p("Year", S["table_header"]),
        p("Delivery Stations", S["table_header"]),
        p("Prime Members (M)", S["table_header"]),
        p("Shipping Cost ($B)", S["table_header"]),
        p("Robots Deployed", S["table_header"]),
    ]
    rows = [
        [p("2015", S["table_cell"]), p("~200", S["table_cell"]), p("~50", S["table_cell"]),
         p("$11.5", S["table_cell"]), p("30,000", S["table_cell"])],
        [p("2018", S["table_cell"]), p("~500", S["table_cell"]), p("~100", S["table_cell"]),
         p("$27.7", S["table_cell"]), p("100,000", S["table_cell"])],
        [p("2020", S["table_cell"]), p("~1,500", S["table_cell"]), p("~150", S["table_cell"]),
         p("$61.1", S["table_cell"]), p("200,000", S["table_cell"])],
        [p("2022", S["table_cell"]), p("~2,500", S["table_cell"]), p("~200", S["table_cell"]),
         p("$83.5", S["table_cell"]), p("350,000", S["table_cell"])],
        [p("2025", S["table_cell"]), p("4,000+", S["table_cell"]), p("200+", S["table_cell"]),
         p("$60B+", S["table_cell"]), p("500,000+", S["table_cell"])],
    ]
    data = [header] + rows
    col_w = USABLE_W / 5.0
    t = Table(data, colWidths=[col_w] * 5)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), DARK_BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT_GRAY),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#CCCCCC")),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


# ---------------------------------------------------------------------------
# Page 2 content builders
# ---------------------------------------------------------------------------
def build_discussion_questions(S):
    """Build discussion questions by area."""
    areas = [
        ("Supply Chain Design &amp; Optimization",
         [
             "How did Amazon's decision to build AMZL (Amazon Logistics) rather than relying solely on "
             "UPS/FedEx change its cost structure and competitive position?",
             "What role does predictive analytics play in Amazon's inventory placement strategy? "
             "Evaluate the trade-offs between regional vs. national distribution networks.",
             "How does Amazon's \"hub-and-spoke\" model compare to traditional logistics networks? "
             "Identify one operational bottleneck and propose a solution.",
         ]),
        ("Automation vs. Human Labor",
         [
             "What tasks should Amazon automate next, and which tasks should remain human? "
             "Use a cost-benefit framework to justify your answer.",
             "How do Kiva robots change warehouse worker productivity — and injury rates? "
             "Research the safety record of automated vs. traditional fulfilment centres.",
             "If Amazon fully automates its sortation centres, what happens to the 1M+ "
             "workforce? Propose a retraining or transition plan.",
         ]),
        ("Last-Mile Delivery Economics",
         [
             "The last mile represents up to 53% of total shipping cost. Evaluate Amazon's "
             "Flex, DSP, and drone programmes as solutions. Which is most scalable?",
             "Compare the unit economics of same-day delivery vs. standard 2-day delivery. "
             "At what order density does same-day become profitable?",
             "How would a $2/package carbon surcharge affect the last-mile cost model?",
         ]),
        ("Sustainability &amp; Resilience",
         [
             "Amazon's \"Shipment Zero\" goal targets net-zero carbon by 2040. Is this "
             "realistic given growth projections? Critique the pledge using operational data.",
             "COVID-19 exposed single-source supply chain risks. How should Amazon rebalance "
             "\"Just-in-Time\" efficiency vs. \"Just-in-Case\" resilience?",
             "If you were required to cut shipping emissions by 30% in 3 years, what three "
             "operational changes would you make first?",
         ]),
    ]

    flowables = [p("Discussion Questions", S["h1"])]
    for area_title, questions in areas:
        flowables.append(p(area_title, S["h2"]))
        for q in questions:
            flowables.append(p(f"\u2022  <i>{q}</i>", S["body_small"]))
        flowables.append(spacer(2))
    return flowables


def build_frameworks_block(S):
    fw = [
        "\u2022  <b>Lean Operations:</b> Eliminate waste (muda) in picking, packing, and routing — "
        "Amazon's single-piece flow vs. batch processing.",
        "\u2022  <b>Six Sigma / DMAIC:</b> Reduce defect rate in order accuracy and delivery windows. "
        "Amazon's target: &lt;0.1% error rate.",
        "\u2022  <b>Just-in-Time (JIT) vs. Just-in-Case (JIC):</b> The tension between lean inventory "
        "and supply chain shocks. Amazon's hybrid approach post-COVID.",
        "\u2022  <b>Supply Chain Resilience Framework (Rice &amp; Caniato, 2003):</b> Redundancy, "
        "flexibility, and cultural change — mapping Amazon's network on these axes.",
        "\u2022  <b>Triple Bottom Line (Elkington, 1994):</b> People, Planet, Profit. Evaluating "
        "Amazon's logistics through the lens of social, environmental, and financial performance.",
    ]
    return [p(f, S["body_small"]) for f in fw]


def build_teaching_objectives(S):
    objs = [
        "Understand the operational design principles behind Amazon's fulfilment network.",
        "Analyse trade-offs between centralised vs. decentralised distribution models.",
        "Evaluate the ROI of automation investments (Kiva, drone, autonomous delivery).",
        "Assess the human and environmental costs of speed-optimised supply chains.",
        "Apply lean operations and Six Sigma frameworks to a real-world logistics case.",
        "Develop actionable recommendations for a company facing operational, ethical, and regulatory pressures.",
    ]
    return [bullet(o, S["body_small"]) for o in objs]


def build_dilemma_box(S):
    """Build the central dilemma as a highlighted box."""
    label_p = p("CENTRAL DILEMMA", S["box_label"])
    body_p = p(
        "Amazon achieves delivery speeds that delight consumers but faces allegations "
        "of worker exploitation, environmental damage, and monopoly power. If you were CEO, "
        "how would you balance operational efficiency with ethical responsibility \u2014 knowing "
        "that every concession to workers or the planet could raise prices and slow delivery "
        "for 200 million customers?",
        S["box_body"],
    )

    inner_data = [[label_p], [body_p]]
    inner_table = Table(inner_data, colWidths=[USABLE_W - 24])
    inner_table.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("BACKGROUND", (0, 0), (-1, -1), BOX_BG),
        ("BOX", (0, 0), (-1, -1), 1.5, DARK_RED, None, None),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))

    return inner_table


def build_hail_application(S):
    items = [
        "Food delivery logistics for 5-10 restaurant chains in Hail: route clustering, "
        "delivery-window optimisation, and driver allocation algorithms.",
        "Inventory management for bakeries and cafes: applying economic order quantity (EOQ), "
        "demand forecasting, and waste-reduction techniques inspired by Amazon's shelf-life modelling.",
        "Last-mile delivery in a small-city context: how Hail's lower density affects unit economics "
        "compared to Riyadh or Jeddah. Opportunity for shared-kitchen (\"cloud kitchen\") models.",
        "Waste reduction in food supply chains: cold-chain integrity, FIFO enforcement, and dynamic "
        "pricing of near-expiry items \u2014 lean principles scaled down for SMEs.",
        "Vision 2030 logistics hub ambitions: Hail's strategic location on the north-south corridor. "
        "Potential to become a regional distribution node for northern Saudi Arabia.",
    ]
    return [bullet(i, S["body_small"]) for i in items]


# ---------------------------------------------------------------------------
# Page templates
# ---------------------------------------------------------------------------
def page1_frame(canvas, doc):
    """Page 1 background: nothing extra."""
    canvas.saveState()
    canvas.restoreState()


def page2_frame(canvas, doc):
    """Page 2 background: page header line and footer line."""
    canvas.saveState()
    # header
    canvas.setFont("Helvetica-Oblique", 8)
    canvas.setFillColor(MEDIUM_GRAY)
    canvas.drawString(MARGIN, PAGE_H - MARGIN + 8,
                      "Case Study: Amazon Logistics (Page 2 of 2)")
    canvas.setStrokeColor(MEDIUM_GRAY)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, PAGE_H - MARGIN, PAGE_W - MARGIN, PAGE_H - MARGIN)

    # footer
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MEDIUM_GRAY)
    canvas.drawString(MARGIN, MARGIN - 14,
                      "Sources: Amazon Annual Reports (2015-2025), MWPVL International, Statista, "
                      "Bloomberg, SEC Filings.")
    canvas.drawRightString(PAGE_W - MARGIN, MARGIN - 14,
                           "Prepared for Marfa.sa \u2014 Meeting 5, July 30, 2026 \u2022 HBS Format")
    canvas.line(MARGIN, MARGIN - 4, PAGE_W - MARGIN, MARGIN - 4)
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Assemble document
# ---------------------------------------------------------------------------
def build_story(S):
    """Build the complete flowable story."""

    story = []

    # ===================== PAGE 1 =====================
    story.append(p("MBA CASE STUDY", S["title"]))
    story.append(p("Amazon Logistics: Operational Excellence at Unprecedented Scale", S["subtitle"]))
    story.append(hr())
    story.append(spacer(4))
    story.append(build_metadata_table(S))
    story.append(spacer(8))

    # Synopsis
    story.append(p("Synopsis", S["h1"]))
    story.append(p(
        "Amazon didn't just build an online bookstore \u2014 it built the most sophisticated "
        "logistics operation in human history. 500,000 Kiva robots glide through fulfilment "
        "centres the size of 28 football fields. 4,000 delivery stations blanket the globe. "
        "Predictive shipping algorithms dispatch items <i>before</i> you click \"buy.\" Same-day "
        "delivery now reaches 90+ metropolitan areas. The result: 200 million Prime members who "
        "expect anything, anywhere, within 48 hours. But this machine runs on relentless "
        "efficiency that critics call exploitative \u2014 150% warehouse injury rates above industry "
        "average, carbon emissions rivaling a mid-sized country, and competitive practices that "
        "regulators on three continents are investigating. This case examines the central "
        "trade-offs: speed versus humanity, efficiency versus resilience, profit versus planet.",
        S["body"],
    ))
    story.append(spacer(4))

    # Background
    story.append(p("Background", S["h1"]))
    story.append(p(
        "From a garage in Bellevue, Washington (1994), Jeff Bezos built Amazon into the "
        "world's largest online retailer. The logistics transformation began in earnest with "
        "the 2005 launch of Amazon Prime \u2014 a $79/year subscription for unlimited free 2-day "
        "shipping. Industry analysts called it financial suicide: shipping a $20 book for free, "
        "in two days, could not possibly turn a profit. Bezos bet that scale and loyalty would "
        "flip the equation, and for years the programme haemorrhaged money before reaching "
        "critical mass.",
        S["body"],
    ))
    story.append(p(
        "Amazon's warehouse network evolved in three phases. <b>Phase 1 (1997-2005):</b> Single "
        "national distribution centres \u2014 low complexity, slow delivery to distant regions. "
        "<b>Phase 2 (2005-2015):</b> Regional fulfilment centres optimised for inventory placement "
        "using predictive demand modelling. <b>Phase 3 (2015-present):</b> Hyper-local sortation "
        "centres, same-day facilities, and the launch of AMZL (Amazon Logistics) \u2014 a proprietary "
        "delivery network that reduced reliance on UPS and FedEx. In 2012 Amazon acquired Kiva "
        "Systems for $775M, rebranding it as Amazon Robotics, and today over 500,000 drive units "
        "move shelving pods to stationary pickers, cutting \"walk time\" by 60%.",
        S["body"],
    ))
    story.append(spacer(4))

    # The Challenge
    story.append(p("The Challenge", S["h1"]))
    story.append(p(
        "Amazon enters 2025+ facing a convergence of pressures. Labor unrest has intensified \u2014 "
        "the 2022 Staten Island unionisation vote (the first successful US warehouse union) and "
        "ongoing organising at facilities in Alabama, Germany, and the UK signal that the "
        "workforce is pushing back against 10-hour shifts, injury rates 80% above warehouse "
        "industry averages, and algorithmic performance management. Environmental scrutiny is "
        "sharpening: Amazon's 2023 carbon footprint exceeded 71 million metric tons, and the "
        "company's \"Shipment Zero\" pledge (net-zero by 2040) faces widespread scepticism given "
        "double-digit annual delivery-volume growth. Meanwhile, fuel costs remain volatile, "
        "regulators in the EU and US are pursuing antitrust actions, and well-funded competitors "
        "(Walmart, Shopify's fulfilment network, Shein/Temu's ultra-cheap air freight model) "
        "are eroding Amazon's delivery-speed advantage. Can Amazon sustain its operational "
        "dominance while reconciling these external pressures?",
        S["body"],
    ))
    story.append(spacer(6))

    # Key Data Table
    story.append(p("Key Data: Amazon Logistics at a Glance", S["h2"]))
    story.append(build_key_data_table(S))

    # Force page break
    story.append(NextPageTemplate("page2"))
    story.append(PageBreak())

    # ===================== PAGE 2 =====================
    # Discussion Questions
    story.extend(build_discussion_questions(S))
    story.append(spacer(4))

    # Key Frameworks
    story.append(p("Key Frameworks for Analysis", S["h1"]))
    story.extend(build_frameworks_block(S))
    story.append(spacer(4))

    # Teaching Objectives
    story.append(p("Teaching Objectives", S["h1"]))
    story.extend(build_teaching_objectives(S))
    story.append(spacer(6))

    # Central Dilemma
    story.append(build_dilemma_box(S))
    story.append(spacer(8))

    # Saudi / Hail Application
    story.append(p("Saudi Arabia / Hail Application", S["h1"]))
    story.extend(build_hail_application(S))
    story.append(spacer(6))

    # Pre-Class Assignment
    story.append(p("Pre-Class Assignment", S["h1"]))
    story.append(p(
        "1. Read the case carefully and summarise Amazon's logistics operating model in one paragraph.<br/>"
        "2. Choose <b>one</b> discussion-question area (Supply Chain Design, Automation, Last-Mile, "
        "or Sustainability) and prepare a 3-minute analysis with supporting data.<br/>"
        "3. Research a local Hail food business (restaurant, bakery, or grocer). Map its supply "
        "chain from supplier to customer, identify one operational bottleneck, and propose a "
        "lean-inspired improvement.<br/>"
        "4. Come prepared to debate the central dilemma: should Amazon prioritise speed or ethics? "
        "Be ready to defend either side.",
        S["body_small"],
    ))

    return story


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    S = build_styles()

    # Build the document with two page templates
    frame_page1 = Frame(MARGIN, MARGIN, USABLE_W, USABLE_H, id="frame1")
    frame_page2 = Frame(MARGIN, MARGIN + 18, USABLE_W, USABLE_H - 18, id="frame2")

    doc = BaseDocTemplate(
        OUTPUT_FILE,
        pagesize=letter,
        leftMargin=0,
        rightMargin=0,
        topMargin=0,
        bottomMargin=0,
        title="Amazon Logistics: Operational Excellence at Unprecedented Scale",
        author="Marfa.sa",
        subject="MBA Case Study - Operations",
    )

    doc.addPageTemplates([
        PageTemplate(id="page1", frames=[frame_page1], onPage=page1_frame),
        PageTemplate(id="page2", frames=[frame_page2], onPage=page2_frame),
    ])

    story = build_story(S)
    doc.build(story)

    print(f"PDF generated successfully: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
