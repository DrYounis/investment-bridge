#!/usr/bin/env python3
"""
generate_english_case_studies.py
Generate the English case study PDFs with WeasyPrint.

Mirrors the Arabic case studies (generate-weasyprint-pdfs.py) in English (LTR),
using the same marfa running header convention as the other English case studies.

Covers the global cases whose English PDFs were missing/broken:
Netflix, Google Project Aristotle, Theranos, IKEA, J&J Tylenol, Patagonia, Quibi.

Output: public/case-studies/<name>_Case_Study.pdf
"""

import os
import weasyprint

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(SCRIPT_DIR, "..", "public", "case-studies")
FONT_PATH = os.path.join(SCRIPT_DIR, "..", "fonts", "Cairo.ttf")

# ── CSS (English / LTR, marfa branding) ──
CSS = """
@font-face {
  font-family: 'Cairo';
  src: url('file://__FONT_PATH__');
}

@page {
  size: A4;
  margin: 38mm 15mm 20mm 15mm;  /* top = 22mm header + 16mm breathing gap */
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

/* ── Typography ── */
h1 { font-size: 16pt; color: #0a0f1e; break-after: avoid; margin: 8mm 0 4mm 0; text-align: center; }
h2 { font-size: 13pt; color: #0a0f1e; break-after: avoid; margin: 6mm 0 3mm 0;
     border-bottom: 2pt solid #c9a84c; padding-bottom: 2mm; }
h3 { font-size: 12pt; color: #0a0f1e; break-after: avoid; margin: 6mm 0 3mm 0;
     border-bottom: 2pt solid #c9a84c; padding-bottom: 2mm; }
h4 { font-size: 11pt; color: #0a0f1e; break-after: avoid; margin: 4mm 0 2mm 0; }

p { orphans: 3; widows: 3; margin: 0 0 3mm 0; text-align: justify; }
ul, ol { orphans: 3; widows: 3; margin: 2mm 0 4mm 0; padding-left: 6mm; }
li { margin-bottom: 2mm; }

/* ── Tables ── */
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
        "filename": "Netflix_Innovation_Case_Study.pdf",
        "title": "Netflix: Innovation Through Self-Destruction — From DVD Rentals to the Streaming Empire",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Netflix, Inc.</td></tr>
  <tr><td class="label">Industry</td><td>Entertainment / Digital Streaming</td></tr>
  <tr><td class="label">Founded</td><td>1997 — Reed Hastings and Marc Randolph</td></tr>
  <tr><td class="label">Headquarters</td><td>Los Gatos, California, USA</td></tr>
  <tr><td class="label">Key Figures</td><td>2023 Revenue: $33.7B | Subscribers: 260M+ | Market Cap: $200B+ | 190 Countries</td></tr>
  <tr><td class="label">Case Focus</td><td>Innovation — self-destruction strategy and digital transformation</td></tr>
  <tr><td class="label">Teaching Objective</td><td>Analyze how a successful company deliberately destroys its current business model to adopt a new one before competitors do</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In 1997, Reed Hastings was late returning a rented copy of <i>Apollo 13</i> and paid a $40 late fee. From that embarrassing moment, Netflix was born as a mail-order DVD rental service with no late fees. By 2005, the company was shipping one million DVDs a day. Then in 2007 — at the very peak of the DVD model's success — Hastings launched streaming. Everyone thought he was crazy. DVD margins were excellent. The internet was not fast enough. Why willingly destroy your main source of revenue?</p>
<p>In 2011, Hastings tried to split DVD from streaming under the name Qwikster — a colossal failure. The stock dropped 77%. He resigned. He apologized. He came back stronger. Then in 2013, he made the boldest decision of all: Netflix would no longer be merely a distributor — it would become a content producer. It entered <i>House of Cards</i> with $100 million. Everyone laughed again. Today, Netflix spends $17 billion a year on original content. It has transformed from a disc-rental service into the world's leading streaming network.</p>
<p>This case study examines the "self-destruction" philosophy — how you willingly kill your core source of revenue to embrace an uncertain future. Netflix destroyed two of its own successful models before any competitor did: first the DVD model in favor of streaming, then the distribution model in favor of original content production. The word Netflix became a verb — "Netflix and chill" — a global brand. The central question: can traditional organizations apply this self-destruction philosophy, or is it reserved for startups?</p>

<h3>Background and History</h3>
<p>Reed Hastings co-founded Pure Software in 1991 and sold it in 1997 for $750 million. He learned a hard lesson: bureaucracy kills innovation. With Netflix, he designed a radically anti-bureaucratic culture — "freedom and responsibility" — later documented in his famous "Netflix Culture" deck. The core principle: hire mature adults, give them context instead of control, and fire the merely adequate generously.</p>
<p>The 2007 streaming decision was an existential gamble. The DVD service was printing money. Streaming quality was poor. The content library was limited. But Hastings saw that physical discs would inevitably become obsolete. Rather than waiting to be destroyed by someone else, he decided to destroy himself first. He invested hundreds of millions in streaming licenses and delivery servers while the DVD model still generated profits. By 2013, streaming subscriptions surpassed DVD subscriptions. Hastings stopped DVD investments entirely.</p>
<p>Then came the <i>House of Cards</i> moment. David Fincher and Kevin Spacey pitched the project to HBO, Showtime, and AMC — all of them rejected it. Netflix offered $100 million for two seasons without seeing a single pilot — trusting only the data showing that subscribers loved political dramas and Fincher and Spacey films. The formula was: Data + Boldness + Talent = Original Content. It worked. <i>House of Cards</i> won nine Emmy nominations. Netflix's original content strategy was born.</p>

<table class="data">
  <thead><tr><th>Year</th><th>Subscribers (M)</th><th>Revenue ($B)</th><th>Key Event</th></tr></thead>
  <tbody>
    <tr><td>1997</td><td>—</td><td>—</td><td>Founded as a mail-order DVD rental service</td></tr>
    <tr><td>2007</td><td>7.5</td><td>1.2</td><td>Streaming launched — the DVD model destroyed</td></tr>
    <tr><td>2013</td><td>44</td><td>4.4</td><td><i>House of Cards</i> launched — original content</td></tr>
    <tr><td>2017</td><td>117</td><td>11.7</td><td>First entertainment company to win a major Oscar</td></tr>
    <tr><td>2020</td><td>203</td><td>25.0</td><td>Pandemic peak — 37 million new subscribers</td></tr>
    <tr><td>2023</td><td>260+</td><td>33.7</td><td>Expansion into gaming and advertising</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<h4>1. Innovation and Self-Destruction</h4>
<ul>
  <li>How does Netflix destroy two of its own successful business models — first DVD, then distribution — willingly, before any competitor does? What culture allows this?</li>
  <li>Why can't most organizations "destroy themselves" even when they see the coming threats? Apply Clayton Christensen's "Innovator's Dilemma."</li>
  <li>Is Netflix's move from distribution to production really self-destruction, or merely vertical diversification?</li>
</ul>
<h4>2. Data-Driven Innovation</h4>
<ul>
  <li>How does Netflix use data to make creative decisions? Analyze the <i>House of Cards</i> decision as a case of data-driven decision-making versus creative intuition.</li>
  <li>What are the limits of data-driven innovation? Can data tell you what customers don't know they want?</li>
  <li>How does Netflix balance its "recommendation algorithm" with "creative risk-taking"?</li>
</ul>
<h4>3. Organizational Culture for Innovation</h4>
<ul>
  <li>The famous "Netflix Culture" deck: "freedom and responsibility." How does this philosophy enable rapid innovation?</li>
  <li>How does Netflix's culture affect talent attraction and retention?</li>
  <li>Can Netflix's culture be transplanted to traditional companies?</li>
</ul>
""",
    },
    {
        "filename": "Google_Aristotle_HR_Case_Study.pdf",
        "title": "Google — Project Aristotle: What Actually Makes a High-Performing Team?",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Google LLC (Alphabet Inc.)</td></tr>
  <tr><td class="label">Industry</td><td>Technology / Search and Advertising</td></tr>
  <tr><td class="label">Founded</td><td>1998 — Larry Page and Sergey Brin</td></tr>
  <tr><td class="label">Headquarters</td><td>Mountain View, California, USA</td></tr>
  <tr><td class="label">Key Figures</td><td>Employees: 180,000+ | 180 teams studied | Two years of research</td></tr>
  <tr><td class="label">Case Focus</td><td>Human Resources — psychological safety and team effectiveness</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In 2012, Google launched "Project Aristotle" — an ambitious study analyzing 180 internal teams over two years, to answer a single question: "What makes some teams high-performing while other teams with the same talent struggle?" The initial hypothesis was that the best teams are those that "assemble stars" — the smartest and most experienced individuals. But the data proved the exact opposite.</p>
<p>After analyzing hundreds of variables — education, personality, skills, gender, age, shared hobbies, office locations — the researchers reached a striking conclusion: who is on the team matters far less than how they interact together. One factor stood above all others as the strongest indicator of team effectiveness: psychological safety.</p>
<p>Researcher Amy Edmondson of Harvard University defined it as "the shared belief that the team is safe for interpersonal risk-taking." In teams with high psychological safety, members feel comfortable asking questions, admitting mistakes, offering half-formed ideas, and disagreeing with the manager — without fear of punishment or embarrassment. In teams with low psychological safety, silence prevails. Mistakes are hidden. Bold ideas are never raised. The result: lower performance despite the same talent.</p>
<p>This case study reveals the five findings of Project Aristotle — psychological safety, dependability, structure and clarity, meaning, and impact — with psychological safety as the foundation of the other four. Google changed how it forms teams and trains managers based on these findings. The practical application: how any organization — from a startup to a government ministry — can build "psychologically safe" teams that deliver exceptional performance.</p>

<h3>The Five Dynamics of Team Effectiveness</h3>
<table class="meta">
  <tr><td class="label">1. Psychological safety</td><td>The belief that you won't be punished for taking risks, asking questions, or admitting mistakes</td></tr>
  <tr><td class="label">2. Dependability</td><td>Knowing your teammates will deliver what they promised on time</td></tr>
  <tr><td class="label">3. Structure and clarity</td><td>Clear roles, goals, and execution plans for each member</td></tr>
  <tr><td class="label">4. Meaning</td><td>The feeling that the work matters personally to each team member</td></tr>
  <tr><td class="label">5. Impact</td><td>The belief that the team's work makes a real difference</td></tr>
</table>

<h3>Discussion Questions</h3>
<h4>1. Psychological Safety</h4>
<ul>
  <li>Why was psychological safety a stronger predictor of team effectiveness than any other factor — including group IQ and prior experience?</li>
  <li>How can a team leader build psychological safety in a competitive work environment?</li>
</ul>
<h4>2. Team Culture</h4>
<ul>
  <li>Can Project Aristotle's results be replicated in non-Western cultures?</li>
  <li>How do you handle a team member who destroys psychological safety for others?</li>
</ul>
""",
    },
    {
        "filename": "Theranos_Risk_Case_Study.pdf",
        "title": "Theranos: The Collapse of Trust — Lessons in Investment Risk Management",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Theranos Inc.</td></tr>
  <tr><td class="label">Industry</td><td>Health Technology / Medical Testing</td></tr>
  <tr><td class="label">Founded</td><td>2003 — Elizabeth Holmes</td></tr>
  <tr><td class="label">Funding</td><td>Over $700 million from top investors</td></tr>
  <tr><td class="label">Peak Valuation</td><td>$9 billion (2014)</td></tr>
  <tr><td class="label">Collapse</td><td>2018 — the company dissolved, Holmes convicted of fraud</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In 2003, Elizabeth Holmes — a nineteen-year-old who dropped out of Stanford — founded Theranos with a revolutionary goal: a device the size of a postage stamp that could run hundreds of medical tests from a single drop of blood. The idea seemed compelling: goodbye to large needles, goodbye to crowded labs, goodbye to high test prices.</p>
<p>Over 12 years, Theranos raised more than $700 million from Silicon Valley's brightest investors — Larry Ellison, Rupert Murdoch, the Walton family — reaching a $9 billion valuation. Holmes appeared on the covers of Forbes, Fortune, and Inc., and was dubbed "the next Steve Jobs." The board included two former Secretaries of State (Henry Kissinger and George Shultz), a former Secretary of Defense (Jim Mattis), and two healthcare giants.</p>
<p>But the problem was simple and horrifying at once: the technology did not work. Ever. The device called "Edison" could not run the tests Holmes promised. The company ran its tests on conventional Siemens and Abbott machines while claiming to use its revolutionary technology. Test results were manipulated. Errors that nearly harmed real patients were hidden.</p>
<p>In 2015, journalist John Carreyrou of the Wall Street Journal exposed the story. The company collapsed within three years. Holmes was sentenced to 11 years in prison for fraud. Theranos went from a Silicon Valley icon to the most famous case study of governance and auditing failure in investment history.</p>

<h3>Key Lessons</h3>
<p>Theranos offers five central lessons for investors: (1) "Fear of missing out" (FOMO) is not an investment strategy. Top investors rushed in after one another without doing real due diligence. (2) Boards packed with political celebrities do not mean good governance. (3) When a startup refuses to explain how its technology works under the guise of "trade secrets," that is a red flag, not a smart strategy. (4) Infatuation with a charismatic founder (the "founder cult") blinds investors to operational reality. (5) Deep technology — especially in regulated fields like healthcare — needs time and independent verification, not stories.</p>

<h3>Discussion Questions</h3>
<h4>1. Failure of Due Diligence</h4>
<ul>
  <li>How did investors with billions of dollars fail to discover that Theranos's technology did not work?</li>
  <li>What due-diligence steps should have been taken in the health-tech sector?</li>
</ul>
<h4>2. Governance</h4>
<ul>
  <li>How can investors build governance mechanisms that protect them from fraud without stifling innovation?</li>
  <li>What is the role of an independent board in catching wrongdoing early?</li>
</ul>
""",
    },
    {
        "filename": "IKEA_Expansion_Case_Study.pdf",
        "title": "IKEA: International Expansion Strategy — Balancing Global Standardization and Local Adaptation",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>IKEA (Ingvar Kamprad Elmtaryd Agunnaryd)</td></tr>
  <tr><td class="label">Industry</td><td>Furniture and Home Retail</td></tr>
  <tr><td class="label">Founded</td><td>1943 — Ingvar Kamprad, Sweden</td></tr>
  <tr><td class="label">Global Presence</td><td>Over 450 stores in 60 countries</td></tr>
  <tr><td class="label">Revenue</td><td>Over €45 billion annually</td></tr>
</table>

<h3>Executive Summary</h3>
<p>IKEA was founded in 1943 by 17-year-old Ingvar Kamprad in the Swedish countryside. It began selling pens, wallets, and picture frames by mail. Five years later, it added furniture. The idea that disrupted the industry: beautiful, functional furniture that anyone could buy and assemble themselves — "democratic design."</p>
<p>Today, IKEA is the world's largest furniture company, with 450 stores in 60 countries. But its road to globalization was not paved with roses. Entering Japan in 1974 failed miserably — the Japanese did not understand the "assemble it yourself" concept in a culture that prefers full service. IKEA withdrew from Japan and returned 30 years later with a deeper understanding of the local market. Entering China in 1998 revealed another challenge: the Chinese disliked the simple Scandinavian design and wanted more ornate furniture. Prices that were cheap in Europe were expensive in the Chinese market. IKEA had to cut prices by 60% and adapt its products.</p>
<p>In Saudi Arabia, IKEA faced yet another cultural challenge: the catalog had to respect local values while preserving the Swedish identity. IKEA learned a pivotal lesson: "global standardization" of furniture does not mean "the same furniture everywhere." The winning formula: keep 70% globally standardized (identity, quality, supply chain) and customize 30% locally (sizes, colors, materials, marketing).</p>

<h3>International Expansion</h3>
<table class="data">
  <thead><tr><th>Year</th><th>Country</th><th>Result</th><th>Lesson</th></tr></thead>
  <tbody>
    <tr><td>1974</td><td>Japan</td><td>Failure — full withdrawal</td><td>Don't impose your cultural model; understand the local market first</td></tr>
    <tr><td>1998</td><td>China</td><td>Success after repositioning</td><td>Lower prices and customize products locally</td></tr>
    <tr><td>2000+</td><td>Russia</td><td>Success, then exit in 2022</td><td>Geopolitical risks are part of the expansion plan</td></tr>
    <tr><td>1983+</td><td>Saudi Arabia</td><td>Success with cultural adaptation</td><td>Respect cultural sensitivities and preserve identity</td></tr>
    <tr><td>2010+</td><td>India</td><td>Regulatory challenge</td><td>Local laws can delay entry for decades</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<ul>
  <li>Is the 70/30 formula (standardized/local) applicable to every industry?</li>
  <li>How does a company decide when to stick to its global standards and when to adapt locally?</li>
  <li>What are the hidden risks of rapid international expansion that ignores cultural differences?</li>
</ul>
""",
    },
    {
        "filename": "JnJ_Crisis_Case_Study.pdf",
        "title": "Johnson & Johnson — The 1982 Tylenol Crisis: The Gold Standard in Crisis Management",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Johnson &amp; Johnson</td></tr>
  <tr><td class="label">Industry</td><td>Healthcare and Consumer Products</td></tr>
  <tr><td class="label">Event</td><td>The Tylenol Crisis — September/October 1982</td></tr>
  <tr><td class="label">Impact</td><td>7 deaths in Chicago, $100 million loss, 31 million bottles recalled</td></tr>
  <tr><td class="label">Outcome</td><td>96% of market share recovered within one year</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In the autumn of 1982, every company's nightmare happened. Seven people died in Chicago after taking Tylenol capsules — America's best-selling painkiller and a product representing 17% of Johnson &amp; Johnson's profits. The company quickly discovered that an unknown person had laced Tylenol bottles with cyanide on store shelves. The problem was not J&amp;J's manufacturing. But the public would not distinguish.</p>
<p>CEO James Burke faced two choices: the legal (minimal) option advised by the company's lawyers and the FBI — a limited recall from the Chicago area only, and denial of responsibility because the contamination happened after manufacturing. Or the ethical option dictated by "Our Credo" — J&amp;J's founding document written by Robert Wood Johnson in 1943, which clearly states that the company's first responsibility is to "the doctors, nurses, patients, mothers and fathers, and all others who use our products."</p>
<p>Burke chose the ethical option. He recalled 31 million bottles from the market — every Tylenol bottle in America — at a cost of $100 million. It was the largest product recall in American history at the time. He stopped all advertising immediately. He set up a free hotline for the public. He cooperated fully with the media instead of hiding. Most importantly: he invented the "triple-sealed" package — a tamper-resistant cap, plastic wrap, and foil seal — which became the industry standard for pharmaceutical packaging to this day.</p>
<p>The result: within one year, Tylenol recovered 96% of its market share. J&amp;J went from a company accused of causing deaths to the company cited in business schools around the world as the gold standard for crisis management.</p>

<h3>Discussion Questions</h3>
<ul>
  <li>Why does legal advice often conflict with ethical advice in a crisis? How do you choose between them?</li>
  <li>How did the Tylenol crisis turn from an existential threat into a lesson in building lasting trust?</li>
  <li>What makes a "corporate credo" an effective decision-making tool in a crisis — rather than just a public-relations document?</li>
</ul>
""",
    },
    {
        "filename": "Patagonia_Sustainability_Case_Study.pdf",
        "title": "Patagonia: Sustainability as Strategy — 'Earth Is Now Our Only Shareholder'",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Patagonia, Inc.</td></tr>
  <tr><td class="label">Industry</td><td>Outdoor Clothing and Sports Equipment</td></tr>
  <tr><td class="label">Founded</td><td>1973 — Yvon Chouinard</td></tr>
  <tr><td class="label">Headquarters</td><td>Ventura, California</td></tr>
  <tr><td class="label">Revenue</td><td>Over $1 billion annually</td></tr>
</table>

<h3>Executive Summary</h3>
<p>In September 2022, Yvon Chouinard — Patagonia's 83-year-old founder — made one of the boldest family-business decisions in modern history: he gave the company away entirely. Not by selling it. Not by taking it public. But by transferring 100% of the voting stock (worth $3 billion) to a nonprofit trust dedicated to protecting the environment and fighting climate change. All of the company's future profits — about $100 million a year — would go to "saving the planet." The company's new tagline: "Earth is now our only shareholder."</p>
<p>This decision was not a sudden leap but the culmination of fifty years of environmental activism woven into the company's DNA. In 1985, Patagonia began donating 1% of its sales to environmental organizations. In 2011, it launched the famous "Don't Buy This Jacket" Black Friday campaign — a call for conscious consumption instead of overconsumption. In 2017, it sued President Trump to protect national monuments in Utah. All these "commercially insane" stances built a brand with customer loyalty exceeding any traditional clothing company.</p>
<p>The model Patagonia offers challenges capitalism's core assumption: that a company's only purpose is to maximize shareholder profits. Instead, Patagonia proves that profitability and sustainability are not opposed — sustainability is the most effective long-term profitability strategy. Customers pay a price premium because they believe in the mission.</p>

<h3>Discussion Questions</h3>
<ul>
  <li>Is Patagonia's model applicable outside the outdoor-clothing industry? Can a software or consulting company adopt the same philosophy?</li>
  <li>How do you measure the return on investment in sustainability when the "impact" is non-financial?</li>
  <li>Can a public company adopt Patagonia's model, or does quarterly market pressure make that impossible?</li>
</ul>
""",
    },
    {
        "filename": "Quibi_Feasibility_Case_Study.pdf",
        "title": "Quibi: Why Does a Billion-Dollar Project with a Star Team Fail?",
        "html": """
<h2>Key Facts</h2>
<table class="meta">
  <tr><td class="label">Company</td><td>Quibi (Quick Bites)</td></tr>
  <tr><td class="label">Industry</td><td>Short-Form Streaming / Mobile Entertainment</td></tr>
  <tr><td class="label">Founded</td><td>2018 — Jeffrey Katzenberg and Meg Whitman</td></tr>
  <tr><td class="label">Funding</td><td>$1.75 billion from top investors</td></tr>
  <tr><td class="label">Launch</td><td>April 2020</td></tr>
  <tr><td class="label">Shutdown</td><td>December 2020 — after only 8 months</td></tr>
</table>

<h3>Executive Summary</h3>
<p>Jeffrey Katzenberg — former head of Disney Studios and co-founder of DreamWorks. Meg Whitman — former CEO of eBay and HP. Together, they raised $1.75 billion to launch Quibi: a "quick" short-form video platform (10 minutes or less) designed exclusively for mobile viewing during waiting periods — on commutes, in coffee-shop lines, on lunch breaks. The premise: people want high-quality (Hollywood-level) content in a small size that fits their busy lives.</p>
<p>Every major Hollywood studio invested. First-tier stars were signed. Hundreds of hours of original content were produced. Innovative technology for seamless switching between landscape and portrait modes was developed. Everything was ready for a massive launch in April 2020.</p>
<p>Then the pandemic struck. The world stopped. No one was commuting anymore. No one was waiting in coffee-shop lines. Everyone was at home — watching Netflix and Disney+ on big TV screens. Quibi's entire premise collapsed overnight. By December 2020 — only 8 months after launch — the company shut its doors and returned $350 million to investors. Loss: $1.4 billion in 8 months.</p>

<h3>Failure Analysis</h3>
<table class="data">
  <thead><tr><th>Factor</th><th>What Happened</th><th>Lesson</th></tr></thead>
  <tbody>
    <tr><td>Timing</td><td>Launch during a global pandemic that destroyed the core use case</td><td>Plan for uncontrollable external risks (force majeure)</td></tr>
    <tr><td>Product</td><td>Short content was no better than free YouTube</td><td>If the free alternative is "good enough," no one will pay</td></tr>
    <tr><td>Distribution</td><td>No TV app — mobile only</td><td>Don't restrict your product to one platform when alternatives exist</td></tr>
    <tr><td>Pricing</td><td>$5–8 a month for content shorter than free TikTok</td><td>Perceived value matters more than production quality</td></tr>
    <tr><td>Focus</td><td>Obsession with the technology (Turnstyle) instead of the user need</td><td>Don't fall in love with the solution — fall in love with the problem</td></tr>
  </tbody>
</table>

<h3>Discussion Questions</h3>
<ul>
  <li>Was Quibi's failure inevitable because of the pandemic, or were the problems structural and would they have surfaced even without it?</li>
  <li>How could a feasibility study have revealed early that "no one wants to pay for short-form content"?</li>
  <li>What warning signs should investors have seen before pouring in $1.75 billion?</li>
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
