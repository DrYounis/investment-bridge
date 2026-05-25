#!/usr/bin/env python3
"""Generate 2-page HBS-style case study: Zappos Leadership. Marfa.sa Meeting #2 — June 18, 2026"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors

def create_case_study():
    pdf_path = "/Volumes/Samsung/investment-bridge/docs/case-studies/Zappos_Leadership_Case_Study.pdf"
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
    story.append(Paragraph("Zappos: Leadership Through Culture and Core Values", subtitle_s))
    story.append(Spacer(1, 6))

    # Metadata table
    meta = [
        ["Company", "Zappos", "Industry", "E-commerce / Customer Service"],
        ["Founded", "1999 (Nick Swinmurn); Tony Hsieh CEO 2000", "Headquarters", "Las Vegas, Nevada, USA"],
        ["Key Metrics", "Revenue $1.2B (at acquisition); Amazon acquired for $1.2B (2009); 1,500+ employees",
         "Case Focus", "Leadership & Organizational Culture"],
        ["Teaching Objective", "Analyze how transformational leadership and core values create sustainable competitive advantage through culture", "", ""]
    ]
    mt = Table(meta, colWidths=[1.2*inch, 2.6*inch, 1.2*inch, 2.6*inch])
    mt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), gray_bg),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (0,0), (0,-1), 'RIGHT'),
        ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
    ]))
    story.append(mt)
    story.append(Spacer(1, 6))

    story.append(Paragraph("SYNOPSIS", hdr_s))
    story.append(Paragraph(
        "Tony Hsieh sold LinkExchange to Microsoft for $265 million at age 24. Rather than retire, he invested in a struggling online shoe retailer called Zappos and became its CEO. His radical thesis: make customer service the ENTIRE brand — not a department, but THE brand identity. The result was legendary. Employees trained for four weeks on ten core values, then offered $2,000 to QUIT. Only 2–3% took the money. Customer service calls lasted up to 10 hours. Zappos became famous for surprise flower deliveries to customers, handwritten thank-you notes, and a culture that competitors could not replicate even after studying it obsessively. Amazon acquired the company for $1.2 billion in 2009 but allowed Zappos to maintain its unique culture."
    , body_s))
    story.append(Paragraph(
        "This case examines Hsieh's leadership philosophy: hire for culture first, skills second. Train relentlessly on values. Empower employees to make judgment calls without scripts. Pay people to leave if they do not fit. The central question: does this model scale beyond a single charismatic leader? What happens after acquisition?"
    , body_s))

    story.append(Paragraph("BACKGROUND", hdr_s))
    story.append(Paragraph(
        "Zappos began in 1999 when founder Nick Swinmurn could not find a specific pair of shoes at a mall. He pitched the idea of an online shoe retailer. Tony Hsieh, initially skeptical, joined as CEO in 2000 and transformed the company. By 2008, gross sales exceeded $1 billion. The company's legendary customer service — free shipping both ways, 365-day returns, surprise overnight upgrades — built a fiercely loyal customer base. Zappos published its 'Culture Book' annually, compiling employee testimonials about what the company's ten core values meant to them. These values included 'Deliver WOW Through Service,' 'Create Fun and a Little Weirdness,' and 'Be Humble.'"
    , body_s))
    story.append(Paragraph(
        "In 2009, Amazon acquired Zappos for $1.2 billion in stock. Unlike most acquisitions, Amazon allowed Zappos to operate independently, preserving its culture. In 2013, Hsieh introduced Holacracy — a self-management system with no job titles or managers — which proved controversial and eventually faded. Hsieh also launched the Downtown Project, investing $350 million of his own money to revitalize downtown Las Vegas. He died tragically in 2020, leaving behind a leadership legacy studied at business schools worldwide."
    , body_s))

    story.append(Paragraph("THE CHALLENGE: THE $2,000 OFFER", hdr_s))
    story.append(Paragraph(
        "Every new Zappos hire undergoes four weeks of intensive training on the company's ten core values and customer service philosophy. At the end of training, every employee is offered $2,000 in cash to quit — no questions asked. The logic: anyone who would take $2,000 to leave was never truly committed to the culture. Only 2–3% accept. This practice became Zappos' most famous cultural mechanism, filtering for genuine alignment with company values. Critics question whether the offer truly selects for cultural fit or merely for financially constrained workers who cannot afford to walk away."
    , body_s))
    story.append(Paragraph(
        "The post-acquisition challenge compounds this question. Amazon's data-driven efficiency culture could not be more different from Zappos' relationship-first philosophy. Can a culture built around one charismatic founder survive without him? Does Holacracy represent the evolution or the dissolution of the Zappos model? And most fundamentally — does culture actually drive business results, or is it a luxury that only works when the economics are favorable?"
    , body_s))

    # Key Data table
    story.append(Paragraph("KEY DATA", hdr_s))
    kd = [
        ["Year", "Revenue ($M)", "Employees", "Notable Event"],
        ["2000", "$1.6M", "~10", "Tony Hsieh joins as CEO"],
        ["2005", "$370M", "~400", "Publishes first Culture Book"],
        ["2008", "$1,014M", "~1,200", "Gross sales exceed $1B"],
        ["2009", "$1,200M", "~1,500", "Amazon acquires for $1.2B"],
        ["2013", "$1,600M", "~1,500", "Holacracy implementation begins"],
    ]
    kt = Table(kd, colWidths=[0.7*inch, 1.15*inch, 0.95*inch, 4.2*inch])
    kt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), dark_blue),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BACKGROUND', (0,1), (-1,-1), gray_bg),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('ALIGN', (1,0), (2,-1), 'CENTER'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CCCCCC')),
        ('TOPPADDING', (0,0), (-1,-1), 3), ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(kt)

    # ── PAGE 2 ──
    story.append(PageBreak())
    story.append(Paragraph("Case Study: Zappos &nbsp;&nbsp; (Page 2 of 2)", small_s))
    story.append(Spacer(1, 6))

    story.append(Paragraph("DISCUSSION QUESTIONS", hdr_s))

    sections = [
        ("1. Organizational Culture & Values", [
            "What are the ten core values, and how do they translate into daily employee behavior?",
            "How does Zappos measure cultural success beyond financial metrics?",
            "Can a strong culture become a liability — creating groupthink or excluding diverse perspectives?"
        ]),
        ("2. Employee Empowerment & Motivation", [
            "Does the $2,000 Offer genuinely filter for cultural fit, or select for financially constrained workers?",
            "How does Zappos justify the cost of 10-hour customer service calls? What is the ROI?",
            "Could the Zappos model work in industries with lower margins or higher employee turnover?"
        ]),
        ("3. Leadership Philosophy", [
            "Was Tony Hsieh a transformational leader or an eccentric who got lucky with one good idea?",
            "What is the difference between 'management' and 'leadership' in the Zappos context?",
            "How does Holacracy challenge traditional leadership hierarchies, and why did it struggle at Zappos?"
        ]),
        ("4. Culture After Acquisition", [
            "How did Amazon preserve Zappos' culture after acquisition, and what trade-offs were made?",
            "Can Zappos' culture survive without Tony Hsieh? What mechanisms sustain it?",
            "If you were Zappos' CEO today, what ONE change would you make to evolve the culture?"
        ]),
    ]
    for heading, questions in sections:
        story.append(Paragraph(heading, ParagraphStyle('qhead', parent=body_s, fontName='Helvetica-Bold', fontSize=9, textColor=dark_blue, spaceBefore=6, spaceAfter=2)))
        for q in questions:
            story.append(Paragraph(f"• {q}", bullet_s))

    story.append(Spacer(1, 4))
    story.append(Paragraph("KEY FRAMEWORKS", hdr_s))
    for f in ["Servant Leadership (Greenleaf)", "Schein Organizational Culture Model", "Herzberg Two-Factor Theory", "Culture-as-Strategy (Barney)", "Holacracy & Self-Management"]:
        story.append(Paragraph(f"• {f}", bullet_s))

    story.append(Paragraph("TEACHING OBJECTIVES", hdr_s))
    for o in [
        "Distinguish between leadership that builds culture vs. leadership that manages operations.",
        "Evaluate the $2,000 Offer as a human capital screening mechanism — costs, benefits, and ethical implications.",
        "Analyze whether strong organizational culture can serve as a sustainable competitive advantage.",
        "Apply Zappos' lessons to the Saudi service sector, particularly Hail's emerging hospitality and retail businesses."
    ]:
        story.append(Paragraph(f"• {o}", bullet_s))

    story.append(Spacer(1, 6))
    # Central Dilemma
    dtable = Table([[Paragraph(
        "<b>THE CENTRAL DILEMMA</b><br/><br/>"
        "Tony Hsieh pays new employees $2,000 to quit. Is this genius leadership that filters for genuine cultural fit — "
        "or wasteful signaling that selects for financially constrained workers who cannot afford to leave? "
        "Are the employees who stay truly committed to the culture, or simply unable to take the financial risk of quitting?",
        box_s
    )]], colWidths=[6.5*inch])
    dtable.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FFF8F0')),
        ('BOX', (0,0), (-1,-1), 1.5, dark_red),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 15),
        ('RIGHTPADDING', (0,0), (-1,-1), 15),
    ]))
    story.append(dtable)
    story.append(Spacer(1, 6))

    story.append(Paragraph("SAUDI ARABIA / HAIL LOCAL APPLICATION", hdr_s))
    for a in [
        "Service Culture in Saudi: How can Hail coffee shops, restaurants, and retail businesses build a 'WOW' service culture in a market where hospitality is culturally valued but inconsistent as a business practice?",
        "Employee Empowerment: In a hierarchical business culture, can Saudi managers empower front-line employees to make judgment calls without scripts — and what changes would this require in management mindset?",
        "Core Values: What core values would resonate in a Saudi business context? How do Islamic principles of service (khidma) and excellence (ihsan) align with Zappos' values?",
        "Vision 2030: The Kingdom's tourism and hospitality goals require world-class service standards. How can Saudi businesses build differentiated cultures that attract both local and international customers?",
        "Hail-Specific: With Hail's growing tourism sector (Aja Mountain, Nafud Desert, winter festivals), hospitality businesses have an opportunity to differentiate through service culture. What would a 'Zappos-level' hospitality experience look like in Hail?"
    ]:
        story.append(Paragraph(f"• {a}", bullet_s))

    story.append(Spacer(1, 4))
    story.append(Paragraph("PRE-CLASS ASSIGNMENT", hdr_s))
    for t in [
        "Read the Zappos Culture Book (excerpts provided) and identify which of the ten core values you would implement in your own business.",
        "Interview one Hail business owner about their customer service philosophy. How do they train employees? What standards do they set?",
        "Prepare your position: would you take the $2,000 offer? Write one paragraph explaining your reasoning."
    ]:
        story.append(Paragraph(f"• {t}", bullet_s))

    # Footer
    story.append(Spacer(1, 10))
    ftable = Table([[Paragraph(
        "Sources: Zappos Culture Book; Hsieh, T. (2010) <i>Delivering Happiness</i>; Harvard Business Review; Amazon Annual Reports. "
        "Prepared for Marfa.sa — Meeting 2, June 18, 2026. Format: Harvard Business School Case Method.",
        footer_s
    )]], colWidths=[6.5*inch])
    ftable.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), gray_bg), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6)]))
    story.append(ftable)

    doc.build(story)
    print(f"✅ Created: {pdf_path}")
    print("📄 2 pages, HBS format | 🎯 Meeting 2 — June 18, 2026 | 📚 Topic: Leadership")

if __name__ == "__main__":
    create_case_study()
