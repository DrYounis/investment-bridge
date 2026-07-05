"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────
interface Participant {
  id: string;
  name: string;
  contributions: number;
  lastSpoke: number | null; // seconds ago when they last spoke
}

interface MeetingData {
  number: number;
  date: string;
  topic: string;
  company: string;
  challenge: string;
  hailApp: string;
}

const PHASES = [
  { name: 'Opening', duration: 10, questions: [
    "What are the key facts of this case?",
    "What decision is the protagonist facing?",
    "What would YOU do in this situation?"
  ]},
  { name: 'Case Analysis', duration: 20, questions: [
    "What frameworks help us understand this case?",
    "What data supports your argument?",
    "What assumptions are you making?"
  ]},
  { name: 'Framework Deep-Dive', duration: 15, questions: [
    "Apply the primary framework to this case.",
    "What does the framework reveal that wasn't obvious?",
    "What are the framework's limitations here?"
  ]},
  { name: 'Debate', duration: 20, questions: [
    "Someone argue the OPPOSITE position.",
    "What's the strongest argument against your view?",
    "Where do we disagree — and why?"
  ]},
  { name: 'Saudi/Hail Application', duration: 15, questions: [
    "How does this apply to the Saudi market?",
    "What would this look like in Hail specifically?",
    "What cultural or regulatory factors change the analysis?"
  ]},
  { name: 'Synthesis', duration: 10, questions: [
    "What are our top 3 takeaways?",
    "What would you do differently tomorrow?",
    "What's the ONE thing you'll apply to your business?"
  ]},
];

// ── Component ──────────────────────────────────────────────────
export default function LiveDiscussion({ meeting }: { meeting: MeetingData }) {
  // Timer state
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Participant state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState('');

  // Tools state
  const [toolOutput, setToolOutput] = useState('');

  // Notes state
  const [notes, setNotes] = useState('');

  // Timer logic
  const totalSeconds = 90 * 60;
  const currentPhase = PHASES[phaseIndex];

  const getPhaseAtTime = useCallback((seconds: number) => {
    let cumulative = 0;
    for (let i = 0; i < PHASES.length; i++) {
      cumulative += PHASES[i].duration * 60;
      if (seconds < cumulative) return i;
    }
    return PHASES.length - 1;
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            setIsRunning(false);
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    setPhaseIndex(getPhaseAtTime(elapsed));
  }, [elapsed, getPhaseAtTime]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => { setIsRunning(false); setElapsed(0); setPhaseIndex(0); };

  // Participant logic
  const addParticipant = () => {
    if (!newName.trim() || participants.length >= 10) return;
    setParticipants(prev => [...prev, {
      id: String(Date.now()),
      name: newName.trim(),
      contributions: 0,
      lastSpoke: null,
    }]);
    setNewName('');
  };

  const adjustContributions = (id: string, delta: number) => {
    setParticipants(prev => prev.map(p =>
      p.id === id ? { ...p, contributions: Math.max(0, p.contributions + delta), lastSpoke: 0 } : p
    ));
  };

  const quietestParticipant = () => {
    const sorted = [...participants].sort((a, b) => a.contributions - b.contributions);
    return sorted[0]?.name || 'No participants';
  };

  // Tool logic
  const tools = {
    devilAdvocate: () => {
      const prompts = [
        `What if ${meeting.company}'s success was luck, not strategy? Could any competitor have done the same?`,
        `The consensus seems to be YES — but what are we missing? What's the downside nobody is mentioning?`,
        `Let me challenge that: what if the OPPOSITE decision would have been better? Make the case against ${meeting.company}.`,
      ];
      setToolOutput(prompts[Math.floor(Math.random() * prompts.length)]);
    },
    requestEvidence: () => {
      setToolOutput("📊 Request Evidence: 'What specific data supports that claim? Can you point to a number, a quote from the case, or a comparable example?'");
    },
    callOnQuiet: () => {
      const name = quietestParticipant();
      setToolOutput(`🎤 Call on: ${name} — '${name}, we haven't heard your perspective yet. What's your take on this?'`);
    },
    reframe: () => {
      setToolOutput(`🔄 Reframed: 'Let me rephrase the question — imagine you're the CEO of ${meeting.company} right now. What's the ONE decision you make today?'`);
    },
  };

  // Phase progress
  const phaseStart = PHASES.slice(0, phaseIndex).reduce((s, p) => s + p.duration * 60, 0);
  const phaseElapsed = elapsed - phaseStart;
  const phaseTotal = currentPhase.duration * 60;
  const phaseProgress = phaseTotal > 0 ? (phaseElapsed / phaseTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* ── Session Timer ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gold font-bold text-sm uppercase tracking-wide">⏱ Session Timer</h2>
          <span className="text-slate-500 text-xs">{formatTime(elapsed)} / 90:00</span>
        </div>

        {/* Digital Clock */}
        <div className="text-center mb-4">
          <div className="text-6xl font-mono font-bold text-white tracking-wider">
            {formatTime(elapsed)}
          </div>
          <div className="text-slate-400 text-sm mt-1">
            Phase {phaseIndex + 1}/6: <span className="text-gold font-bold">{currentPhase.name}</span> ({currentPhase.duration}m)
          </div>
        </div>

        {/* Phase Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(phaseProgress, 100)}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleStartPause}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              isRunning
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-bold transition-all"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Phases + Questions */}
        <div className="space-y-6">
          {/* Phase Steps */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">📋 Discussion Phases</h2>
            <div className="space-y-2">
              {PHASES.map((p, i) => {
                const isCurrent = i === phaseIndex;
                const isComplete = i < phaseIndex;
                const phaseCumStart = PHASES.slice(0, i).reduce((s, ph) => s + ph.duration, 0);
                const phaseCumEnd = phaseCumStart + p.duration;

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrent ? 'bg-gold/10 border border-gold/20' :
                      isComplete ? 'bg-green-500/5 border border-green-500/10' :
                      'bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      isCurrent ? 'bg-gold animate-pulse' :
                      isComplete ? 'bg-green-400' : 'bg-slate-700'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-gold' : isComplete ? 'text-green-400' : 'text-slate-500'
                        }`}>
                          {p.name}
                        </span>
                        <span className="text-xs text-slate-600 ms-2 shrink-0">
                          {phaseCumStart}m–{phaseCumEnd}m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Phase Questions */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">
              💬 Suggested Questions — {currentPhase.name}
            </h2>
            <ul className="space-y-2">
              {currentPhase.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-gold mt-0.5">▸</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Participants + Tools */}
        <div className="space-y-6">
          {/* Participant Engagement Tracker */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">👥 Participant Engagement</h2>

            {/* Add Participant */}
            <div className="flex gap-2 mb-4">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addParticipant()}
                placeholder="Participant name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50"
              />
              <button
                onClick={addParticipant}
                disabled={!newName.trim() || participants.length >= 10}
                className="px-4 py-2 bg-gold/20 text-gold rounded-lg text-sm font-bold hover:bg-gold/30 disabled:opacity-30 transition-all"
              >
                + Add
              </button>
            </div>

            {/* Participant Table */}
            {participants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs border-b border-white/5">
                      <th className="text-start py-2 px-1">Name</th>
                      <th className="text-center py-2 px-1">Contrib.</th>
                      <th className="text-center py-2 px-1">Last Spoke</th>
                      <th className="text-center py-2 px-1">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map(p => (
                      <tr key={p.id} className={`border-b border-white/5 ${
                        p.contributions === 0 ? 'bg-red-500/5' : ''
                      }`}>
                        <td className="py-2 px-1">
                          <span className="text-white">{p.name}</span>
                          {p.contributions === 0 && (
                            <span className="ms-2 text-red-400 text-xs">⚠️</span>
                          )}
                        </td>
                        <td className="py-2 px-1 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => adjustContributions(p.id, -1)}
                              className="text-slate-500 hover:text-red-400 text-xs w-5 h-5 rounded hover:bg-white/5"
                            >−</button>
                            <span className="text-white font-mono w-6 text-center">{p.contributions}</span>
                            <button
                              onClick={() => adjustContributions(p.id, 1)}
                              className="text-slate-500 hover:text-green-400 text-xs w-5 h-5 rounded hover:bg-white/5"
                            >+</button>
                          </div>
                        </td>
                        <td className="py-2 px-1 text-center text-slate-500 text-xs">
                          {p.lastSpoke === null ? '—' : 'just now'}
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            onClick={() => {
                              setToolOutput(`🎤 Calling on ${p.name}...`);
                              adjustContributions(p.id, 1);
                            }}
                            className="px-2 py-1 bg-gold/10 text-gold text-xs rounded hover:bg-gold/20 transition-all"
                          >
                            Call
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-600 text-sm text-center py-4">Add participants to track engagement</p>
            )}
          </div>

          {/* Quick Facilitation Tools */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-gold font-bold text-sm uppercase tracking-wide mb-4">🛠 Quick Facilitation Tools</h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={tools.devilAdvocate} className="px-3 py-2 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-500/20 border border-amber-500/20 transition-all">
                😈 Devil's Advocate
              </button>
              <button onClick={tools.requestEvidence} className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-500/20 border border-blue-500/20 transition-all">
                📊 Request Evidence
              </button>
              <button onClick={tools.callOnQuiet} className="px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-500/20 border border-purple-500/20 transition-all">
                🎤 Call on Quiet
              </button>
              <button onClick={tools.reframe} className="px-3 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/20 border border-cyan-500/20 transition-all">
                🔄 Reframe Question
              </button>
            </div>

            {/* Tool Output */}
            {toolOutput && (
              <div className="mt-4 p-3 bg-gold/5 border border-gold/10 rounded-lg">
                <p className="text-slate-300 text-sm leading-relaxed">{toolOutput}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Real-Time Notes ── */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gold font-bold text-sm uppercase tracking-wide">📝 Real-Time Notes</h2>
          <span className="text-slate-600 text-xs">{notes.length} chars</span>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Capture key points, quotes, insights during the discussion..."
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-300 text-sm focus:outline-none focus:border-gold/50 resize-y"
        />
      </div>
    </div>
  );
}
