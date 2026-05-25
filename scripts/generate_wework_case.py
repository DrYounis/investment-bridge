#!/usr/bin/env python3
"""Generate 2-page HBS-style case study: WeWork Finance. Marfa.sa Meeting #3 — July 2, 2026"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors

def create_case_study():
    pdf_path = "/Volumes/Samsung/investment-bridge/docs/case-studies/WeWork_Finance_Case_Study.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=0.75*inch, leftMargin=0.75*inch, topMargin=0.6*inch, bottomMargin=0.6*inch)
    story = []
    styles = getSampleStyleSheet()

    title_s = ParagraphStyle('Title', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=16, textColor=colors.HexColor('#8B0000'), alignment=TA_CENTER, spaceAfter=4)
    subtitle_s = ParagraphStyle('Sub', parent=styles['Normal'], fontName='Helvetica', fontSize=11, textColor=colors.HexColor('#1F4788'), alignment=TA_CENTER, spaceAfter=10)
    hdr_s = ParagraphStyle('Hdr', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, textColor=colors.HexColor('#1F4788'), spaceAfter=4, spaceBefore=8)
    body_s = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=colors.HexColor('#333333'), alignment=TA_JUSTIFY, spaceAfter=6)
    small_s = ParagraphStyle('Small', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor('#666666'), alignment=TA_RIGHT)
    box_s = ParagraphStyle('Box', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=9, leading=12, textColor=colors.HexColor('#333333'), alignment=TA_CENTER)
    bullet_s = ParagraphStyle('Bullet', parent=body_s, leftIndent=12, bulletIndent=0, spaceBefore=1, spaceAfter=1)
    footer_s = ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9, textColor=colors.HexColor('#888888'), alignment=TA_CENTER)

    dark_blue = colors.HexColor('#1F4788')
    gray_bg = colors.HexColor('#F5F5F5')
    dark_red = colors.HexColor('#8B0000')

    # ── PAGE 1 ──
    story.append(Paragraph("MBA CASE STUDY", title_s))
    story.append(Paragraph("WeWork: From $47 Billion to Bankruptcy — Growth vs. Profitability", subtitle_s))
    story.append(Spacer(1, 6))

    # Metadata table
    meta = [
        ["Company", "WeWork", "Industry", "Commercial Real Estate / Co-working"],
        ["Founded", "2010 (Adam Neumann, Miguel McKelvey)", "Headquarters", "New York, NY, USA"],
        ["Key Metrics", "Peak Valuation $47B (2019); IPO Failed; Bankrupt 2023; SoftBank invested $18.5B total; Revenue $3.4B (2022) with $2B net loss; 800+ locations",
         "Case Focus", "Finance — Growth vs. Profitability"],
        ["Teaching Objective", "Analyze the valuation disconnect between narrative-driven growth metrics and fundamental unit economics", "", ""]
    ]
    mt = Table(meta, colWidths=[1.2*inch, 2.6*inch, 1.2*inch, 2.6*inch])
    mt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), gray_bg),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'), ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (0,-1), 'RIGHT'), ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
    ]))
    story.append(mt)
    story.append(Spacer(1, 6))

    story.append(Paragraph("SYNOPSIS", hdr_s))
    story.append(Paragraph(
        "In 2019, WeWork filed for IPO at a $47 billion valuation. Within weeks, the filing unraveled under public scrutiny — "
        "revealing massive losses, creative accounting ('Community-Adjusted EBITDA'), self-dealing by founder-CEO Adam Neumann "
        "(who trademarked the word 'we' and sold it back to the company for $5.9 million), and a business model that leased "
        "long-term and rented short-term. The IPO collapsed. Neumann was ousted. Six months later, COVID-19 emptied offices "
        "worldwide. By 2023, WeWork filed for bankruptcy. This is the story of how 'growth at all costs' destroyed more "
        "investor value than almost any startup failure in history."
    , body_s))
    story.append(Paragraph(
        "At its core, WeWork was a real estate company priced like a technology company. The fundamental question this case "
        "explores: what is the difference between growth and a Ponzi scheme? When does narrative decouple from reality, and "
        "how can investors — and entrepreneurs — tell the difference before it is too late?"
    , body_s))

    story.append(Paragraph("BACKGROUND", hdr_s))
    story.append(Paragraph(
        "WeWork was founded in 2010 by Adam Neumann and Miguel McKelvey with a vision of 'elevating the world's consciousness.' "
        "The company leased office space long-term, renovated it with trendy design, and rented it short-term to freelancers, "
        "startups, and eventually large enterprises. The pitch: WeWork was not a real estate company — it was a community platform, "
        "a 'physical social network' where serendipitous interactions created value beyond square footage. This narrative resonated. "
        "SoftBank's Vision Fund, led by Masayoshi Son, invested $18.5 billion across multiple rounds, valuing the company at $47 "
        "billion at its peak — more than established office REITs with vastly larger portfolios."
    , body_s))
    story.append(Paragraph(
        "The S-1 IPO filing in August 2019 exposed the reality. Community-Adjusted EBITDA was a metric that excluded virtually "
        "every real cost — rent, interest, depreciation, stock compensation. Neumann had personally owned properties that he "
        "then leased back to WeWork. He had borrowed against his own shares. Family members held key executive roles. The IPO was "
        "withdrawn. Neumann was forced out with a $1.7 billion exit package. SoftBank took control, installed new management, and "
        "attempted a turnaround — but COVID-19 and the fundamental mismatch of long-term lease liabilities vs. short-term member "
        "commitments proved fatal. WeWork filed for Chapter 11 bankruptcy in November 2023."
    , body_s))

    story.append(Paragraph("THE CHALLENGE: DIAGNOSING THE FAILURE", hdr_s))
    story.append(Paragraph(
        "The WeWork collapse offers a masterclass in what separates genuine growth from unsustainable hype. The company's unit "
        "economics were fundamentally broken: long-term lease obligations totaled $47 billion, while member commitments averaged "
        "just 15 months. Each new location required massive upfront capital (build-out costs, furniture, technology) and took years "
        "to reach occupancy levels that might — might — generate positive cash flow. The company was perpetually dependent on new "
        "investment to cover losses from existing operations. This is the classic definition of a Ponzi dynamic: new investor money "
        "pays for old investors' promised returns. Yet SoftBank — one of the world's largest and most sophisticated investors — "
        "poured in $18.5 billion. What did they see that the public markets rejected?"
    , body_s))
    story.append(Paragraph(
        "The governance failures compound the financial ones. Neumann held Class B shares with 20 votes each, giving him majority "
        "control regardless of economic ownership. His wife, Rebekah, was involved in leadership decisions and was even named as "
        "one of three potential successor CEOs in the original S-1 — a governance red flag of the highest order. The company leased "
        "properties Neumann personally owned. When the IPO collapsed, Neumann walked away with $1.7 billion while employees lost "
        "jobs and investors lost billions."
    , body_s))

    # Key Data table
    story.append(Paragraph("KEY FINANCIAL DATA", hdr_s))
    kd = [
        ["Year", "Revenue ($B)", "Net Loss ($B)", "Valuation ($B)", "Locations"],
        ["2017", "$0.9B", "-$0.9B", "$20B", "170"],
        ["2018", "$1.8B", "-$1.9B", "$47B", "425"],
        ["2019", "$3.5B", "-$3.5B", "$47B (peak)\n$8B (bailout)", "739"],
        ["2020", "$3.2B", "-$3.8B", "$8B", "859"],
        ["2021", "$2.6B", "-$4.6B", "$9B (SPAC)", "756"],
        ["2022", "$3.4B", "-$2.0B", "Bankrupt 2023", "779"],
    ]
    kt = Table(kd, colWidths=[0.6*inch, 1.1*inch, 1.1*inch, 1.2*inch, 0.8*inch])
    kt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), dark_blue),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BACKGROUND', (0,1), (-1,-1), gray_bg),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(kt)

    # ── PAGE 2 ──
    story.append(PageBreak())
    story.append(Paragraph("Case Study: WeWork &nbsp;&nbsp; (Page 2 of 2)", small_s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("DISCUSSION QUESTIONS", hdr_s))
    sections = [
        ("1. Growth vs. Profitability", [
            "At what point does 'aggressive growth' cross the line into 'unsustainable Ponzi dynamics'? Define the boundary.",
            "SoftBank invested $18.5 billion. What due diligence failures allowed this? What metrics should have been red flags?",
            "How would you calculate WeWork's true unit economics? What should the P&L of a single WeWork location look like at breakeven?"
        ]),
        ("2. Valuation Methodologies", [
            "WeWork was valued at $47B. Comparable public REITs traded at 15-20x earnings while WeWork had NO earnings. How was this justified?",
            "What is the difference between valuing a technology company (SaaS multiples) and a real estate company (cap rates, NAV)?",
            "Could WeWork have been a viable company at a different valuation? At what price would you have invested?"
        ]),
        ("3. Corporate Governance & Founder Control", [
            "Neumann held 20:1 super-voting shares and personally owned properties leased back to WeWork. What governance mechanisms should have prevented this?",
            "His wife Rebekah was involved in succession planning. Is nepotism ever acceptable in a public company? Where is the line?",
            "Neumann exited with $1.7B while the company went bankrupt. Is this a market failure, a governance failure, or both?"
        ]),
        ("4. Investor Due Diligence", [
            "What specific red flags were visible in the S-1 that public markets caught but private investors (SoftBank) ignored?",
            "How should Saudi investors evaluate startup pitches to avoid WeWork-style disasters? What questions must they ask?",
            "If you were a Saudi family office offered a WeWork-like investment today, what due diligence would you require?"
        ]),
    ]
    for heading, questions in sections:
        story.append(Paragraph(heading, ParagraphStyle('qhead', parent=body_s, fontName='Helvetica-Bold', fontSize=9, textColor=dark_blue, spaceBefore=6, spaceAfter=2)))
        for q in questions:
            story.append(Paragraph(f"• {q}", bullet_s))

    story.append(Spacer(1, 4))
    story.append(Paragraph("KEY FRAMEWORKS", hdr_s))
    for f in ["Unit Economics & Contribution Margin Analysis", "DCF vs. Venture Capital Method", "Agency Theory (Principal-Agent Problem)", "Red Flags Framework (Feng-Shivdasani)", "Capital Structure & Lease Liability Analysis"]:
        story.append(Paragraph(f"• {f}", bullet_s))

    story.append(Paragraph("TEACHING OBJECTIVES", hdr_s))
    for o in [
        "Distinguish between revenue growth and sustainable profitability — and identify when growth masks fundamental unit economics problems.",
        "Evaluate multiple valuation methodologies and explain why a 'tech multiple' was inappropriate for a real estate business.",
        "Identify governance red flags (super-voting shares, related-party transactions, nepotism) and design preventive mechanisms.",
        "Develop a due diligence checklist for evaluating startup investments in the Saudi context.",
        "Understand how creative accounting metrics ('Community-Adjusted EBITDA') can mislead investors."
    ]:
        story.append(Paragraph(f"• {o}", bullet_s))

    story.append(Spacer(1, 6))
    # Central Dilemma
    dtable = Table([[Paragraph(
        "<b>THE CENTRAL DILEMMA</b><br/><br/>"
        "SoftBank invested $18.5 billion in WeWork believing it was a $47 billion technology company. "
        "At bankruptcy, equity value approached zero. Was this: (a) Fraud meriting criminal prosecution "
        "of the founder, (b) Legal but catastrophically poor investment judgment by SoftBank, or "
        "(c) A rational high-risk bet on transformation that simply failed? Defend your position with evidence.",
        box_s
    )]], colWidths=[6.5*inch])
    dtable.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF8F0')),
        ('BOX', (0,0), (-1,-1), 1.5, dark_red),
        ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 15), ('RIGHTPADDING', (0,0), (-1,-1), 15),
    ]))
    story.append(dtable)
    story.append(Spacer(1, 6))

    story.append(Paragraph("SAUDI ARABIA / HAIL LOCAL APPLICATION", hdr_s))
    for a in [
        "Startup Evaluation: How should Saudi angel investors and family offices evaluate startup pitches? What are the Saudi-specific red flags (e.g., inflated market size claims, unclear regulatory pathway, reliance on government contracts without signed agreements)?",
        "Unit Economics for Hail Entrepreneurs: A Hail bakery generating SAR 50K/month with 30% margins is fundamentally different from a startup 'projecting' SAR 5M revenue. How to teach this distinction?",
        "Growth vs. Profitability in Saudi Context: Many Saudi startups chase 'growth' to attract VC funding. When is this legitimate (e.g., Jahez, Nana) and when is it a WeWork-style mirage?",
        "Governance for Saudi Family Businesses: WeWork's governance failures (super-voting, related-party transactions) mirror challenges in Saudi family-controlled companies. What governance reforms should Saudi regulators mandate?",
        "Vision 2030: The Kingdom's SME and VC ecosystem is growing rapidly. How can Saudi Arabia build a funding environment that rewards genuine innovation while punishing WeWork-style hype?"
    ]:
        story.append(Paragraph(f"• {a}", bullet_s))

    story.append(Spacer(1, 4))
    story.append(Paragraph("PRE-CLASS ASSIGNMENT", hdr_s))
    for t in [
        "Read WeWork's S-1 filing (excerpts provided) and identify 5 specific red flags that should have concerned investors.",
        "Research one Saudi startup that raised significant funding. Analyze their unit economics based on publicly available information.",
        "Calculate: if you invested SAR 100K in a company losing SAR 20K/month, how long until it runs out of money? How does this change if revenue grows 10% monthly?",
        "Prepare your position on the Central Dilemma (a/b/c above). Be ready to defend with specific evidence from the case."
    ]:
        story.append(Paragraph(f"• {t}", bullet_s))

    # Footer
    story.append(Spacer(1, 10))
    ftable = Table([[Paragraph(
        "Sources: WeWork S-1 Filing (2019); SoftBank Group Annual Reports; Wall Street Journal; Financial Times. "
        "Prepared for Marfa.sa — Meeting 3, July 2, 2026. Format: Harvard Business School Case Method.",
        footer_s
    )]], colWidths=[6.5*inch])
    ftable.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), gray_bg), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6)]))
    story.append(ftable)

    doc.build(story)
    print(f"✅ Created: {pdf_path}")
    print("📄 2 pages, HBS format | 🎯 Meeting 3 — July 2, 2026 | 📚 Topic: Finance")

if __name__ == "__main__":
    create_case_study()
