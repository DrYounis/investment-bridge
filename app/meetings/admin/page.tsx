"use client";

import { useState, useMemo } from 'react';
import PreMeetingPrep from '@/app/components/marfa/admin/PreMeetingPrep';
import LiveDiscussion from '@/app/components/marfa/admin/LiveDiscussion';
import FrameworkPanel from '@/app/components/marfa/admin/FrameworkPanel';
import DecisionVoting from '@/app/components/marfa/admin/DecisionVoting';
import PostSession from '@/app/components/marfa/admin/PostSession';

// ── Types ──────────────────────────────────────────────────────
export interface MeetingData {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

export interface Participant {
  id: string;
  name: string;
  contributions: number;
  lastSpoke: number | null; // minutes ago
  modules: string[];
}

export interface SessionState {
  meetingNumber: number;
  phase: string;
  phaseStartTime: number;
  elapsed: number;
  participants: Participant[];
  notes: string;
  votes: Record<string, { yes: number; no: number; needMore: number }>;
  frameworksCovered: string[];
  takeaways: string[];
  modulesAssigned: Record<string, string[]>;
}

// ── Constants ──────────────────────────────────────────────────
export const MEETINGS: MeetingData[] = [
  { number: 1, date: 'June 19, 2026', topic: 'Strategy', company: 'Airbnb', challenge: 'How to convince investors that home-sharing can compete with hotels?', hailApp: 'Tourism in Hail — Aja Mountain homestays, Nafud Desert tent rentals, winter festival lodging' },
  { number: 2, date: 'June 26, 2026', topic: 'Leadership', company: 'Zappos', challenge: 'Can you build an organizational culture where employees sacrifice for customers?', hailApp: 'Building service culture in Hail coffee shops and restaurants' },
  { number: 3, date: 'July 3, 2026', topic: 'Finance', company: 'WeWork', challenge: 'Understanding the difference between growth and profitability', hailApp: 'Evaluating startup pitches and sustainable business models for Hail entrepreneurs' },
  { number: 4, date: 'July 10, 2026', topic: 'Marketing', company: 'Liquid Death', challenge: 'How to sell ordinary water with genius branding?', hailApp: 'Differentiating Hail local products: dates, honey, coffee, bakery items' },
  { number: 5, date: 'July 17, 2026', topic: 'Operations', company: 'Amazon', challenge: 'How to manage operations to minimize waste?', hailApp: 'Food delivery logistics and supply chain for Hail restaurants' },
  { number: 6, date: 'July 24, 2026', topic: 'Negotiation', company: 'Shark Tank', challenge: 'Why do investors reject genius ideas and accept simple ones?', hailApp: 'Pitching to Saudi family offices and angel investors' },
  { number: 7, date: 'July 31, 2026', topic: 'Governance', company: 'Saudi German Health', challenge: 'SAR 358M fraud, SAR 18M penalties — adequate deterrence?', hailApp: 'Corporate governance reforms for Saudi listed companies' },
  { number: 8, date: 'August 7, 2026', topic: 'Innovation', company: 'Netflix', challenge: 'How do you destroy your own successful business model before a competitor does?', hailApp: 'Digital transformation in traditional Hail sectors — retail, agriculture, logistics' },
  { number: 9, date: 'August 14, 2026', topic: 'Human Resources', company: 'Google (Project Aristotle)', challenge: 'What actually makes a high-performing team? Psychological safety vs. star performers', hailApp: 'Building effective small teams in resource-constrained Hail startups' },
  { number: 10, date: 'August 21, 2026', topic: 'Risk Management', company: 'Theranos', challenge: 'How can investors detect red flags before deploying capital?', hailApp: 'Due diligence frameworks for Hail angel investors and family offices' },
  { number: 11, date: 'August 28, 2026', topic: 'International Expansion', company: 'IKEA', challenge: 'Balancing global standardization with local adaptation', hailApp: 'Expanding Hail-based businesses to other Gulf markets — cultural and regulatory considerations' },
  { number: 12, date: 'September 4, 2026', topic: 'Crisis Management', company: "Johnson & Johnson (Tylenol 1982)", challenge: 'Managing consumer trust crises with transparency — preserving brand reputation', hailApp: 'Crisis communication plans for Hail startups and SMEs' },
  { number: 13, date: 'September 11, 2026', topic: 'Sustainability & Responsibility', company: 'Patagonia', challenge: 'Can profit align with values? Building sustainable business models', hailApp: 'Vision 2030-aligned sustainable business models in Hail — agriculture, eco-tourism, solar' },
  { number: 14, date: 'September 18, 2026', topic: 'Feasibility Studies', company: 'Quibi', challenge: 'Why do heavily-funded projects with star teams still fail? Validating market need before building', hailApp: 'Market validation for Hail entrepreneurs before seeking investment', }
];

export const PHASES = ['Opening (10m)', 'Case Analysis (20m)', 'Framework Deep-Dive (15m)', 'Debate (20m)', 'Saudi/Hail Application (15m)', 'Synthesis (10m)'];

export const FRAMEWORKS_BY_TOPIC: Record<string, string[]> = {
  Strategy: ["Porter's Five Forces", "Blue Ocean Strategy", "Business Model Canvas", "SWOT Analysis", "Value Chain"],
  Leadership: ["Servant Leadership", "Schein Culture Model", "Herzberg Two-Factor", "Transformational Leadership", "Culture-as-Strategy"],
  Finance: ["Unit Economics", "DCF Valuation", "Agency Theory", "Red Flags Framework", "Capital Structure"],
  Marketing: ["Brand Identity Prism (Kapferer)", "4Ps Marketing Mix", "Jobs-to-Be-Done", "Differentiation Strategy", "Cultural Branding"],
  Operations: ["Lean Operations", "Six Sigma/DMAIC", "Supply Chain Resilience", "Just-in-Time vs Just-in-Case", "Triple Bottom Line"],
  Negotiation: ["BATNA & ZOPA", "Anchoring", "Venture Capital Method", "Term Sheet Analysis", "Cross-Cultural Negotiation"],
  Governance: ["Fiduciary Duty", "Agency Theory", "IFRS Revenue Recognition", "CMA Regulatory Framework", "Stakeholder Theory"],
  Innovation: ["Disruptive Innovation (Christensen)", "Innovator's Dilemma", "Blue Ocean Strategy", "Jobs-to-Be-Done", "S-Curve Adoption"],
  "Human Resources": ["Psychological Safety (Edmondson)", "Tuckman Team Stages", "Google re:Work", "Belbin Team Roles", "OKR Framework"],
  "Risk Management": ["COSO ERM Framework", "Red Flags Due Diligence", "Pre-Mortem Analysis", "Risk Matrix (Probability × Impact)", "Swiss Cheese Model"],
  "International Expansion": ["CAGE Distance Framework", "Uppsala Internationalization", "Born Global Theory", "Entry Mode Decision Matrix", "Localization vs Standardization"],
  "Crisis Management": ["Crisis Communication Model (Coombs)", "Issue Lifecycle", "Stakeholder Mapping", "Scenario Planning", "Golden Hour Response"],
  "Sustainability & Responsibility": ["Triple Bottom Line (3Ps)", "ESG Framework", "B-Corp Certification", "Circular Economy", "Shared Value (Porter & Kramer)"],
  "Feasibility Studies": ["Market Validation Framework", "TAM SAM SOM", "Unit Economics & LTV/CAC", "Pre-Mortem Analysis", "Lean Canvas"],
};

export const MODULE_LIBRARY: Record<string, string[]> = {
  Strategy: ["Network Effects & Platform Strategy", "Competitive Advantage (Porter)", "Blue Ocean Strategy", "Business Model Innovation", "Market Entry Strategy"],
  Finance: ["Financial Statement Analysis", "Valuation Methods (DCF, Comps)", "Unit Economics & Burn Rate", "Cap Tables & Equity Dilution", "Growth vs Profitability"],
  Marketing: ["Brand Positioning & Identity", "CAC & Customer Lifetime Value", "Market Segmentation", "Go-to-Market Strategy", "Viral Marketing"],
  Operations: ["Supply Chain Optimization", "Lean & Waste Reduction", "Process Design", "Inventory Management", "Quality Control Systems"],
  Leadership: ["Organizational Culture Design", "Change Management", "Team Motivation & Incentives", "Decision-Making Under Uncertainty", "Stakeholder Management"],
  Negotiation: ["BATNA & ZOPA Mastery", "Term Sheet Fundamentals", "Valuation Negotiation", "Win-Win Deal Structuring", "Cross-Cultural Negotiation (Saudi)"],
  Governance: ["Board Fiduciary Duties", "IFRS Financial Reporting", "Audit Committee Role", "Risk Management Frameworks", "Saudi Capital Market Law (CMA)"],
  Innovation: ["Disruptive Innovation Theory", "The Innovator's Dilemma", "Platform Business Models", "Digital Transformation Strategy", "Product-Market Fit Validation"],
  "Human Resources": ["Psychological Safety at Work", "High-Performance Team Design", "Talent Retention in Startups", "Culture Scaling", "Remote/Hybrid Team Management"],
  "Risk Management": ["Investment Due Diligence", "Fraud Detection Red Flags", "Risk Assessment Matrices", "Portfolio Diversification", "Scenario Analysis & Stress Testing"],
  "International Expansion": ["Market Entry Strategies", "Cross-Border Regulatory Compliance", "Cultural Adaptation Framework", "Franchise vs Direct Investment", "Gulf-to-Gulf Expansion Playbook"],
  "Crisis Management": ["Crisis Communication Plans", "Stakeholder Trust Recovery", "Brand Reputation Defense", "Rapid Response Protocols", "Post-Crisis Rebuilding"],
  "Sustainability & Responsibility": ["ESG Integration", "Circular Business Models", "B-Corp & Social Enterprise", "Vision 2030 Sustainability Goals", "Impact Investing Frameworks"],
  "Feasibility Studies": ["Market Demand Validation", "TAM/SAM/SOM Sizing", "Unit Economics Modeling", "Pre-Investment Feasibility", "Lean Startup Validation"],
};

// ── Component ──────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [meetingNumber, setMeetingNumber] = useState(1);

  const meeting = useMemo(() => MEETINGS.find(m => m.number === meetingNumber)!, [meetingNumber]);

  const tabs = [
    { label: '📋 Pre-Meeting', icon: '📋' },
    { label: '🎙️ Live Discussion', icon: '🎙️' },
    { label: '📚 Frameworks', icon: '📚' },
    { label: '🗳️ Voting', icon: '🗳️' },
    { label: '📊 Post-Session', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] font-sans" dir="ltr">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-[#0D1321]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-white font-bold text-lg">Marfa.sa Moderator</h1>
              <p className="text-slate-500 text-xs">MBA Discussion Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={meetingNumber}
              onChange={e => setMeetingNumber(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
            >
              {MEETINGS.map(m => (
                <option key={m.number} value={m.number} className="bg-[#0D1321]">
                  Meeting {m.number}: {m.company} ({m.date})
                </option>
              ))}
            </select>
            <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold">
              Professor Mode
            </span>
          </div>
        </div>
      </header>

      {/* Meeting Info Bar */}
      <div className="bg-[#111827] border-b border-white/5 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-sm">
          <span className="text-slate-400">📅 <span className="text-white">{meeting.date}</span></span>
          <span className="text-slate-400">📚 <span className="text-white">{meeting.topic}</span></span>
          <span className="text-slate-400">🏢 <span className="text-white">{meeting.company}</span></span>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="bg-[#0D1321] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === i
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 0 && <PreMeetingPrep meeting={meeting} />}
        {activeTab === 1 && <LiveDiscussion meeting={meeting} />}
        {activeTab === 2 && <FrameworkPanel meeting={meeting} />}
        {activeTab === 3 && <DecisionVoting meeting={meeting} />}
        {activeTab === 4 && <PostSession meeting={meeting} />}
      </main>
    </div>
  );
}
