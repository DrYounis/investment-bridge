"use client";

import React, { useState, useMemo } from 'react';
import { logger } from '@/lib/logger';

interface MeetingData {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

// ── Content generators ────────────────────────────────────────
const OBJECTIVES: Record<string, string[]> = {
  Strategy: [
    "Analyze platform business models and network effects",
    "Evaluate competitive positioning in disrupted industries",
    "Identify trust-building mechanisms for marketplace entry"
  ],
  Leadership: [
    "Evaluate organizational culture as competitive advantage",
    "Analyze transformational leadership and employee empowerment",
    "Assess the scalability of founder-driven culture"
  ],
  Finance: [
    "Distinguish between revenue growth and sustainable profitability",
    "Evaluate multiple valuation methodologies for private companies",
    "Identify red flags in startup financials and governance"
  ],
  Marketing: [
    "Deconstruct brand differentiation strategies for commodity products",
    "Analyze viral marketing and audience targeting",
    "Apply visual identity and storytelling to product positioning"
  ],
  Operations: [
    "Analyze supply chain and logistics optimization at scale",
    "Evaluate trade-offs between automation and human labor",
    "Apply lean operations principles to service businesses"
  ],
  Negotiation: [
    "Analyze deal structure: valuation, equity, and terms",
    "Evaluate investor decision-making psychology",
    "Identify founder traits that drive successful negotiation outcomes"
  ],
  Governance: [
    "Evaluate board fiduciary duty and audit committee independence",
    "Analyze regulatory enforcement adequacy and deterrence",
    "Assess stakeholder compensation mechanisms in governance failures"
  ],
};

const FRAMEWORKS: Record<string, { primary: string; secondary: string; tool: string; decision: string; saudi: string }> = {
  Strategy: { primary: "Porter's Five Forces", secondary: "SWOT Analysis", tool: "Business Model Canvas", decision: "Decision Tree Analysis", saudi: "Vision 2030 Alignment Matrix" },
  Leadership: { primary: "Servant Leadership Model", secondary: "Schein Culture Model", tool: "Herzberg Two-Factor Theory", decision: "Stakeholder Impact Assessment", saudi: "Culture-as-Strategy Framework" },
  Finance: { primary: "Unit Economics Analysis", secondary: "DCF Valuation", tool: "Red Flags Framework", decision: "Capital Structure Decision Matrix", saudi: "SME Sustainability Scorecard" },
  Marketing: { primary: "Brand Identity Prism (Kapferer)", secondary: "4Ps Marketing Mix", tool: "Jobs-to-Be-Done Theory", decision: "Brand Positioning Map", saudi: "Saudi Consumer Behavior Model" },
  Operations: { primary: "Lean Operations", secondary: "Six Sigma / DMAIC", tool: "Value Stream Mapping", decision: "Cost-Benefit Analysis Matrix", saudi: "Local Supply Chain Readiness" },
  Negotiation: { primary: "BATNA & ZOPA Framework", secondary: "Anchoring Theory", tool: "Venture Capital Method", decision: "Deal Terms Comparison Matrix", saudi: "Saudi Family Office Negotiation Model" },
  Governance: { primary: "Fiduciary Duty Framework", secondary: "Agency Theory", tool: "IFRS Revenue Recognition", decision: "Penalty Proportionality Assessment", saudi: "CMA Regulatory Compliance Checklist" },
};

const OPENING_QUESTIONS: Record<string, string> = {
  Strategy: `"You're an investor in 2008. Two designers pitch 'renting air mattresses in their living room to strangers.' Hotels are a trillion-dollar industry with established brands. The founders have no hospitality experience. They funded the company by selling cereal boxes. Would you invest $20,000? Why or why not?"`,
  Leadership: `"Tony Hsieh offers every new employee $2,000 to quit after training. Only 2-3% take the money. Is this a brilliant filter for cultural fit — or a manipulative tactic that preys on financially constrained workers? If you implemented this at YOUR company in Saudi Arabia, what percentage of your employees would leave?"`,
  Finance: `"You're a SoftBank investment committee member in 2018. Masayoshi Son wants to invest $4.4 billion at a $20 billion valuation in a company that loses money on every location. The pitch: 'It's not a real estate company — it's a community platform.' Do you approve the investment? What questions do you ask first?"`,
  Marketing: `"Water falls from the sky. It's free from every tap. The market is dominated by global giants with billions in ad spend. How do you build a $700M brand selling the same product — but in a tallboy can with a skull on it? Is Liquid Death a marketing genius play or a temporary gimmick?"`,
  Operations: `"In 2005, Amazon launches Prime: free 2-day shipping for $79/year. Analysts predict it will cost the company billions. Wall Street calls it reckless. Bezos calls it 'the future of retail.' You're on the board. Do you approve this bet — knowing it could bankrupt the company if it fails?"`,
  Negotiation: `"You walk into the Shark Tank. You've got 90 seconds to pitch a product generating $50K/month in profit. You need $500K for 10% equity. Two Sharks show interest, but their counter is $500K for 35%. Your last investor valued you at $3M. What's your BATNA? Do you counter, accept, or walk?"`,
  Governance: `"You're a board member at Saudi German Health in 2019. The CFO reports SAR 358M in revenues — but admits in the board meeting that collection is uncertain. The company needs to hit earnings targets. Voting is 8-3 against recognizing the revenue. But the chairman (a majority family shareholder) insists. What do you do?"`,
};

// ── Component ──────────────────────────────────────────────────
export default function PreMeetingPrep({ meeting }: { meeting: MeetingData }) {
  const [checklist, setChecklist] = useState({
    pdf: false,
    confirmed: false,
    assignments: false,
    questions: false,
    saudiExamples: false,
  });
  const [openingQuestion, setOpeningQuestion] = useState(OPENING_QUESTIONS[meeting.topic] || '');
  const [participantCount, setParticipantCount] = useState(8);

  const objectives = useMemo(() => {
    const base = OBJECTIVES[meeting.topic] || OBJECTIVES.Strategy;
    return [...base, "Apply framework to Saudi/Hail context", "Make evidence-based business recommendations"];
  }, [meeting.topic]);

  const frameworks = useMemo(() => FRAMEWORKS[meeting.topic] || FRAMEWORKS.Strategy, [meeting.topic]);

  const toggle = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const session = {
      meeting: meeting.number,
      checklist,
      objectives,
      frameworks,
      openingQuestion,
      participantCount,
      savedAt: new Date().toISOString(),
    };
    logger.info('✅ Session setup saved:', session);
    alert('✅ Session setup saved! Check console for details.');
  };

  const completed = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Checklist */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
          ✅ Pre-Meeting Checklist
        </h3>
        <div className="space-y-3">
          {[
            { key: 'pdf', label: 'PDF case study distributed (48hrs before)' },
            { key: 'confirmed', label: 'Participants confirmed receipt' },
            { key: 'assignments', label: 'Pre-class assignments collected' },
            { key: 'questions', label: 'Discussion questions prepared' },
            { key: 'saudiExamples', label: 'Saudi/Hail examples ready' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist[key as keyof typeof checklist]}
                onChange={() => toggle(key as keyof typeof checklist)}
                className="w-4 h-4 rounded accent-gold border-white/20 bg-white/5"
              />
              <span className={`text-sm ${checklist[key as keyof typeof checklist] ? 'text-slate-200 line-through decoration-gold/40' : 'text-slate-400'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5">
          <span className="text-xs text-slate-500">
            {completed}/5 complete {completed === 5 && '— Ready!'}
          </span>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
          🎯 Today's Learning Objectives
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          By end of session, participants will be able to:
        </p>
        <ol className="space-y-2 list-decimal list-inside">
          {objectives.map((obj, i) => (
            <li key={i} className="text-sm text-slate-300 leading-relaxed">{obj}</li>
          ))}
        </ol>
      </div>

      {/* MBA Frameworks */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
          📚 MBA Frameworks to Cover
        </h3>
        <div className="space-y-3">
          {[
            ['Primary Framework', frameworks.primary],
            ['Secondary Framework', frameworks.secondary],
            ['Application Tool', frameworks.tool],
            ['Decision Model', frameworks.decision],
            ['Saudi Context Tool', frameworks.saudi],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-xs text-slate-400">{label}</span>
              <span className="text-sm text-gold font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Opening Question */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
          💡 Provocative Opening Question
        </h3>
        <div className="bg-gold/5 border border-gold/10 rounded-xl p-4 mb-3">
          <p className="text-sm text-slate-300 leading-relaxed italic">
            {openingQuestion}
          </p>
        </div>
        <textarea
          value={openingQuestion}
          onChange={e => setOpeningQuestion(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 resize-none focus:outline-none focus:border-gold/50"
          placeholder="Edit the opening question..."
        />
      </div>

      {/* Session Setup + Save Button */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Setup Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
            📋 Session Setup Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">Meeting</span>
              <span className="text-sm text-white">#{meeting.number} — {meeting.company}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">Date</span>
              <span className="text-sm text-white">{meeting.date}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">MBA Topic</span>
              <span className="text-sm text-gold font-medium">{meeting.topic}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-xs text-slate-400">Duration</span>
              <span className="text-sm text-white">90 minutes</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-xs text-slate-400">Participants</span>
              <input
                type="number"
                value={participantCount}
                onChange={e => setParticipantCount(Number(e.target.value))}
                min={3}
                max={20}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white w-16 text-center focus:outline-none focus:border-gold/50"
              />
            </div>
          </div>
        </div>

        {/* Hail Context + Save */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col">
          <h3 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
            🇸🇦 Hail Local Application
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-1">
            {meeting.hailApp}
          </p>
          <button
            onClick={handleSave}
            className="w-full bg-gold/20 hover:bg-gold/30 border border-gold/30 rounded-xl py-3 text-gold font-bold text-sm transition-colors"
          >
            💾 Save Session Setup
          </button>
        </div>
      </div>
    </div>
  );
}
