"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface MeetingData {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

// ── Helpers ────────────────────────────────────────────────────
const VOTE_QUESTIONS: Record<string, string> = {
  Strategy: "Would you invest $500K in Airbnb in 2008?",
  Leadership: "Would you implement the $2,000 Offer at your company?",
  Finance: "Would you invest in WeWork at $47B valuation?",
  Marketing: "Would you invest in Liquid Death at $700M valuation?",
  Operations: "Would you invest $1B in Amazon's logistics network in 2005?",
  Negotiation: "Would you accept $200K for 20% equity?",
  Governance: "Were SAR 18M penalties adequate for SAR 358M fraud?",
};

const AUTO_PROMPTS = (yes: number, no: number, need: number) => {
  if (yes + no + need === 0) return null;
  if (yes >= no && yes >= need)
    return "🗣️ What's the strongest argument AGAINST your position? Challenge your own thesis.";
  if (no >= yes && no >= need)
    return "🤝 At what valuation or terms WOULD you say yes? Find your inflection point.";
  return "🔍 What additional data would change your mind? Define the missing evidence.";
};

// ── Component ──────────────────────────────────────────────────
export default function DecisionVoting({ meeting }: { meeting: MeetingData }) {
  // Voting
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);
  const [needMore, setNeedMore] = useState(0);

  // Debate
  const [teamA, setTeamA] = useState("Invest / Support the decision — argue why it's the right move.");
  const [teamB, setTeamB] = useState("Reject / Oppose the decision — argue why it's too risky or overvalued.");
  const [debateMinutes, setDebateMinutes] = useState(5);
  const [debateSeconds, setDebateSeconds] = useState(0);
  const [debateRunning, setDebateRunning] = useState(false);
  const debateRef = useRef<NodeJS.Timeout | null>(null);

  // Decision matrix
  const [matrix, setMatrix] = useState({
    strategicFit: ['High — aligns with market gap', 'Medium — partial alignment', 'Low — unclear strategic moat'],
    financialReturn: ['10x potential in 7 years', '3-5x in 5 years', 'Breakeven uncertain'],
    riskLevel: ['Moderate — execution risk', 'High — competitive & regulatory', 'Extreme — unproven model'],
  });

  // Consensus
  const [consensusText, setConsensusText] = useState('');
  const [consensusReached, setConsensusReached] = useState<boolean | null>(null);

  const totalVotes = yes + no + needMore;

  const vote = useCallback((type: 'yes' | 'no' | 'need') => {
    if (type === 'yes') setYes(y => y + 1);
    if (type === 'no') setNo(n => n + 1);
    if (type === 'need') setNeedMore(n => n + 1);
  }, []);

  const resetVotes = () => { setYes(0); setNo(0); setNeedMore(0); };

  // Debate timer
  useEffect(() => {
    if (debateRunning) {
      debateRef.current = setInterval(() => {
        setDebateSeconds(s => {
          if (s > 0) return s - 1;
          if (debateMinutes > 0) { setDebateMinutes(m => m - 1); return 59; }
          setDebateRunning(false);
          return 0;
        });
      }, 1000);
    }
    return () => { if (debateRef.current) clearInterval(debateRef.current); };
  }, [debateRunning, debateMinutes]);

  const startDebate = (mins: number) => {
    setDebateRunning(false);
    setDebateMinutes(mins);
    setDebateSeconds(0);
    setTimeout(() => setDebateRunning(true), 50);
  };

  const bar = (count: number, color: string) => {
    const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    return (
      <div className="w-full bg-white/5 rounded-full h-6 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 flex items-center justify-end px-2 text-xs font-bold ${color}`}
          style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
        >
          {count > 0 && `${count} (${Math.round(pct)}%)`}
        </div>
      </div>
    );
  };

  const promptMsg = AUTO_PROMPTS(yes, no, needMore);

  return (
    <div className="space-y-6">
      {/* ── LIVE VOTING ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">🗳️ Live Voting</h2>
        <p className="text-white text-lg font-semibold mb-6">
          {VOTE_QUESTIONS[meeting.topic] || VOTE_QUESTIONS.Strategy}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => vote('yes')} className="px-5 py-3 bg-emerald-600/20 border border-emerald-600/40 rounded-xl text-emerald-400 font-bold hover:bg-emerald-600/30 transition-all">
            ✅ YES
          </button>
          <button onClick={() => vote('no')} className="px-5 py-3 bg-red-600/20 border border-red-600/40 rounded-xl text-red-400 font-bold hover:bg-red-600/30 transition-all">
            ❌ NO
          </button>
          <button onClick={() => vote('need')} className="px-5 py-3 bg-amber-600/20 border border-amber-600/40 rounded-xl text-amber-400 font-bold hover:bg-amber-600/30 transition-all">
            🤔 NEED MORE DATA
          </button>
          <button onClick={resetVotes} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-300 border border-white/10 rounded-lg transition-colors">
            Reset
          </button>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 text-sm w-20">YES</span>
            {bar(yes, 'bg-emerald-600')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-sm w-20">NO</span>
            {bar(no, 'bg-red-600')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 text-sm w-20">NEED DATA</span>
            {bar(needMore, 'bg-amber-600')}
          </div>
        </div>
        <p className="text-slate-500 text-xs mt-3">Total votes cast: {totalVotes}</p>
      </div>

      {/* ── AUTO-PROMPTS ── */}
      {promptMsg && (
        <div className="bg-amber-600/10 border border-amber-600/30 rounded-2xl p-5">
          <p className="text-amber-300 text-sm font-medium">{promptMsg}</p>
        </div>
      )}

      {/* ── DEBATE STRUCTURING ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">⚔️ Debate Structuring</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Team A — Pro Position</label>
            <textarea
              value={teamA}
              onChange={e => setTeamA(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 resize-none"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Team B — Con Position</label>
            <textarea
              value={teamB}
              onChange={e => setTeamB(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 resize-none"
            />
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-slate-400 text-xs">Timer:</span>
          {[3, 5, 10].map(m => (
            <button
              key={m}
              onClick={() => startDebate(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                !debateRunning && debateMinutes === m
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-gold/30'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-mono text-white tabular-nums">
            {String(debateMinutes).padStart(2, '0')}:{String(debateSeconds).padStart(2, '0')}
          </div>
          <button
            onClick={() => setDebateRunning(!debateRunning)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              debateRunning
                ? 'bg-red-600/20 border border-red-600/40 text-red-400 hover:bg-red-600/30'
                : 'bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 hover:bg-emerald-600/30'
            }`}
          >
            {debateRunning ? '⏸ Pause' : '▶ Start Debate'}
          </button>
        </div>
      </div>

      {/* ── DECISION MATRIX ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📊 Decision Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-start text-slate-500 font-normal"></th>
                <th className="p-2 text-center text-slate-400 font-bold">Option A</th>
                <th className="p-2 text-center text-slate-400 font-bold">Option B</th>
                <th className="p-2 text-center text-slate-400 font-bold">Option C</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Strategic Fit', key: 'strategicFit' as const },
                { label: 'Financial Return', key: 'financialReturn' as const },
                { label: 'Risk Level', key: 'riskLevel' as const },
              ].map(row => (
                <tr key={row.key} className="border-t border-white/5">
                  <td className="p-2 text-slate-300 font-medium">{row.label}</td>
                  {[0, 1, 2].map(i => (
                    <td key={i} className="p-2">
                      <input
                        value={matrix[row.key][i]}
                        onChange={e => {
                          const updated = [...matrix[row.key]];
                          updated[i] = e.target.value;
                          setMatrix({ ...matrix, [row.key]: updated });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-gold/50"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CONSENSUS BUILDING ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">🤝 Consensus Building</h2>
        <textarea
          value={consensusText}
          onChange={e => setConsensusText(e.target.value)}
          placeholder="Capture the group consensus statement here..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 resize-none mb-4"
        />
        <div className="flex items-center gap-6">
          <span className="text-slate-400 text-xs">Was consensus reached?</span>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="consensus"
              checked={consensusReached === true}
              onChange={() => setConsensusReached(true)}
              className="accent-gold"
            />
            ✅ Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="radio"
              name="consensus"
              checked={consensusReached === false}
              onChange={() => setConsensusReached(false)}
              className="accent-gold"
            />
            ❌ No — disagreement remains
          </label>
        </div>
      </div>
    </div>
  );
}
