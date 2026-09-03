#!/usr/bin/env python3
"""
generate_english_case_studies_18_27.py
Generate the English case study PDFs for meetings 18–27 (the August 2026 cases:
5 Saudi success stories + 5 global ones) with WeasyPrint.

Mirrors scripts/generate_english_case_studies.py (English/LTR, marfa running header).
Output: public/case-studies/<name>_Case_Study.pdf
"""

import os
import weasyprint

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "public", "case-studies")
FONT_PATH = os.path.join(SCRIPT_DIR, "..", "fonts", "Cairo.ttf")

CSS = """
@font-face {
  font-family: 'Cairo';
  src: url('file://__FONT_PATH__');
}

@page {
  size: A4;
  margin: 38mm 15mm 20mm 15mm;
  @top-left { content: element(pageHeader); }
  @bottom-center {
    content: counter(page);
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 8pt;
    color: #666;
  }
}

#page-header {
  position: running(pageHeader);
  height: 22mm;
  box-sizing: border-box;
  overflow: hidden;
  background: #0a0f1e;
  border-bottom: 3px solid #c9a84c;
  padding: 4mm 6mm;
  font-family: 'Cairo', 'Helvetica', 'Arial', sans-serif;
}
#page-header .brand-name { font-size: 15pt; font-weight: 700; color: #c9a84c; }
#page-header .brand-domain { font-size: 9pt; color: #ffffff; font-weight: 400; }
#page-header .slogan { font-size: 8pt; color: #d8d5cc; margin-top: 2px; }

body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: #1a1a1a;
  direction: ltr;
  font-size: 10pt;
  line-height: 1.55;
}

h1 { font-size: 16pt; color: #0a0f1e; break-after: avoid; margin: 8mm 0 4mm 0; text-align: center; }
h2 { font-size: 13pt; color: #0a0f1e; break-after: avoid; margin: 6mm 0 3mm 0;
     border-bottom: 2pt solid #c9a84c; padding-bottom: 2mm; }
h3 { font-size: 12pt; color: #0a0f1e; break-after: avoid; margin: 6mm 0 3mm 0;
     border-bottom: 2pt solid #c9a84c; padding-bottom: 2mm; }
h4 { font-size: 11pt; color: #0a0f1e; break-after: avoid; margin: 4mm 0 2mm 0; }

p { orphans: 3; widows: 3; margin: 0 0 3mm 0; text-align: justify; }
ul, ol { orphans: 3; widows: 3; margin: 2mm 0 4mm 0; padding-left: 6mm; }
li { margin-bottom: 2mm; }

table { border-collapse: collapse; width: 100%; margin: 4mm 0 6mm 0; break-inside: avoid; }
.meta { break-inside: avoid; }
.meta td { padding: 3mm 4mm; border: 0.5pt solid #c9a84c; font-size: 10pt; }
.meta .label { background: #faf8f2; font-weight: 700; color: #0a0f1e; width: 25%; }
.data { break-inside: avoid; }
.data th { background: #0a0f1e; color: #c9a84c; padding: 2mm 3mm; font-size: 10pt; text-align: left; }
.data td { padding: 2mm 3mm; border-bottom: 0.5pt solid #c9a84c20; font-size: 10pt; text-align: left; }
"""

HEADER_HTML = """
<div id="page-header">
  <span class="brand-name">مرفأ</span>
  <span class="brand-domain">marfa.sa</span>
  <div class="slogan">حيث تَرسو الطموحات — MBA Case Study</div>
</div>
"""

CASE_STUDIES = [
    {
        "filename": "Jahez_Profitability_Case_Study.pdf",
        "title": "Jahez: Profitability in the Food-Delivery Model — How a Saudi Player Wins Where Giants Burn Billions",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Jahez International Company (جاهز)</td></tr>
  <tr><td class="label">Industry</td><td>Food Delivery / Logistics Marketplace</td></tr>
  <tr><td class="label">Founded</td><td>2016 — Riyadh, Saudi Arabia</td></tr>
  <tr><td class="label">Listing</td><td>Tadawul (ticker 9526) — IPO December 2021</td></tr>
  <tr><td class="label">Key Figures</td><td>Market leader in Saudi food delivery; profitable while global rivals Uber Eats, DoorDash and Delivery Hero continue to burn billions annually</td></tr>
  <tr><td class="label">Case Focus</td><td>Unit economics and density — how a delivery platform turns a structurally thin-margin business into a profitable one</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Understand why food delivery is a "density game," not a "growth-at-all-costs" game, and how geographic focus creates defensible profitability</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Food delivery is one of the most brutally competitive industries of the past decade. Uber Eats, DoorDash, Deliveroo and Delivery Hero have collectively burned tens of billions of dollars subsidizing customers and riders in pursuit of scale. The dominant global playbook is simple: acquire customers at any cost, dominate the city, then hope the unit economics eventually turn positive. For most, that "eventually" has never arrived.</p>
<p>Jahez — a Saudi company founded in 2016 — took the opposite path. Instead of racing to dozens of countries, it focused relentlessly on the Saudi market, built deep density in a small number of high-demand cities, and prioritized profitability over top-line growth from day one. When it listed on Tadawul in December 2021, it was already a profitable, cash-generating business — a rarity in global food delivery. Its ability to be profitable in a market where giants burn billions is the central puzzle of this case.</p>
<p>The answer lies in density. Food delivery economics are won or lost at the neighborhood level: the more orders per square kilometer, the shorter the rider trips, the higher the utilization, and the faster the delivery — all of which compress cost per order. Jahez's hyper-local focus, disciplined marketing, and deep integration with Saudi restaurant brands allowed it to reach the density threshold where each incremental order becomes profitable. This case examines how focus beats sprawl in a thin-margin marketplace, and whether the model can survive the arrival of better-funded global competitors.</p>

<h3>Background and History</h3>
<p>Jahez launched in 2016, well after global giants had already validated the food-delivery model. Rather than replicating the "subsidize and scale" approach, its founders bet that the Saudi market had structural advantages: high smartphone penetration, a young urban population, high restaurant density in cities like Riyadh and Jeddah, and a cultural appetite for delivery. Critically, it grew without the aggressive discounting that defined Western rivals, instead competing on restaurant selection, delivery speed, and reliability.</p>
<p>The COVID-19 pandemic was a turning point. Lockdowns collapsed dine-in demand and forced the entire restaurant industry online almost overnight. Delivery became essential infrastructure. Jahez rode this wave to a dominant position, and by the time of its 2021 IPO it was reporting profitability while its global peers were still deep in the red. The listing — one of Saudi Arabia's most prominent tech IPOs — validated a thesis that had seemed contrarian: that a delivery platform could be a good business, not just a big one.</p>
<p>The strategic question now is how Jahez defends and extends that profitability. Global competitors with deeper pockets have entered or expanded in the Gulf. Grocery delivery, quick-commerce, and cloud kitchens blur the boundaries of its core business. The company must decide whether to double down on its profitable food-delivery core, or diversify into adjacent, lower-margin categories in pursuit of growth.</p>

<table class="data">
  <thead><tr><th>Dimension</th><th>Global Giants (Uber Eats, DoorDash)</th><th>Jahez (Saudi)</th></tr></thead>
  <tbody>
    <tr><td>Geographic footprint</td><td>Dozens of countries</td><td>Focused on Saudi market</td></tr>
    <tr><td>Growth strategy</td><td>Subsidize demand, scale fast</td><td>Disciplined, density-first</td></tr>
    <tr><td>Profitability</td><td>Mostly unprofitable</td><td>Profitable</td></tr>
    <tr><td>Competitive moat</td><td>Brand + network</td><td>Local density + restaurant relationships</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Unit Economics and Density</h4>
<ul>
  <li>Why does order density — not total order volume — determine whether a delivery platform is profitable?</li>
  <li>Calculate how a 20% increase in orders per km² changes rider cost per order, holding other variables constant.</li>
  <li>Why did "subsidize and scale" work for ride-hailing but fail for food delivery in most markets?</li>
</ul>
<h4>2. Defensibility</h4>
<ul>
  <li>If Uber Eats enters Saudi Arabia with $1 billion to burn, what moats does Jahez actually have?</li>
  <li>Are restaurant relationships a real moat, or can a competitor simply list the same restaurants?</li>
  <li>What is the role of switching costs for restaurants versus for consumers?</li>
</ul>
<h4>3. Growth vs. Profitability</h4>
<ul>
  <li>Should Jahez expand into grocery delivery, quick-commerce, and cloud kitchens, or protect its profitable core?</li>
  <li>When is diversification a distraction, and when is it survival?</li>
</ul>
""",
    },
    {
        "filename": "Rasan_Insurtech_Case_Study.pdf",
        "title": "Rasan: The Insurtech Platform — Turning Insurance Brokerage into SaaS-Like Margins",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Rasan Information Technology Company (رسن)</td></tr>
  <tr><td class="label">Industry</td><td>Insurtech / Digital Insurance Marketplace</td></tr>
  <tr><td class="label">Founded</td><td>2016 — Riyadh, Saudi Arabia</td></tr>
  <tr><td class="label">Listing</td><td>Tadawul (ticker 8313)</td></tr>
  <tr><td class="label">Key Figures</td><td>Revenue grew 82% year-on-year; net profit margin ~41.2% — margins normally associated with software, not insurance brokerage</td></tr>
  <tr><td class="label">Case Focus</td><td>How a digital insurance broker transformed a low-margin, commission-based industry into a high-margin platform business</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze the economics of "asset-light" platform businesses and how digital distribution creates operating leverage in a regulated industry</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Insurance brokerage has historically been a people business: agents, phone calls, paperwork, and thin commissions. It is the classic low-margin, relationship-driven industry that technology companies were supposed to disrupt. Rasan — the Saudi insurtech behind the Tameeni (تأميني) platform — did exactly that, and the results redefined what an insurance intermediary can look like economically.</p>
<p>Rasan's core insight was that insurance in Saudi Arabia was being transformed by regulation and digitalization. Mandatory motor insurance created a massive, standardized, recurring demand. Instead of a human agent selling one policy at a time, Rasan built a digital marketplace where customers compare and buy policies directly, and where insurers compete for distribution. The result is a business with an 82% revenue growth rate and a net profit margin of roughly 41% — figures that resemble a software company more than a traditional broker.</p>
<p>The secret is asset-light operating leverage. Once the platform is built, each additional policy sold costs almost nothing to serve. There is no underwriting risk (Rasan does not carry the insurance risk — insurers do), no branch network, and no large sales force. Revenue scales with volume while costs stay roughly flat, which is the exact recipe for margin expansion. This case examines how digital distribution reshapes the economics of a regulated industry, and whether those margins are defensible as incumbents and global players respond.</p>

<h3>Background and History</h3>
<p>Rasan was founded in 2016 by a team that saw two converging forces: Saudi Arabia's mandatory motor insurance market (one of the region's largest) and the Kingdom's accelerating digital transformation under Vision 2030. The company built Tameeni, a consumer-facing insurance marketplace that digitized the entire purchase journey — comparison, quotation, binding, and policy issuance — often in minutes rather than days.</p>
<p>What made the model powerful was its position between customers and insurers. Insurers needed distribution; customers needed transparency and speed. Rasan captured both sides of the marketplace. Its technology reduced friction so dramatically that it became the default channel for a large share of motor insurance purchases, while its data on customer behavior gave it pricing and product intelligence that insurers valued. By the time of its listing, Rasan had demonstrated a rare combination: hypergrowth with genuine profitability.</p>
<p>The strategic tension is now the classic platform question. As Rasan expands into new insurance lines (health, travel, SME) and new markets, it must decide how far to stretch its asset-light model. Each new vertical adds complexity and potentially margin dilution, but also deepens the moat of a network that becomes more valuable with every additional insurer and customer.</p>

<table class="data">
  <thead><tr><th>Metric</th><th>Traditional Broker</th><th>Rasan (Insurtech)</th></tr></thead>
  <tbody>
    <tr><td>Distribution</td><td>Human agents, branches</td><td>Digital marketplace</td></tr>
    <tr><td>Underwriting risk</td><td>None (broker)</td><td>None (broker)</td></tr>
    <tr><td>Marginal cost per policy</td><td>High (human time)</td><td>Near zero (software)</td></tr>
    <tr><td>Growth model</td><td>Hire more agents</td><td>Scale the platform</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Operating Leverage</h4>
<ul>
  <li>Why does an asset-light platform generate higher margins than a traditional broker, even in the same revenue line?</li>
  <li>Where exactly does the 41% margin come from? Identify the cost structure differences.</li>
</ul>
<h4>2. Moat and Defensibility</h4>
<ul>
  <li>Can a large insurer simply build its own direct-to-consumer platform and cut out Rasan?</li>
  <li>What is the network effect here — does it favor Rasan or the insurers?</li>
</ul>
<h4>3. Regulation</h4>
<ul>
  <li>How does regulation (SAMA, mandatory insurance) simultaneously enable and constrain Rasan's model?</li>
  <li>What happens to the model if a regulator caps commissions?</li>
</ul>
""",
    },
    {
        "filename": "ACWAPower_Global_Expansion_Case_Study.pdf",
        "title": "ACWA Power: Project Finance at Scale — Funding a 70 Billion SAR Pipeline Without Drowning in Debt",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>ACWA Power (أكوا باور)</td></tr>
  <tr><td class="label">Industry</td><td>Power Generation, Renewables &amp; Water Desalination</td></tr>
  <tr><td class="label">Founded</td><td>2004 — Riyadh, Saudi Arabia</td></tr>
  <tr><td class="label">Listing</td><td>Tadawul (ticker 2082) — IPO 2021</td></tr>
  <tr><td class="label">Key Figures</td><td>SAR 70 billion of financial closings for 15 projects in a single year; one of the world's largest private water desalination portfolios; backed by the Public Investment Fund (PIF)</td></tr>
  <tr><td class="label">Case Focus</td><td>Project finance — how to fund massive, capital-intensive growth without letting leverage consume the balance sheet</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Understand the mechanics of non-recourse project finance, off-take agreements, and how long-term contracted cash flows support high leverage safely</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Power and water infrastructure is among the most capital-intensive businesses on earth. A single utility-scale project can require billions of dollars before it produces a single megawatt or a single liter of desalinated water. The companies that succeed are not necessarily the best engineers — they are the best financiers. ACWA Power has mastered the art of project finance at a scale few companies globally have matched, closing SAR 70 billion of financing for 15 projects in a single year.</p>
<p>The core of ACWA Power's model is the project finance structure. Each project is a legally ring-fenced special-purpose vehicle (SPV) with its own debt, secured not by the parent company's balance sheet but by the project's future cash flows. Those cash flows are themselves guaranteed by long-term power purchase agreements (PPAs) and water purchase agreements with governments and offtakers. This "non-recourse" structure allows ACWA Power to build enormous capacity while keeping leverage off its own balance sheet — the debt is the project's, not the company's.</p>
<p>The strategic challenge is that this model, while powerful, is not without limits. Non-recourse debt still requires substantial equity contributions. Currency, regulatory, and construction risks can delay or derail projects. And the recent Saudi and regional push into renewables — aligned with Vision 2030 and the Kingdom's net-zero ambitions — demands ever-faster execution. This case examines how ACWA Power funds hyper-growth without being swallowed by it, and what happens when the discipline of project finance meets the urgency of a national energy transition.</p>

<h3>Background and History</h3>
<p>Founded in 2004, ACWA Power grew from a regional developer into a global leader in power generation and water desalination. Its early advantage was timing: Saudi Arabia and the wider Gulf needed reliable, cost-efficient power and water at a time when governments were eager to shift capital-intensive infrastructure off their own balance sheets through public-private partnerships. ACWA Power became the partner of choice, repeatedly winning tenders for independent power and water projects.</p>
<p>The 2021 IPO on Tadawul was a landmark, valuing the company at over $4 billion and attracting strong international interest. The Public Investment Fund's backing gave it both credibility and access to capital, while its record-low solar tariffs — some of the cheapest electricity ever contracted — demonstrated genuine operational and financial efficiency. The company then expanded aggressively into Uzbekistan, Egypt, Azerbaijan, and beyond, becoming a flagship of Saudi Arabia's economic diversification abroad.</p>
<p>The financial engineering behind this expansion is the heart of the case. ACWA Power's ability to close SAR 70 billion of financing for 15 projects in one year reflects a repeatable, industrialized approach to project finance: standardized contracts, disciplined capital structure, and a deep bench of relationship lenders. The question is whether that discipline can be maintained as scale and speed increase.</p>

<table class="data">
  <thead><tr><th>Layer</th><th>What It Is</th><th>Risk It Addresses</th></tr></thead>
  <tbody>
    <tr><td>SPV (ring-fenced)</td><td>Each project is a separate legal entity</td><td>Contagion / parent default</td></tr>
    <tr><td>Non-recourse debt</td><td>Lenders are repaid from project cash flow only</td><td>Parent balance-sheet leverage</td></tr>
    <tr><td>PPA / WPA</td><td>Long-term purchase agreements</td><td>Revenue / demand uncertainty</td></tr>
    <tr><td>Equity (often with partners)</td><td>Sponsor + co-investor capital</td><td>Lender confidence</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Project Finance Mechanics</h4>
<ul>
  <li>Why do lenders accept non-recourse debt — and what gives them comfort instead of a parent guarantee?</li>
  <li>What is the difference between "the company's debt" and "the project's debt" in practice, and why does it matter for growth capacity?</li>
</ul>
<h4>2. Leverage and Discipline</h4>
<ul>
  <li>Under what conditions does high leverage become dangerous, even in project finance?</li>
  <li>How do currency risk, construction delays, and offtaker credit risk threaten the model?</li>
</ul>
<h4>3. Strategy</h4>
<ul>
  <li>Should ACWA Power prioritize growth (more projects) or balance-sheet strength (more equity)?</li>
  <li>How does the PIF backing change ACWA Power's risk appetite versus an independent developer?</li>
</ul>
""",
    },
    {
        "filename": "Almarai_Vertical_Integration_Case_Study.pdf",
        "title": "Almarai: Vertical Integration — From Desert Farm to the Gulf's Largest Food Company",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Almarai Company (المراعي)</td></tr>
  <tr><td class="label">Industry</td><td>Food &amp; Beverage — Dairy, Bakery, Poultry, Juices</td></tr>
  <tr><td class="label">Founded</td><td>1977 — Riyadh, Saudi Arabia</td></tr>
  <tr><td class="label">Listing</td><td>Tadawul (ticker 2280)</td></tr>
  <tr><td class="label">Key Figures</td><td>The Gulf's largest vertically integrated food company — from feed and dairy farms to processing, distribution and logistics</td></tr>
  <tr><td class="label">Case Focus</td><td>Vertical integration — owning the entire value chain from farm to shelf, and why that model is so hard to replicate</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze when vertical integration creates a durable competitive advantage versus when it becomes a costly, rigid liability</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Most food companies choose to specialize: farmers grow, processors process, and retailers distribute. Almarai chose the opposite path. From a modest dairy start in the Saudi desert in 1977, it built a fully integrated operation that controls nearly every link of the value chain — importing feed, running vast dairy farms, processing milk into hundreds of products, and operating its own refrigerated distribution network that reaches tens of thousands of retail outlets across the Gulf.</p>
<p>The logic is compelling. In a hot, water-scarce region with no natural dairy farming tradition, importing feed and managing the entire chain in-house was the only way to guarantee quality, freshness, and food security at scale. Vertical integration gave Almarai control over quality and cost that fragmented competitors could not match, and built a brand synonymous with freshness across Saudi Arabia. Today it is the region's largest integrated food company, a position that has taken competitors decades of capital investment to even approach.</p>
<p>But vertical integration is a double-edged sword. Owning farms, feed mills, processing plants, and a logistics fleet is enormously capital-intensive and operationally complex. It exposes the company to risks at every stage — from commodity feed prices to disease outbreaks to cold-chain failures — with no partner to share them. The central question of this case is when integration is a moat and when it is a burden, and how Almarai balances the control it needs with the flexibility that a fast-changing food market increasingly demands.</p>

<h3>Background and History</h3>
<p>Almarai's origin story is inseparable from Saudi Arabia's transformation. In the 1970s, the Kingdom was urbanizing rapidly and needed a reliable domestic supply of dairy. A small group of visionaries, with government support, set out to build dairy farming where none existed — importing Holstein cattle and feed, and building the cooling and processing infrastructure to handle the extreme climate. It was a bet that with enough capital and discipline, a desert nation could feed itself.</p>
<p>The bet paid off spectacularly. Almarai's scale in dairy gave it the cash flow and distribution muscle to expand into adjacent categories: juices, bakery, poultry, and infant nutrition. Each expansion leveraged the same integrated backbone — the farms, the processing plants, the logistics fleet, and the retail relationships. This is the textbook definition of economies of scope built on vertical integration.</p>
<p>The strategic question today is how much further integration should go. Global food trends toward plant-based alternatives, health-conscious products, and sustainability challenge the traditional integrated dairy model. Almarai must decide where the integrated chain is an asset to be defended, and where it is a legacy cost that new, asset-light competitors can undercut.</p>

<table class="data">
  <thead><tr><th>Value-Chain Stage</th><th>Almarai's Role</th><th>Advantage</th></tr></thead>
  <tbody>
    <tr><td>Feed &amp; farming</td><td>Own farms, imported feed</td><td>Quality &amp; supply control</td></tr>
    <tr><td>Processing</td><td>Own plants</td><td>Consistency, cost</td></tr>
    <tr><td>Distribution</td><td>Own refrigerated fleet</td><td>Freshness, cold chain</td></tr>
    <tr><td>Brand</td><td>Household name</td><td>Pricing power, trust</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Integration as a Moat</h4>
<ul>
  <li>Which links of Almarai's chain actually create a defensible advantage, and which are merely expensive assets?</li>
  <li>Why has no competitor been able to replicate Almarai's model at scale? Is it capital, time, or something else?</li>
</ul>
<h4>2. The Burden of Integration</h4>
<ul>
  <li>What risks does full integration concentrate that a fragmented value chain would spread?</li>
  <li>In a market shifting toward plant-based and asset-light models, which parts of Almarai's chain become liabilities?</li>
</ul>
<h4>3. Strategy</h4>
<ul>
  <li>Should Almarai divest non-core stages of its chain to free capital, or is integration too valuable to break?</li>
  <li>How does food security as a national priority shape Almarai's strategic choices versus a purely commercial company?</li>
</ul>
""",
    },
    {
        "filename": "STC_DigitalTransformation_Case_Study.pdf",
        "title": "STC: Digital Transformation — Repositioning a Mature Telecom as a Technology Group",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>stc Group (مجموعة STC) — Saudi Telecom Company</td></tr>
  <tr><td class="label">Industry</td><td>Telecommunications / Digital &amp; Technology</td></tr>
  <tr><td class="label">Founded</td><td>1998 — Riyadh, Saudi Arabia</td></tr>
  <tr><td class="label">Listing</td><td>Tadawul (ticker 7010)</td></tr>
  <tr><td class="label">Key Figures</td><td>The Gulf's most valuable telecom; majority state-owned via PIF; expanding into sovereign cloud, digital banking (stc bank) and fintech (stc pay)</td></tr>
  <tr><td class="label">Case Focus</td><td>Repositioning — how a mature, cash-rich telecom redefines itself as a diversified technology group</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze the strategy and risks of transforming a regulated utility into a growth-oriented digital conglomerate</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Telecommunications is a business of managed decline. Connectivity — once a high-margin, high-growth industry — has been commoditized. Voice revenues collapsed, and even data is under constant price pressure. Every mature telecom faces the same existential question: what do you become when your core product is no longer a growth engine? STC's answer has been the region's most ambitious digital transformation.</p>
<p>STC is not abandoning connectivity; it is using connectivity as the foundation for a much broader technology play. The company has built a sovereign cloud business, launched a digital bank (stc bank) and scaled a fintech arm (stc pay), invested in cybersecurity, data centers, and digital content, and expanded its geographic footprint across the Gulf and beyond. The strategy is to convert a regulated utility's cash flows and customer relationships into a portfolio of higher-growth digital businesses.</p>
<p>The logic is sound on paper, but transformation at this scale is brutally hard. Telecom culture — engineered for reliability and regulation — is often the enemy of the speed and risk-taking that digital businesses require. STC must balance the discipline of a utility with the ambition of a tech company, all while managing the expectations of a majority state shareholder. This case examines how a national champion repositions itself without losing the strengths that made it a champion in the first place.</p>

<h3>Background and History</h3>
<p>STC was born in 1998 as the Kingdom's incumbent telecom operator, and for two decades its story was the story of Saudi connectivity: building the network, connecting the nation, and generating the cash flows that came with near-ubiquitous mobile penetration. But as connectivity matured, growth stalled, and STC faced the classic incumbent's dilemma — protect a shrinking core or invest in an uncertain future.</p>
<p>The company chose to invest. Under the umbrella of a strategy it calls "DARE," STC began systematically diversifying: cloud computing for government and enterprise, a digital wallet that became one of the region's leading fintech platforms, and eventually a full digital bank. Each move leveraged STC's existing assets — its customer base, its network, its brand, and its balance sheet — to enter adjacent markets where growth was still available.</p>
<p>The result is a fundamentally different company wearing a familiar name. But the transformation is incomplete, and the risks are real. Regulated utilities and digital disruptors answer to different masters, and a company that tries to be both risks being good at neither. The strategic question is how STC sustains the transformation while keeping the cash-generating core healthy enough to fund it.</p>

<table class="data">
  <thead><tr><th>Business</th><th>Stage</th><th>Strategic Role</th></tr></thead>
  <tbody>
    <tr><td>Connectivity (core)</td><td>Mature</td><td>Cash generator</td></tr>
    <tr><td>Sovereign cloud</td><td>Scaling</td><td>Growth engine</td></tr>
    <tr><td>stc pay / stc bank</td><td>Scaling</td><td>Fintech growth</td></tr>
    <tr><td>Cybersecurity / data centers</td><td>Emerging</td><td>Option value</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Repositioning Strategy</h4>
<ul>
  <li>Why is connectivity a "shrinking core," and what are the strategic options a mature telecom actually has?</li>
  <li>How does a regulated utility's culture conflict with the speed a digital business requires?</li>
</ul>
<h4>2. Adjacency and Synergy</h4>
<ul>
  <li>Which STC diversification moves have genuine synergies with its core, and which are bets in unrelated markets?</li>
  <li>How does the sovereign-cloud and digital-banking push benefit from state ownership — and how might it be constrained by it?</li>
</ul>
<h4>3. Execution</h4>
<ul>
  <li>Can a single company credibly run a utility and a disruptor simultaneously? What organizational design would make it work?</li>
  <li>How should STC measure the success of its transformation — financial metrics, market share, or something else?</li>
</ul>
""",
    },
    {
        "filename": "Nvidia_Repositioning_Case_Study.pdf",
        "title": "Nvidia: Strategic Repositioning — From Gaming Chips to the Engine of the AI Revolution",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>NVIDIA Corporation</td></tr>
  <tr><td class="label">Industry</td><td>Semiconductors / Accelerated Computing</td></tr>
  <tr><td class="label">Founded</td><td>1993 — Jensen Huang, Chris Malachowsky, Curtis Priem</td></tr>
  <tr><td class="label">Headquarters</td><td>Santa Clara, California, USA</td></tr>
  <tr><td class="label">Key Figures</td><td>Became one of the world's most valuable companies; GPUs evolved from gaming hardware into the core infrastructure of AI</td></tr>
  <tr><td class="label">Case Focus</td><td>Strategic repositioning — a decade-long platform bet that turned a niche chipmaker into the engine of artificial intelligence</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Understand how a company creates a durable "platform moat" by betting on a future market years before it materializes</td></tr>
</table>

<h3>Executive Summary</h3>
<p>For most of its first two decades, Nvidia was a gaming company. Its graphics processing units (GPUs) were the silicon behind the world's video games — a lucrative but relatively niche business. Then, in the 2000s, Nvidia made a bet that would define the next era of computing: it began investing in making its GPUs programmable for general-purpose computing, well before there was an obvious market for that capability.</p>
<p>That bet was CUDA — a software platform that let developers use GPUs for everything from scientific simulation to, eventually, machine learning. It was deeply unpopular internally at first, a costly side project with no clear return. But when deep learning emerged in the 2010s, the researchers who built it discovered that GPUs — and specifically Nvidia's CUDA platform — were the perfect engine for training neural networks. Nvidia had spent a decade building a moat that no one else even knew was being dug.</p>
<p>The result is one of the most remarkable strategic repositionings in corporate history. Nvidia went from selling chips for games to being the indispensable infrastructure of the AI revolution, with a market value that soared into the trillions. But the moat is not just the hardware — it is the ecosystem: millions of developers, libraries, and frameworks built on CUDA, which competitors cannot easily replicate. This case examines how a company bets on the future, and why the software platform, not the chip, is the real source of durable advantage.</p>

<h3>Background and History</h3>
<p>Founded in 1993 by Jensen Huang and two colleagues, Nvidia's first breakthrough was the GPU, which rendered graphics by performing many calculations in parallel — a fundamentally different architecture from the sequential CPUs made by Intel and AMD. For years, parallel processing was useful mainly for games. Nvidia's dominance of that market gave it the cash flow to fund more speculative ambitions.</p>
<p>The pivotal decision came in the mid-2000s, when Huang pushed the company to make GPUs programmable through CUDA. It was a classic platform play: Nvidia would not just sell chips, but a software ecosystem that locked developers to its hardware. For years, the investment looked like a drag on margins. Huang's insistence — against Wall Street's skepticism — became legendary.</p>
<p>Then deep learning arrived. In 2012, a neural network trained on Nvidia GPUs won a major image-recognition competition by a stunning margin, and the AI world never looked back. Every serious AI lab, from the tech giants to the smallest startups, standardized on Nvidia. The decade of "wasted" investment in CUDA became a moat of network effects and switching costs that rivals are still struggling to cross.</p>

<table class="data">
  <thead><tr><th>Era</th><th>Nvidia's Focus</th><th>Market</th></tr></thead>
  <tbody>
    <tr><td>1990s–2000s</td><td>Gaming GPUs</td><td>Video games</td></tr>
    <tr><td>2006+</td><td>CUDA (programmable GPUs)</td><td>Scientific computing</td></tr>
    <tr><td>2012+</td><td>Deep learning training</td><td>AI research</td></tr>
    <tr><td>2020s</td><td>AI infrastructure</td><td>Data centers, cloud</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Platform vs. Product</h4>
<ul>
  <li>Why is CUDA — the software — a stronger moat than the GPU hardware itself?</li>
  <li>What are the switching costs that lock AI developers to Nvidia's ecosystem?</li>
</ul>
<h4>2. Betting on the Future</h4>
<ul>
  <li>How did Nvidia justify a decade of investment in CUDA before the market existed? What signals told Huang it would pay off?</li>
  <li>What does it take for a leader to sustain a contrarian bet against shareholder pressure?</li>
</ul>
<h4>3. Risk</h4>
<ul>
  <li>What could break Nvidia's moat — custom chips (TPUs), open-source alternatives, or a shift in AI techniques?</li>
  <li>How vulnerable is Nvidia to customer concentration in a handful of hyperscalers?</li>
</ul>
""",
    },
    {
        "filename": "LEGO_Turnaround_Case_Study.pdf",
        "title": "LEGO: The Turnaround — From the Brink of Bankruptcy in 2003 to a Record 2025",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>The LEGO Group</td></tr>
  <tr><td class="label">Industry</td><td>Toys / Construction Sets</td></tr>
  <tr><td class="label">Founded</td><td>1932 — Ole Kirk Christiansen, Billund, Denmark</td></tr>
  <tr><td class="label">Key Figures</td><td>Near-bankruptcy in 2003 with losses of ~$300M; transformed into a record-breaking company with its best year ever in 2025</td></tr>
  <tr><td class="label">Case Focus</td><td>Turnaround — how refocusing on the core product ("back to the brick") rescued one of the world's most beloved brands</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze how diversification destroyed focus, and how disciplined simplification restored profitability and growth</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In 2003, LEGO was dying. The Danish toymaker — one of the most iconic brands on earth — was losing roughly $300 million a year, bleeding cash, and facing a real prospect of bankruptcy. The culprit was not a lack of ambition but an excess of it. In its pursuit of growth, LEGO had diversified into theme parks, video games, clothing, watches, and dozens of new product lines that stretched the brand thin and buried the core product under complexity.</p>
<p>The turnaround was built on a radical act of simplification: "back to the brick." New leadership cut the sprawling portfolio, sold off non-core businesses, and returned the company's obsessive focus to the plastic brick and the creative play it enables. Rather than chasing every new toy trend, LEGO doubled down on what made it special — and then innovated within that core, most famously through licensed themes like Star Wars and its own Bionicle and Ninjago franchises.</p>
<p>The results were extraordinary. From near-collapse, LEGO rebuilt itself into a case study in focus, producing its best year ever in 2025 and cementing its place as one of the most valuable toy brands in history. The lesson is counterintuitive: LEGO grew by doing less, not more. This case examines the mechanics of that turnaround, and why the discipline to subtract — not add — is often the hardest and most important strategic skill.</p>

<h3>Background and History</h3>
<p>LEGO's first product, the interlocking plastic brick, debuted in 1958 and became the foundation of a global empire. For four decades the company thrived on a simple, brilliant formula: one system, infinite possibilities. But by the late 1990s, fearing that digital entertainment would render physical toys obsolete, LEGO panicked and diversified aggressively. It launched clothing lines, watches, video games, theme parks, and even jewelry — most of which lost money and, worse, distracted the company from its core.</p>
<p>The complexity was ruinous. LEGO's product portfolio ballooned to tens of thousands of unique parts, many redundant, which inflated manufacturing costs and confused both retailers and consumers. The company had forgotten the very thing that made it great: that the brick is valuable precisely because it is simple, universal, and timeless.</p>
<p>The rescue, led by Jørgen Vig Knudstorp, was an exercise in focus. Non-core businesses were sold. The number of parts was slashed. The supply chain was simplified. And the company re-engaged with its most passionate customers — adult fans and children alike — treating them as co-creators rather than just buyers. The "back to the brick" strategy did not mean standing still; it meant innovating within a rediscovered core.</p>

<table class="data">
  <thead><tr><th>Phase</th><th>Strategy</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>1990s</td><td>Aggressive diversification</td><td>Complexity, losses</td></tr>
    <tr><td>2003–2004</td><td>Crisis / near-bankruptcy</td><td>Survival mode</td></tr>
    <tr><td>2004–2010</td><td>"Back to the brick"</td><td>Return to profit</td></tr>
    <tr><td>2010–2025</td><td>Innovation within core</td><td>Record results</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Focus vs. Diversification</h4>
<ul>
  <li>Why did LEGO's diversification destroy value even though it entered "logical" adjacent categories?</li>
  <li>How do you know when diversification is strategic growth versus panic-driven distraction?</li>
</ul>
<h4>2. The Turnaround</h4>
<ul>
  <li>Why is subtracting (products, parts, complexity) often harder and more valuable than adding?</li>
  <li>What role did customer engagement (adult fans, communities) play in the recovery?</li>
</ul>
<h4>3. Sustaining Success</h4>
<ul>
  <li>How does LEGO keep innovating within its core without repeating the diversification mistake?</li>
  <li>What is the next threat to LEGO — digital play, sustainability, or something else — and how should it respond?</li>
</ul>
""",
    },
    {
        "filename": "Nubank_EmergingMarketScale_Case_Study.pdf",
        "title": "Nubank: Scaling in Emerging Markets — 131 Million Customers at $0.80 to Serve Each",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Nubank (Nu Holdings)</td></tr>
  <tr><td class="label">Industry</td><td>Fintech / Digital Banking</td></tr>
  <tr><td class="label">Founded</td><td>2013 — David Vélez, Cristina Junqueira, Edward Wible</td></tr>
  <tr><td class="label">Headquarters</td><td>São Paulo, Brazil</td></tr>
  <tr><td class="label">Key Figures</td><td>131 million customers; cost to serve ~$0.80 per active customer per month — versus traditional banks' tens of dollars; one of Latin America's most valuable companies</td></tr>
  <tr><td class="label">Case Focus</td><td>Profitable scale in an emerging market — how digital infrastructure collapses the cost of financial inclusion</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze how asset-light digital banks build profitability in markets where traditional banking is expensive and inaccessible</td></tr>
</table>

<h3>Executive Summary</h3>
<p>For most of Latin America's history, banking was a luxury. A handful of incumbents dominated, charging high fees, maintaining branches only in wealthy areas, and effectively excluding a huge share of the population from basic financial services. This exclusion was not just a social problem — it was an enormous, underserved market waiting for a different cost structure. Nubank was built to capture it.</p>
<p>Founded in 2013 in Brazil, Nubank's premise was radical in its simplicity: if you could serve a customer through a smartphone app instead of a branch network, the cost of banking would collapse. No branches, no legacy systems, no bloated workforce — just software. That structural advantage let Nubank offer a credit card with no annual fee and a digital account that cost customers nothing, while still generating healthy margins for itself. The result was explosive, organic growth driven largely by word of mouth.</p>
<p>Today Nubank serves 131 million customers at a cost to serve of roughly $0.80 per active customer per month — a figure that traditional banks, burdened by branches and legacy infrastructure, can only dream of. The company has expanded from a single credit card into a full digital bank, and from Brazil into Mexico and Colombia. This case examines how a radically lower cost structure creates both inclusion and profit, and whether that model can be replicated — and defended — across the emerging world.</p>

<h3>Background and History</h3>
<p>David Vélez, a former venture capitalist, arrived in Brazil and experienced firsthand the hostility of the banking system: to open a simple account, he faced long queues, bulletproof-glass teller windows, and onerous fees. He saw not just frustration but an opportunity. Brazil's banking market was dominated by a few incumbents with enormous margins and terrible service — the classic conditions for disruption.</p>
<p>Nubank launched in 2013 with a single product: a no-fee credit card controlled entirely through a mobile app. It was a bet that Brazilian consumers — even those new to credit — could be served profitably if the cost structure was low enough. The bet paid off. Word-of-mouth growth was so strong that Nubank famously stopped advertising, relying instead on customer referrals. By 2021, when it listed on the NYSE, it had become the largest digital bank in the world by number of customers.</p>
<p>The strategic challenge now is scaling without losing the cost discipline that made it work. As Nubank expands into lending, investments, and new countries, each new product and market adds complexity and risk — credit risk, regulatory risk, and operational risk. The question is whether the $0.80 cost-to-serve model can survive contact with a broader, riskier product mix.</p>

<table class="data">
  <thead><tr><th>Dimension</th><th>Traditional Bank</th><th>Nubank</th></tr></thead>
  <tbody>
    <tr><td>Distribution</td><td>Branch network</td><td>Mobile app</td></tr>
    <tr><td>Cost to serve</td><td>Tens of dollars/month</td><td>~$0.80/month</td></tr>
    <tr><td>Customer acquisition</td><td>Branches, ads</td><td>Word of mouth</td></tr>
    <tr><td>Barrier to entry</td><td>Physical + regulatory</td><td>Brand + data + scale</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Cost Structure</h4>
<ul>
  <li>Where exactly does the $0.80 cost-to-serve come from, and why can't incumbents simply copy it?</li>
  <li>Why is "no annual fee" sustainable for Nubank when it was not for traditional issuers?</li>
</ul>
<h4>2. Financial Inclusion</h4>
<ul>
  <li>Is financial inclusion a cause or a consequence of Nubank's model? Can a business be both mission-driven and profit-maximizing?</li>
  <li>What are the risks of extending credit to previously unbanked populations?</li>
</ul>
<h4>3. Replication</h4>
<ul>
  <li>Can the Nubank model be replicated in other emerging markets — including the Gulf? What conditions are required?</li>
  <li>How does Nubank defend itself against incumbents and well-funded copycats as it expands?</li>
</ul>
""",
    },
    {
        "filename": "Ferrari_Scarcity_Pricing_Case_Study.pdf",
        "title": "Ferrari: Scarcity as Strategy — Growing by Deliberately Selling Less",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Ferrari N.V.</td></tr>
  <tr><td class="label">Industry</td><td>Luxury Automotive</td></tr>
  <tr><td class="label">Founded</td><td>1939 — Enzo Ferrari, Maranello, Italy</td></tr>
  <tr><td class="label">Key Figures</td><td>Ships fewer cars than demand; multi-year waiting lists; margins and brand value that dwarf volume manufacturers; consistently one of the most profitable automakers per car</td></tr>
  <tr><td class="label">Case Focus</td><td>Scarcity pricing — how a company grows revenue and profit by deliberately limiting supply below demand</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Understand the economics of exclusivity and why, in luxury, restraint is a growth strategy rather than a sacrifice</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Every mainstream automaker lives by one iron law: sell more cars. Scale drives down unit costs, and volume growth is the primary engine of revenue. Ferrari breaks that law on purpose. Year after year, it produces fewer cars than the market wants to buy, maintains waiting lists measured in years, and — astonishingly — has grown into one of the most profitable automakers in the world by selling less than its peers, not more.</p>
<p>The logic is the logic of luxury. Ferrari does not sell transportation; it sells desire, status, and belonging to an exclusive club. That value depends on scarcity. If every wealthy buyer could walk in and drive away with a Ferrari, it would cease to be a Ferrari in the way that matters — the mystique would evaporate, and with it the pricing power. By limiting supply, Ferrari preserves the very scarcity that justifies its premium prices and stratospheric margins.</p>
<p>This is not merely a marketing gimmick; it is a carefully engineered economic strategy. Scarcity supports pricing power, which supports margins, which supports the brand, which supports demand — a virtuous cycle that volume manufacturers cannot replicate. The central tension of this case is how Ferrari manages the delicate balance: grow revenue and profit while never satisfying demand, and expand into new categories (SUVs, hybrids) without diluting the exclusivity that is the brand's entire foundation.</p>

<h3>Background and History</h3>
<p>Ferrari began as a racing team before it became a carmaker. Enzo Ferrari's obsession was motorsport, and road cars were initially a means to fund it. That racing DNA — performance, victory, and a certain ruthless exclusivity — became the brand's soul. For decades, Ferrari sold a limited number of cars to a wealthy clientele, and its name became synonymous with automotive desire.</p>
<p>The modern era of Ferrari's strategy began with its separation from Fiat Chrysler and its 2015 IPO, which allowed it to be run explicitly as a luxury brand rather than a volume subsidiary. Under this strategy, Ferrari resisted the temptation to chase volume, instead managing production carefully and expanding into higher-margin segments. The launch of the Purosangue SUV — controversial among purists — tested whether Ferrari could extend its brand into new categories without destroying its scarcity.</p>
<p>The result has been exceptional financial performance, with profit margins per vehicle far exceeding any mainstream manufacturer. But the strategy carries an inherent risk: scarcity only works if demand stays strong, and demand only stays strong if the brand remains genuinely desirable. Ferrari must continually renew the mystique — through racing victories, limited editions, and uncompromising quality — or the cycle collapses.</p>

<table class="data">
  <thead><tr><th>Lever</th><th>How Ferrari Uses It</th><th>Effect</th></tr></thead>
  <tbody>
    <tr><td>Limited production</td><td>Supply below demand</td><td>Waiting lists, desirability</td></tr>
    <tr><td>Pricing power</td><td>Premium prices</td><td>High margins</td></tr>
    <tr><td>Brand / racing</td><td>Continuous mystique</td><td>Sustained demand</td></tr>
    <tr><td>Controlled expansion</td><td>Careful new segments</td><td>Growth without dilution</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Scarcity Economics</h4>
<ul>
  <li>Why does scarcity increase a luxury brand's value, while it would destroy a commodity brand?</li>
  <li>How does Ferrari grow revenue while deliberately selling fewer cars than it could?</li>
</ul>
<h4>2. The Virtuous Cycle</h4>
<ul>
  <li>Trace the feedback loop from scarcity to pricing power to margin to brand desirability. Where is it most fragile?</li>
  <li>What would break the cycle — overproduction, quality failures, or a shift in consumer values?</li>
</ul>
<h4>3. Expansion Dilemma</h4>
<ul>
  <li>Does the Purosangue SUV strengthen Ferrari or dilute it? How do you expand without killing scarcity?</li>
  <li>How should Ferrari approach electrification, given that the brand's identity is tied to its engines?</li>
</ul>
""",
    },
    {
        "filename": "Starbucks_RecoveryLeadership_Case_Study.pdf",
        "title": "Starbucks: Recovery Leadership — Cutting Profit on Purpose to Save the Company",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Starbucks Corporation</td></tr>
  <tr><td class="label">Industry</td><td>Specialty Coffee / Food &amp; Beverage</td></tr>
  <tr><td class="label">Founded</td><td>1971 — Seattle, Washington, USA</td></tr>
  <tr><td class="label">Key Figures</td><td>The world's largest coffeehouse chain; new leadership deliberately cut near-term profit to fix a broken in-store experience, betting on long-term recovery</td></tr>
  <tr><td class="label">Case Focus</td><td>Recovery leadership — sacrificing today's profit to invest in tomorrow's survival and growth</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze when short-term financial sacrifice is a rational investment in long-term value, and how leaders navigate that tension</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Starbucks built a global empire on a simple promise: a "third place" between home and work where people could gather over a good cup of coffee. For decades, that promise drove extraordinary growth, from a single Seattle store to tens of thousands worldwide. But somewhere along the way, Starbucks became a victim of its own operational complexity. The stores, optimized for speed and volume, lost the warmth that made the brand. Mobile ordering overwhelmed baristas. The experience became transactional, and customers — and the market — noticed.</p>
<p>The company's response, under new leadership, was striking: it chose to make the business worse on paper, on purpose. It slowed down the store experience, reinvested in labor and store design, and accepted lower near-term profitability — explicitly telling investors that profit would fall before it could rise. This was not incompetence or drift; it was a deliberate strategic bet that the only way to save the brand was to temporarily sacrifice the numbers.</p>
<p>The central question of this case is one every leader faces at some point: how do you justify reducing profit today to secure a future? The Starbucks story illustrates both the courage and the risk of such a move. It requires convincing shareholders to accept short-term pain, rebuilding trust with employees and customers, and executing a turnaround while the financial clock ticks. This case examines the leadership of recovery, and why the hardest decisions are often the ones that look worst in the quarterly report.</p>

<h3>Background and History</h3>
<p>Starbucks' rise under Howard Schultz turned coffee from a commodity into an experience and a lifestyle. The "third place" concept — a comfortable, human space between home and work — was the heart of the brand, and it powered expansion into a global phenomenon. But as the company scaled, the tension between experience and efficiency grew. Mobile ordering, drive-throughs, and relentless new product launches turned stores into high-volume fulfillment centers, and the human warmth that defined Starbucks began to erode.</p>
<p>By the time new leadership arrived, the problems were visible: declining comparable sales in key markets, employee dissatisfaction, and a brand that had drifted from its roots. The diagnosis was that Starbucks had optimized for transactions and lost its soul. The remedy was to reverse course — to slow down, to reinvest in the experience, and to rebuild the relationship with both baristas and customers.</p>
<p>The financial consequence was immediate and, by design, painful: near-term profit was cut in half. The bet was that this sacrifice would restore the customer experience, re-energize the brand, and ultimately produce stronger, more durable growth. Whether the bet succeeds is a live question — which is precisely what makes it a powerful case in leadership under pressure.</p>

<table class="data">
  <thead><tr><th>Era</th><th>Focus</th><th>Trade-off</th></tr></thead>
  <tbody>
    <tr><td>Growth era</td><td>Scale, speed, volume</td><td>Eroded experience</td></tr>
    <tr><td>Recovery era</td><td>Experience, labor, brand</td><td>Lower near-term profit</td></tr>
    <tr><td>Target</td><td>Durable growth</td><td>Rebuilt brand</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Sacrifice as Strategy</h4>
<ul>
  <li>When is cutting profit "on purpose" a rational investment, and when is it merely disguising failure?</li>
  <li>How do you convince shareholders and a public market to accept a deliberate profit decline?</li>
</ul>
<h4>2. Leadership</h4>
<ul>
  <li>What distinguishes recovery leadership from turnaround management? Is the difference real or just framing?</li>
  <li>How does a leader rebuild trust with employees and customers simultaneously?</li>
</ul>
<h4>3. Execution and Timing</h4>
<ul>
  <li>How long can a company sustain deliberate losses before the bet becomes irreversible?</li>
  <li>What early-warning signals would tell you the recovery is working — or failing?</li>
</ul>
""",
    },
]


def build_html(title, body_html):
    css = CSS.replace("__FONT_PATH__", FONT_PATH)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>{css}</style>
</head>
<body>
{HEADER_HTML}
<h1>{title}</h1>
{body_html}
</body>
</html>"""


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    for study in CASE_STUDIES:
        html = build_html(study["title"], study["html"])
        doc = weasyprint.HTML(string=html)
        output_path = os.path.join(OUT_DIR, study["filename"])
        doc.write_pdf(output_path)
        print(f"✅ {study['filename']}")

    print(f"\n{len(CASE_STUDIES)} English PDFs generated in {OUT_DIR}")


if __name__ == "__main__":
    main()
