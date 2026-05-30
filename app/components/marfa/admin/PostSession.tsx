"use client";

import React, { useState, useMemo } from 'react';
import { logger } from '@/lib/logger';

interface Meeting {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

// ── Module library by topic ────────────────────────────────────
const MODULES: Record<string, string[]> = {
  Strategy: ["Network Effects & Platform Strategy", "Competitive Advantage (Porter)", "Blue Ocean Strategy", "Business Model Innovation", "Market Entry Strategy"],
  Leadership: ["Organizational Culture Design", "Change Management", "Team Motivation", "Decision-Making Under Uncertainty", "Stakeholder Management"],
  Finance: ["Financial Statement Analysis", "Valuation Methods (DCF, Comps)", "Unit Economics & Burn Rate", "Cap Tables & Equity Dilution", "Growth vs Profitability"],
  Marketing: ["Brand Positioning & Identity", "CAC & Customer Lifetime Value", "Market Segmentation", "Go-to-Market Strategy", "Viral Marketing & Storytelling"],
  Operations: ["Supply Chain Optimization", "Lean & Waste Reduction", "Process Design", "Inventory Management", "Quality Control Systems"],
  Negotiation: ["BATNA & ZOPA Mastery", "Term Sheet Fundamentals", "Valuation Negotiation", "Win-Win Deal Structuring", "Cross-Cultural Negotiation (Saudi)"],
  Governance: ["Board Fiduciary Duties", "IFRS Financial Reporting", "Audit Committee Role", "Risk Management Frameworks", "Saudi Capital Market Law (CMA)"],
};

const ALL_MEETINGS = [
  { number: 1, date: 'June 4, 2026', topic: 'Strategy', company: 'Airbnb' },
  { number: 2, date: 'June 18, 2026', topic: 'Leadership', company: 'Zappos' },
  { number: 3, date: 'July 2, 2026', topic: 'Finance', company: 'WeWork' },
  { number: 4, date: 'July 16, 2026', topic: 'Marketing', company: 'Liquid Death' },
  { number: 5, date: 'July 30, 2026', topic: 'Operations', company: 'Amazon' },
  { number: 6, date: 'August 13, 2026', topic: 'Negotiation', company: 'Shark Tank' },
  { number: 7, date: 'August 27, 2026', topic: 'Governance', company: 'SGH' },
];

const OBJECTIVES_BY_TOPIC: Record<string, string[]> = {
  Strategy: [
    "Analyze market entry strategies and competitive positioning",
    "Evaluate platform business models and network effects",
    "Assess trust-building mechanisms in peer-to-peer marketplaces",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Leadership: [
    "Evaluate organizational culture as competitive advantage",
    "Analyze transformational leadership models",
    "Assess employee empowerment and motivation systems",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Finance: [
    "Distinguish growth from sustainable profitability",
    "Evaluate multiple valuation methodologies",
    "Identify governance red flags in financial reporting",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Marketing: [
    "Analyze brand differentiation strategies for commodities",
    "Evaluate viral marketing and cultural branding",
    "Assess visual identity and packaging impact",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Operations: [
    "Analyze supply chain optimization strategies",
    "Evaluate automation vs. human labor trade-offs",
    "Assess last-mile delivery economics",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Negotiation: [
    "Master BATNA and ZOPA negotiation frameworks",
    "Analyze real deal structures and terms",
    "Evaluate investor decision-making psychology",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
  Governance: [
    "Analyze board fiduciary duty breaches",
    "Evaluate regulatory penalty adequacy",
    "Assess stakeholder impact and compensation",
    "Apply framework to Saudi/Hail context",
    "Make evidence-based business recommendations",
  ],
};

// ── Component ──────────────────────────────────────────────────
export default function PostSession({ meeting }: { meeting: Meeting }) {
  const [duration, setDuration] = useState(90);
  const [participation, setParticipation] = useState(75);
  const [objectivesMet, setObjectivesMet] = useState<boolean[]>([true, true, true, true, false]);
  const [rating, setRating] = useState(4);
  const [takeaways, setTakeaways] = useState('');
  const [participants, setParticipants] = useState<string[]>(['Ahmed Al-Harthi', 'Noura Al-Mutairi', 'Sara Al-Qahtani']);
  const [newParticipant, setNewParticipant] = useState('');
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [toast, setToast] = useState('');
  const [checklist, setChecklist] = useState([false, false, false, false]);

  const modules = MODULES[meeting.topic] || MODULES.Strategy;
  const objectives = OBJECTIVES_BY_TOPIC[meeting.topic] || OBJECTIVES_BY_TOPIC.Strategy;
  const nextMeeting = ALL_MEETINGS.find(m => m.number === meeting.number + 1);

  // Auto-select 2-3 modules when participant added
  const addParticipant = () => {
    const name = newParticipant.trim();
    if (!name || participants.includes(name)) return;
    setParticipants(prev => [...prev, name]);
    const picks = modules.slice(0, 3).map((_, i) => i).sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
    setAssignments(prev => ({ ...prev, [name]: picks.map(i => modules[i]) }));
    setNewParticipant('');
  };

  const toggleModule = (name: string, mod: string) => {
    setAssignments(prev => {
      const current = prev[name] || [];
      const next = current.includes(mod) ? current.filter(m => m !== mod) : [...current, mod];
      return { ...prev, [name]: next };
    });
  };

  const handleExport = () => {
    const data = {
      meeting: meeting.number,
      date: meeting.date,
      topic: meeting.topic,
      company: meeting.company,
      duration,
      participationRate: participation,
      objectivesMet: objectives.filter(Boolean).length,
      rating,
      takeaways: takeaways.split('\n').filter(Boolean),
      assignments,
    };
    logger.info('📊 Session Summary:', JSON.stringify(data, null, 2));
    setToast('✅ Summary exported! Ready to send to participants.');
    setTimeout(() => setToast(''), 3000);
  };

  const takeawayLines = takeaways.split('\n').filter(Boolean);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-green-500/20 border border-green-500/30 text-green-400 px-5 py-3 rounded-xl text-sm font-bold backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* ── Session Performance ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📊 Session Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-slate-400 text-xs block mb-1">Total Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-1">Participation Rate: {participation}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={participation}
              onChange={e => setParticipation(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-1">Overall Rating</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`text-xl transition-colors ${s <= rating ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400/50'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-1">Objectives Met</label>
            <span className="text-white font-bold text-lg">
              {objectives.filter(Boolean).length} / {objectives.length}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="text-slate-400 text-xs block">Learning Objectives</label>
          {objectives.map((obj, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={objectivesMet[i]}
                onChange={() => setObjectivesMet(prev => prev.map((v, j) => (j === i ? !v : v)))}
                className="accent-gold w-4 h-4"
              />
              <span className={`text-sm ${objectivesMet[i] ? 'text-green-400' : 'text-slate-500'}`}>{obj}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Key Takeaways ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">💡 Key Takeaways</h2>
        <textarea
          value={takeaways}
          onChange={e => setTakeaways(e.target.value)}
          placeholder="Enter 3-5 key takeaways, one per line..."
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-200 text-sm resize-none focus:outline-none focus:border-gold/50"
        />
        {takeawayLines.length > 0 && (
          <div className="mt-3 space-y-2">
            {takeawayLines.map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-gold font-bold mt-0.5">{i + 1}.</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MBA Module Assignment ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📚 MBA Module Assignment (1-5 per participant)</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newParticipant}
            onChange={e => setNewParticipant(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addParticipant()}
            placeholder="Add participant name..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
          />
          <button onClick={addParticipant} className="px-4 py-2 bg-gold/20 border border-gold/30 text-gold rounded-lg text-sm font-bold hover:bg-gold/30 transition-colors">
            + Add
          </button>
        </div>

        {participants.map(name => (
          <div key={name} className="mb-4 p-4 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-sm">{name}</span>
              <span className="text-slate-500 text-xs">
                {(assignments[name] || []).length} modules assigned
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {modules.map(mod => (
                <label key={mod} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={(assignments[name] || []).includes(mod)}
                    onChange={() => toggleModule(name, mod)}
                    className="accent-gold w-4 h-4"
                  />
                  <span className={`text-sm ${(assignments[name] || []).includes(mod) ? 'text-green-400' : 'text-slate-500'}`}>
                    {mod}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {participants.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-4">Add participants to assign MBA modules.</p>
        )}
      </div>

      {/* ── Next Meeting Prep ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📅 Next Meeting Preparation</h2>
        {nextMeeting ? (
          <>
            <p className="text-white font-bold mb-3">
              Meeting {nextMeeting.number}: {nextMeeting.company} — {nextMeeting.topic} ({nextMeeting.date})
            </p>
            <div className="space-y-2">
              {[
                'Case study PDF distributed to participants',
                'Date and time confirmed with all participants',
                'Pre-read assignments sent',
                'Room / venue confirmed',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist[i]}
                    onChange={() => setChecklist(prev => prev.map((v, j) => (j === i ? !v : v)))}
                    className="accent-gold w-4 h-4"
                  />
                  <span className={`text-sm ${checklist[i] ? 'text-green-400' : 'text-slate-400'}`}>{item}</span>
                </label>
              ))}
            </div>
          </>
        ) : (
          <p className="text-green-400 font-bold text-sm">🎉 Series Complete! All 7 meetings finished.</p>
        )}
      </div>

      {/* ── Export ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-gold/20 border border-gold/30 text-gold rounded-xl font-bold text-sm hover:bg-gold/30 transition-colors"
        >
          📤 Export Session Summary
        </button>
        <span className="text-slate-500 text-xs">Exports structured JSON to console</span>
      </div>

      {/* ── Session Archive ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">🗄️ Session Archive</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm" dir="rtl">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase">
                <th className="p-3">#</th>
                <th className="p-3">التاريخ</th>
                <th className="p-3">الموضوع</th>
                <th className="p-3">الشركة</th>
                <th className="p-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ALL_MEETINGS.map(m => {
                const isCurrent = m.number === meeting.number;
                const isPast = m.number < meeting.number;
                return (
                  <tr key={m.number} className={`${isCurrent ? 'bg-gold/5' : ''} transition-colors`}>
                    <td className={`p-3 font-bold ${isCurrent ? 'text-gold' : 'text-slate-300'}`}>{m.number}</td>
                    <td className={`p-3 ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{m.date}</td>
                    <td className={`p-3 ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{m.topic}</td>
                    <td className={`p-3 ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{m.company}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        isPast ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        isCurrent ? 'bg-gold/10 text-gold border border-gold/20' :
                        'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      }`}>
                        {isPast ? '✅ Completed' : isCurrent ? '🔄 Current' : '⏳ Upcoming'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
