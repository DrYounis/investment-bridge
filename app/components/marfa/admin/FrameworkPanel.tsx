"use client";

import React, { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface MeetingData {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

type FrameworkContent = {
  explanation: string;
  globalApp: string[];
  hailApp: string[];
};

// ── Framework Data ─────────────────────────────────────────────
const FRAMEWORKS_BY_TOPIC: Record<string, string[]> = {
  Strategy: ["Porter's Five Forces", "Blue Ocean Strategy", "Business Model Canvas", "SWOT Analysis", "Value Chain Analysis"],
  Leadership: ["Servant Leadership", "Schein Culture Model", "Herzberg Two-Factor", "Transformational Leadership", "Culture-as-Strategy"],
  Finance: ["Unit Economics", "DCF Valuation", "Agency Theory", "Red Flags Framework", "Capital Structure"],
  Marketing: ["Brand Identity Prism (Kapferer)", "4Ps Marketing Mix", "Jobs-to-Be-Done", "Differentiation Strategy", "Cultural Branding"],
  Operations: ["Lean Operations", "Six Sigma/DMAIC", "Supply Chain Resilience", "JIT vs JIC", "Triple Bottom Line"],
  Negotiation: ["BATNA & ZOPA", "Anchoring", "Venture Capital Method", "Term Sheet Analysis", "Cross-Cultural Negotiation"],
  Governance: ["Fiduciary Duty", "Agency Theory", "IFRS Revenue Recognition", "CMA Regulatory Framework", "Stakeholder Theory"],
};

const FRAMEWORK_CONTENT: Record<string, Record<string, FrameworkContent>> = {
  Strategy: {
    "Porter's Five Forces": {
      explanation: "Framework analyzing competitive intensity and profitability of an industry through five forces: threat of new entrants, bargaining power of suppliers/buyers, threat of substitutes, and competitive rivalry. For Airbnb, it reveals how platform businesses disrupt traditional industries by reshaping multiple forces simultaneously.",
      globalApp: ["New Entrants: LOW — Airbnb's network effects (7M+ listings) create massive barriers", "Supplier Power: LOW — hosts are fragmented individuals, not hotel chains", "Buyer Power: MODERATE — travelers have many options but Airbnb offers unique inventory", "Substitutes: HIGH — hotels, hostels, vacation rentals all compete", "Rivalry: HIGH — Booking.com, Vrbo, local platforms all fighting for share"],
      hailApp: ["New Entrants in Hail: Currently NONEXISTENT — first-mover opportunity but low barriers", "Supplier Power in Hail: Homeowners near Aja Mountain and Nafud Desert — seasonal supply", "Buyer Power: Tourists visiting winter festivals have limited alternatives — pricing power", "Substitutes: Traditional hotels in Hail city center, camping, family stays", "Rivalry: No existing platform — build before Booking.com enters"],
    },
    "Blue Ocean Strategy": {
      explanation: "Creating uncontested market space rather than competing in existing industries. Airbnb didn't compete with hotels — it created an entirely new category of 'home-sharing' that appealed to travelers who wanted authentic experiences.",
      globalApp: ["Eliminate: check-in desks, standardized rooms, corporate feel", "Reduce: infrastructure costs (no hotel buildings to own)", "Raise: authenticity, local experiences, unique stays", "Create: host-guest relationships, neighborhood discovery"],
      hailApp: ["Create a 'Hail Authentic Stays' category that hotels cannot replicate", "Leverage Aja Mountain scenery and Nafud Desert as unique backdrops", "Build before international platforms notice Hail's tourism potential", "Position as 'Saudi cultural immersion' not just lodging"],
    },
    "Business Model Canvas": {
      explanation: "Strategic management template for developing new or documenting existing business models. Nine building blocks: value propositions, customer segments, channels, customer relationships, revenue streams, key resources, key activities, key partners, cost structure.",
      globalApp: ["Platform model: hosts provide supply, guests provide demand, Airbnb provides trust", "Revenue: 3% host fee + ~14% guest service fee — asset-light, high margin", "Key resource: brand trust and community reviews network"],
      hailApp: ["Value prop: 'Experience Hail like a local — stay in a traditional Najdi home'", "Customer segments: domestic Saudi travelers, GCC tourists, winter festival attendees", "Revenue: competitive with hotels but lower overhead for hosts", "Key partners: SCTH (tourism authority), local tour operators, winter festival organizers"],
    },
    "SWOT Analysis": { explanation: "Classic strategic planning tool analyzing Strengths, Weaknesses, Opportunities, Threats.", globalApp: ["Strengths: global brand, network effects, asset-light model", "Weaknesses: regulatory battles, trust incidents, host quality variability"], hailApp: ["Strengths: first-mover in Hail, local cultural knowledge", "Weaknesses: small market, seasonal demand, limited infrastructure", "Opportunities: Vision 2030 tourism goals, winter festivals, Aja Mountain UNESCO potential", "Threats: Booking.com expansion, cultural resistance to homestays, regulatory uncertainty"] },
    "Value Chain Analysis": { explanation: "Analyzes specific activities through which firms create value and competitive advantage.", globalApp: ["Inbound logistics: host onboarding, listing verification, photography", "Operations: booking platform, payment processing, messaging", "Outbound logistics: host guarantee, insurance, customer support"], hailApp: ["Localized photography: professional shoots highlighting Hail's natural beauty", "Cultural training: host hospitality standards aligned with Saudi norms", "Payment: integrate Mada, STC Pay for local market"] },
  },
  Leadership: {
    "Servant Leadership": {
      explanation: "Leadership philosophy where the leader's primary goal is to serve others. Tony Hsieh embodied this at Zappos — his focus was on empowering employees to serve customers, not maximizing shareholder returns.",
      globalApp: ["Leader as enabler, not commander — Hsieh trusted call center staff to make 10-hour calls without scripts", "Success measured by employee and customer happiness, not just profit", "The $2,000 Offer: investing in cultural alignment by paying misfits to leave"],
      hailApp: ["Saudi hierarchical business culture: how to shift from 'boss gives orders' to 'leader serves team'", "Empowering front-line staff in Hail cafes to make customer decisions without manager approval", "Islamic principles of 'khidma' (service) as foundation for servant leadership in Saudi context"],
    },
    "Schein Culture Model": {
      explanation: "Three levels of organizational culture: Artifacts (visible), Espoused Values (stated beliefs), and Basic Underlying Assumptions (unconscious). Zappos' artifacts (casual dress, cubicle decorations) reflect deeper values.",
      globalApp: ["Artifacts: Zappos office tours, Culture Book, parade costumes", "Espoused Values: 10 core values including 'Deliver WOW Through Service'", "Basic Assumptions: employees are intrinsically motivated, customers deserve extraordinary treatment"],
      hailApp: ["Artifacts for Hail businesses: traditional Saudi hospitality rituals, coffee ceremony for customers", "Espoused Values: 'generosity' (karam), 'excellence' (ihsan), 'honesty' (sidq)", "Aligning Saudi cultural values with business differentiation — authenticity sells"],
    },
    "Herzberg Two-Factor": { explanation: "Hygiene factors (salary, conditions) prevent dissatisfaction; Motivators (recognition, growth) drive satisfaction.", globalApp: ["Hygiene: competitive pay, good benefits, safe workplace", "Motivators: autonomy to help customers, recognition for WOW stories, career growth"], hailApp: ["Saudi context: salary is hygiene, but 'meaningful work aligned with Vision 2030' is motivator", "Recognition in collectivist culture: public acknowledgment, family inclusion in celebrations"] },
    "Transformational Leadership": { explanation: "Leadership that creates positive change by inspiring followers. Four I's: Idealized Influence, Inspirational Motivation, Intellectual Stimulation, Individualized Consideration.", globalApp: ["Hsieh inspired through personal example and storytelling", "Intellectual stimulation: 'What if customer service was THE brand?' stirred creativity", "Individualized consideration: the $2,000 Offer treats each person as unique"], hailApp: ["Saudi transformational leaders: how to inspire youth to work in service industries", "Vision 2030 as transformational narrative: leaders can connect business goals to national transformation"] },
    "Culture-as-Strategy": { explanation: "Theory that organizational culture can be a sustainable competitive advantage when it's valuable, rare, and difficult to imitate.", globalApp: ["Competitors studied Zappos for years but couldn't replicate the culture", "Culture is the ultimate moat — more durable than technology or pricing"], hailApp: ["Build a Hail hospitality culture that no competitor can copy", "Local knowledge + cultural authenticity = sustainable advantage over international chains"] },
  },
  Finance: {
    "Unit Economics": {
      explanation: "Analysis of revenue and cost per unit to determine fundamental business viability. WeWork's failure was a unit economics problem: each location lost money, and more locations meant more losses.",
      globalApp: ["Revenue per desk vs. cost per desk: WeWork's gap was massive", "Contribution margin: after variable costs, each location was deeply negative", "Scale economies: WeWork promised unit costs would decline with scale — they didn't"],
      hailApp: ["Calculate unit economics for a Hail bakery: revenue per item - cost of ingredients, labor, rent", "When is aggressive expansion justified vs. when does it mask broken unit economics?", "Saudi startups: many project 'eventual profitability' without current unit economics. Red flag?"],
    },
    "DCF Valuation": {
      explanation: "Discounted Cash Flow — values a company based on the present value of its expected future cash flows. WeWork's DCF would have revealed the truth: future cash flows were negative.",
      globalApp: ["WeWork $47B valuation required aggressive assumptions about future profitability", "DCF exposes the gap between narrative and numbers", "Terminal value: WeWork assumed perpetual growth — impossible for a real estate company"],
      hailApp: ["How Saudi family offices should value startups: DCF vs. comparables vs. narrative", "The 'Vision 2030 premium': should Saudi companies get higher valuations due to growth tailwinds?", "Practical exercise: value a growing Hail business using simple DCF"],
    },
    "Agency Theory": { explanation: "Conflict of interest between principals (shareholders) and agents (management). WeWork is a textbook case: Neumann's interests diverged drastically from shareholders'.", globalApp: ["Neumann controlled majority voting while owning minority equity", "Self-dealing: leasing personally-owned properties to WeWork", "$1.7B exit package while shareholders lost everything"], hailApp: ["Saudi family businesses: when family members are both owners and managers", "Governance mechanisms: independent directors, audit committees, shareholder rights", "How to align founder incentives with investor interests"] },
    "Red Flags Framework": { explanation: "Systematic checklist for identifying warning signs in investment opportunities.", globalApp: ["Creative accounting: 'Community-Adjusted EBITDA' excluded real costs", "Related-party transactions: Neumann's properties leased to WeWork", "Super-voting shares: founder control without accountability", "Excessive founder compensation and perks"], hailApp: ["Saudi-specific red flags: unclear regulatory status, reliance on wasta, inflated market claims", "Due diligence checklist for Saudi angel investors", "How to differentiate 'bold vision' from 'delusional hype'"] },
    "Capital Structure": { explanation: "Mix of debt and equity financing. WeWork's lease liabilities ($47B) were off-balance-sheet debt that made the company far more leveraged than it appeared.", globalApp: ["Operating leases as hidden debt", "Fixed long-term obligations vs. variable short-term revenue", "The liquidity crunch when COVID emptied offices"], hailApp: ["How Saudi businesses should structure financing: debt (SARIE) vs. equity vs. retained earnings", "The lease vs. buy decision for small businesses in Hail", "Understanding financial risk in a high-interest-rate environment"] },
  },
  Marketing: {
    "Brand Identity Prism (Kapferer)": {
      explanation: "Six facets of brand identity: Physique, Personality, Culture, Relationship, Reflection, Self-image. Liquid Death excels at all six — the tallboy can (physique), punk rock attitude (personality), counterculture ethos (culture).",
      globalApp: ["Physique: tallboy can, gothic font, skull logo — unmistakable", "Personality: irreverent, rebellious, funny — not 'corporate wellness'", "Culture: punk rock, environmentalism, anti-plastic message"],
      hailApp: ["Apply prism to Hail dates: Physique = premium packaging, Personality = authentic/traditional", "Hail honey brand: Culture = purity of Nafud Desert, Reflection = health-conscious consumer", "Local coffee roaster: Personality = sophisticated/artisanal, Self-image = connoisseur"],
    },
    "4Ps Marketing Mix": {
      explanation: "Product, Price, Place, Promotion. Liquid Death reimagined all four: Product = water in a can, Price = premium ($2), Place = Whole Foods + 7-Eleven + bars, Promotion = viral TikTok + stunts.",
      globalApp: ["Product: 'Murder Your Thirst' — water positioned as edgy lifestyle product", "Price: premium pricing signals quality despite commodity input", "Place: sold where energy drinks sell, not just water aisle", "Promotion: zero traditional ads, 100% viral content and stunts"],
      hailApp: ["Product: what's the 'Liquid Death' of Hail? Camel milk? Desert honey? Truffles?", "Price: premium positioning for local products — can dates command 3x supermarket price?", "Place: tourism channels (airports, hotels, festivals) as distribution for premium local goods", "Promotion: social media storytelling — Instagram reels from Aja Mountain for honey brand"],
    },
    "Jobs-to-Be-Done": { explanation: "Theory that customers 'hire' products to do specific jobs. Liquid Death is hired for: hydration, social signaling, identity expression.", globalApp: ["Functional job: quench thirst", "Emotional job: feel rebellious/cool while drinking water", "Social job: signal identity — 'I'm not boring, I drink Liquid Death'"], hailApp: ["What job do tourists 'hire' Hail products for? Souvenirs, gifts, memories, authenticity", "Local coffee: hired for caffeine + social connection + workplace status", "Application: define the job before designing the product"] },
    "Differentiation Strategy": { explanation: "Creating unique value that customers perceive as distinct and worth paying premium for.", globalApp: ["Water is the ultimate commodity — Liquid Death proved anything can be differentiated", "Differentiation levers: packaging, story, attitude, distribution, community"], hailApp: ["Differentiating Hail bakery: not just 'good bread' but 'traditional Najdi recipes using 300-year-old techniques'", "Saudi coffee: differentiation through roasting method, bean origin, serving ritual", "The danger: differentiation must be authentic — Hail businesses must find genuine uniqueness"] },
    "Cultural Branding": { explanation: "Building brands that tap into cultural tensions and ideologies. Liquid Death tapped into Gen Z distrust of corporate wellness culture.", globalApp: ["Anti-establishment positioning resonates with young consumers", "Environmental mission (aluminum > plastic) wrapped in rebellion", "Community: fans share photos, create content, become evangelists"], hailApp: ["Saudi cultural tensions to tap: tradition vs. modernity, local vs. global, authenticity vs. commercialization", "How Hail brands can connect to Saudi national pride and Vision 2030 optimism", "Cultural branding must be genuine — young Saudis detect inauthenticity instantly"] },
  },
  Operations: {
    "Lean Operations": {
      explanation: "Systematic method for waste minimization without sacrificing productivity. Amazon's fulfillment centers are lean laboratories: every motion, every second, every inch of shelf space is optimized.",
      globalApp: ["Eliminate waste: Amazon's warehouse algorithms minimize worker walking distance", "Continuous improvement: Kiva robots replaced human pickers — then robots were improved", "Pull system: inventory is stocked based on predictive demand, not forecasts"],
      hailApp: ["Apply lean to Hail bakery: measure flour waste, optimize baking schedules, reduce wait times", "Restaurant kitchen: layout optimization — how much do chefs walk per shift?", "Small business lean: start with '5S' (Sort, Set in order, Shine, Standardize, Sustain)"],
    },
    "Six Sigma/DMAIC": {
      explanation: "Data-driven methodology for eliminating defects. Define, Measure, Analyze, Improve, Control. Amazon uses Six Sigma to achieve 99.99% order accuracy.",
      globalApp: ["Define: what does 'defect' mean? Late delivery, wrong item, damaged goods", "Measure: Amazon tracks every metric — delivery time, return rate, error rate", "Analyze: root cause analysis when metrics deviate", "Improve & Control: automated systems adjust processes in real-time"],
      hailApp: ["Define defects for Hail restaurant: wrong order, late delivery, cold food, missing items", "Measure: track defect rates for one week — what's the baseline?", "Small-scale Six Sigma: even 10 data points can reveal improvement opportunities"],
    },
    "Supply Chain Resilience": { explanation: "Ability to prepare for, adapt to, and recover from disruptions.", globalApp: ["Amazon's multi-node network: if one fulfillment center fails, others absorb demand", "Diversified carrier mix: UPS, FedEx, USPS, Amazon Logistics, Flex drivers", "Buffer inventory: strategic stockpiling of high-demand items"], hailApp: ["Hail restaurant supply chain: what if the main supplier of meat/vegetables fails?", "Multiple supplier strategy for food businesses — don't depend on one source", "Seasonal resilience: winter festival demand spikes — how to scale operations temporarily?"] },
    "JIT vs JIC": { explanation: "Just-in-Time minimizes inventory; Just-in-Case holds buffer stock.", globalApp: ["Amazon: hybrid — JIT for predictable items, JIC for volatile/high-demand items", "Trade-off: JIT saves cost but risks stockouts; JIC provides security but ties capital"], hailApp: ["Hail grocery/bakery: fresh items use JIT (bake daily), dry goods use JIC (buffer for demand spikes)", "Capital trade-off for small businesses: how much cash should be tied up in inventory?"] },
    "Triple Bottom Line": { explanation: "Business framework measuring success across three dimensions: People, Planet, Profit.", globalApp: ["Amazon's challenge: Profit (excellent) vs. People (worker conditions criticized) vs. Planet (carbon footprint of 1-day shipping)", "Balancing all three is the modern operations challenge"], hailApp: ["Hail business triple bottom line: Profit (sustainability), People (fair wages, community impact), Planet (food waste reduction, local sourcing)", "Vision 2030 sustainability goals: how small businesses contribute to national environmental targets"] },
  },
  Negotiation: {
    "BATNA & ZOPA": {
      explanation: "Best Alternative to Negotiated Agreement (what you do if no deal) and Zone of Possible Agreement (overlap between buyer and seller ranges). The Sharks' power comes from knowing their BATNA (they see 100+ deals/year).",
      globalApp: ["Entrepreneur's BATNA: walk away with nothing, keep 100% of a struggling business", "Shark's BATNA: invest in any of 100+ other pitches today", "ZOPA: where the entrepreneur's minimum acceptable valuation meets the Shark's maximum"],
      hailApp: ["Saudi entrepreneur BATNA: self-fund, seek bank loan (SIDF), approach another family office", "Saudi investor BATNA: real estate (stable), public equities (liquid), other startups", "The ZOPA in Saudi is wider — fewer VC options means entrepreneurs may accept lower valuations"],
    },
    "Anchoring": {
      explanation: "Cognitive bias where the first number offered heavily influences the negotiation. The first valuation mentioned becomes the reference point for all subsequent discussion.",
      globalApp: ["Shark Tank: entrepreneurs who state high valuations first anchor high (but risk looking unrealistic)", "Sharks counter-anchor: 'I'll give you $50K for 50%' — resetting the frame", "The power of first offer: research shows it explains 50%+ of final outcome variance"],
      hailApp: ["Saudi negotiation: who should make the first offer? Cultural norms may favor the senior party", "Anchoring in family office meetings: be prepared for low anchors — know your walk-away", "Practice: role-play a Hail entrepreneur pitching to a conservative family office"],
    },
    "Venture Capital Method": { explanation: "Valuation approach: project exit value, discount to present, divide by shares. Used by Sharks to justify their offers.", globalApp: ["Project exit in 5-7 years at $X, apply 30-40% discount rate, calculate current value", "Sharks invest at low valuations because they assume high failure risk", "The math: if 9/10 startups fail, the 1 winner must return 10x"], hailApp: ["Saudi startup exit options: Tadawul Nomu (parallel market), acquisition by larger Saudi company, regional expansion", "Discount rates in Saudi: higher than US/Europe to account for smaller exit market", "How Hail entrepreneurs should model their valuation for local investors"] },
    "Term Sheet Analysis": { explanation: "Understanding key deal terms beyond valuation: liquidation preference, board seats, anti-dilution, drag-along rights.", globalApp: ["Shark Tank simplified: valuation + equity %, but real VC adds complex terms", "Liquidation preference: investors get money back first in sale/bankruptcy", "Board control: who makes decisions after the deal?"], hailApp: ["Saudi term sheets: often simpler than US but must specify dispute resolution (Saudi courts vs. arbitration)", "Family office terms: may include operational involvement (not just passive investment)", "Key clauses Hail entrepreneurs must understand before signing"] },
    "Cross-Cultural Negotiation": { explanation: "How cultural norms affect negotiation styles, expectations, and outcomes.", globalApp: ["US/Shark Tank style: fast, direct, numbers-focused, confrontational", "Saudi style: relationship-first, trust-building, may take multiple meetings", "Power distance: Saudi culture respects hierarchy — who leads the negotiation matters"], hailApp: ["Saudi negotiation cadence: expect tea/coffee, relationship talk before business", "Family offices: decisions may involve multiple family members — identify the real decision-maker", "The role of wasta (connections): introduction by trusted intermediary changes the negotiation dynamic"] },
  },
  Governance: {
    "Fiduciary Duty": {
      explanation: "Legal obligation of board members to act in the best interests of shareholders. Saudi German Health's board breached both duty of care (knowing revenues were uncollectible) and duty of loyalty (prioritizing stock price over truth).",
      globalApp: ["Duty of Care: board must be informed, diligent, and competent", "Duty of Loyalty: must prioritize shareholder interests over personal/family interests", "SGH breach: KNEW revenues uncollectible yet approved recognition — clear violation"],
      hailApp: ["Saudi board composition: mandate independent directors for companies listed on Tadawul", "Family business governance: how to separate family interests from company interests", "Governance education: many Saudi board members need formal fiduciary duty training"],
    },
    "Agency Theory": { explanation: "Conflict between owners and managers. SGH is a case of extreme agency failure.", globalApp: ["Managers (board) acted against owners (shareholders) by hiding financial truth", "Family control (4 Batterjees) exacerbated agency issues", "Solution: independent directors, audit committees, external auditors"], hailApp: ["Apply to Saudi family companies: when family members dominate board, who represents minority shareholders?", "Agency solutions for Hail businesses: even SMEs need basic governance as they grow", "CMA requirements: listed companies must have independent audit committees"] },
    "IFRS Revenue Recognition": { explanation: "IFRS 15 requires revenue to be recognized only when collectibility is probable. SGH violated this by recognizing SAR 358M despite knowing collection was unlikely.", globalApp: ["5-step model: identify contract, performance obligations, transaction price, allocate, recognize", "Key criterion: collectibility must be PROBABLE — SGH knew otherwise", "Revenue recognition is the most common source of financial fraud globally"], hailApp: ["Saudi businesses adopting IFRS: understanding revenue recognition prevents accidental fraud", "Practical exercise: when should a Hail business recognize revenue from a government contract?", "The line between 'aggressive accounting' and 'fraud' — where is it?"] },
    "CMA Regulatory Framework": { explanation: "Saudi Capital Market Authority enforcement powers under Article 49(a) — false/misleading impression about securities.", globalApp: ["CMA can impose fines up to SAR 5M and refer for criminal prosecution", "Article 7 Market Conduct Regulations prohibit fraud or deceit in securities transactions", "ACRSD (Appeal Committee) adjudicates disputes with final authority"], hailApp: ["How CMA enforcement compares to SEC (US), FCA (UK), SEBI (India) — Saudi penalties may be lighter", "Impact on Saudi market credibility: do international investors trust CMA enforcement?", "Reform proposals: should CMA penalties increase to match fraud scale?"] },
    "Stakeholder Theory": { explanation: "Companies have responsibilities beyond shareholders — to employees, customers, community, environment.", globalApp: ["SGH stakeholders harmed: shareholders (44% stock decline), employees (reputational damage), patients (trust in hospital), healthcare sector (guilt by association)", "Balancing competing stakeholder interests: can a company serve all stakeholders equally?"], hailApp: ["Hail business stakeholders: owners, employees, customers, local community, government", "Vision 2030: businesses as partners in national transformation — stakeholder responsibility is explicit", "Practical: how should a Hail business respond when shareholder returns conflict with community needs?"] },
  },
};

// ── Meetings Data ───────────────────────────────────────────────
const ALL_MEETINGS = [
  { number: 1, topic: "Strategy", company: "Airbnb" },
  { number: 2, topic: "Leadership", company: "Zappos" },
  { number: 3, topic: "Finance", company: "WeWork" },
  { number: 4, topic: "Marketing", company: "Liquid Death" },
  { number: 5, topic: "Operations", company: "Amazon" },
  { number: 6, topic: "Negotiation", company: "Shark Tank" },
  { number: 7, topic: "Governance", company: "Saudi German Health" },
];

// ── Component ──────────────────────────────────────────────────
export default function FrameworkPanel({ meeting }: { meeting: MeetingData }) {
  const frameworks = FRAMEWORKS_BY_TOPIC[meeting.topic] || [];
  const [selectedFramework, setSelectedFramework] = useState(frameworks[0] || "");
  const [discussionPrompt, setDiscussionPrompt] = useState("");

  const content: FrameworkContent | undefined = FRAMEWORK_CONTENT[meeting.topic]?.[selectedFramework];

  const todayLabel = `Meeting ${meeting.number}: ${meeting.company} (${meeting.topic})`;

  return (
    <div className="space-y-6">
      {/* Framework Selector */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📚 Select MBA Framework</h3>
        <select
          value={selectedFramework}
          onChange={e => setSelectedFramework(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50"
        >
          {frameworks.map(f => (
            <option key={f} value={f} className="bg-[#0D1321]">{f}</option>
          ))}
        </select>
        <p className="text-slate-500 text-xs mt-2">Meeting {meeting.number}: {meeting.topic} — {meeting.company}</p>
      </div>

      {content && (
        <>
          {/* Quick Explanation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-3">💡 What Is {selectedFramework}?</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{content.explanation}</p>
          </div>

          {/* Guided Application — 2 Columns */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wide mb-3">🌍 Apply to {meeting.company} (Global)</h3>
              <ul className="space-y-2">
                {content.globalApp.map((point, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-blue-400 mt-1">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gold/5 backdrop-blur-sm rounded-2xl p-6 border border-gold/10">
              <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-3">🇸🇦 Apply to Hail Market (Local)</h3>
              <ul className="space-y-2">
                {content.hailApp.map((point, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-gold mt-1">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Framework Mastery Tracker */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📊 Framework Mastery Tracker</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left border-b border-white/5">
                <th className="pb-3 pr-4">Meeting</th>
                <th className="pb-3 pr-4">Topic</th>
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALL_MEETINGS.map(m => (
                <tr key={m.number} className={`border-b border-white/5 ${m.number === meeting.number ? 'bg-gold/10' : ''}`}>
                  <td className="py-2 pr-4 text-white font-medium">#{m.number}</td>
                  <td className="py-2 pr-4 text-slate-400">{m.topic}</td>
                  <td className="py-2 pr-4 text-slate-300">{m.company}</td>
                  <td className="py-2">
                    {m.number < meeting.number ? (
                      <span className="text-green-400 text-xs">✅ Completed</span>
                    ) : m.number === meeting.number ? (
                      <span className="text-gold text-xs font-bold">🔄 In Progress</span>
                    ) : (
                      <span className="text-slate-600 text-xs">⏳ Upcoming</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saudi/Hail Translation */}
      <div className="bg-gold/5 backdrop-blur-sm rounded-2xl p-6 border border-gold/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-3">🇸🇦 Saudi / Hail Context</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">{meeting.hailApp}</p>
        <label className="text-slate-400 text-xs block mb-2">Discussion Prompt — How to introduce local context:</label>
        <textarea
          value={discussionPrompt}
          onChange={e => setDiscussionPrompt(e.target.value)}
          placeholder={`Draft how you'll introduce the Hail application for the ${selectedFramework} framework...`}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 resize-none"
        />
      </div>

      {!content && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/10">
          <p className="text-slate-500">Select a framework above to see its explanation and application.</p>
        </div>
      )}
    </div>
  );
}
