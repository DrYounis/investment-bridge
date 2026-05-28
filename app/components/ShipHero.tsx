"use client";

// ShipHero.tsx
// Pure CSS animated ship scene for marfa.sa
// Zero dependencies, zero network requests, GPU-accelerated CSS animations
// Usage: import ShipHero from '@/app/components/ShipHero'

import { useEffect, useRef } from "react";

export default function ShipHero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // After ship arrives (~3.8s) add "anchored" class for gentle bob-only
  useEffect(() => {
    const t = setTimeout(() => {
      wrapRef.current?.classList.add("anchored");
    }, 3900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        /* ── SCENE WRAPPER ── */
        .ship-scene {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        /* ── STARS ── */
        .stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 18%, rgba(201,168,76,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 8%,  rgba(240,234,218,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 58% 22%, rgba(201,168,76,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 10%, rgba(240,234,218,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 30%, rgba(201,168,76,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 42%, rgba(240,234,218,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 67% 5%,  rgba(240,234,218,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 35%, rgba(201,168,76,0.2) 0%, transparent 100%);
        }

        /* ── MOON GLOW ── */
        .moon-glow {
          position: absolute;
          top: 8%;
          left: 10%;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          animation: moonPulse 4s ease-in-out infinite;
        }
        @keyframes moonPulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50%      { transform: scale(1.08); opacity: 1; }
        }

        /* ── SEA ── */
        .sea {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 38%;
        }

        /* Wave layers — staggered for depth */
        .wave {
          position: absolute;
          bottom: 0; left: -10%; right: -10%;
          border-radius: 50% 50% 0 0 / 12px 12px 0 0;
          animation: waveDrift linear infinite;
          will-change: transform;
        }
        .wave-1 {
          height: 100%;
          background: linear-gradient(180deg, #0b1a36 0%, #071120 100%);
          animation-duration: 0s; /* static base */
        }
        .wave-2 {
          height: 55%;
          background: linear-gradient(180deg, rgba(10,30,70,0.7) 0%, transparent 100%);
          animation-duration: 7s;
          bottom: 20%;
          opacity: 0.6;
        }
        .wave-3 {
          height: 35%;
          background: linear-gradient(180deg, rgba(201,168,76,0.06) 0%, transparent 100%);
          animation-duration: 5s;
          animation-direction: reverse;
          bottom: 30%;
          opacity: 0.8;
        }
        .wave-4 {
          height: 20%;
          background: linear-gradient(180deg, rgba(14,40,90,0.5) 0%, transparent 100%);
          animation-duration: 9s;
          bottom: 38%;
        }
        @keyframes waveDrift {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(3%); }
          100% { transform: translateX(0); }
        }

        /* Gold water shimmer */
        .sea-shimmer {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 40px,
            rgba(201,168,76,0.03) 40px,
            rgba(201,168,76,0.03) 41px
          );
          animation: shimmerDrift 6s linear infinite;
          opacity: 0.5;
        }
        @keyframes shimmerDrift {
          from { background-position: 0 0; }
          to   { background-position: 80px 0; }
        }

        /* ── HORIZON GLOW ── */
        .horizon {
          position: absolute;
          bottom: 36%;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(201,168,76,0.15) 25%,
            rgba(201,168,76,0.3) 50%,
            rgba(201,168,76,0.15) 75%,
            transparent 100%
          );
        }

        /* ── DOCK / PORT ── */
        .dock {
          position: absolute;
          bottom: 36%;
          right: 6%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0;
        }
        .dock-light {
          width: 3px;
          height: 50px;
          background: linear-gradient(to top, #c9a84c, rgba(201,168,76,0.1));
          border-radius: 2px;
          position: relative;
        }
        .dock-light::after {
          content: '';
          position: absolute;
          top: -4px; left: -3px;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #c9a84c;
          box-shadow: 0 0 12px 4px rgba(201,168,76,0.5);
          animation: lightBlink 2s ease-in-out infinite;
        }
        @keyframes lightBlink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        .dock-platform {
          width: 90px;
          height: 6px;
          background: linear-gradient(90deg, transparent, #1e2d4a, #c9a84c20, #1e2d4a);
          border-radius: 2px;
        }
        .dock-pillars {
          display: flex;
          gap: 14px;
        }
        .dock-pillar {
          width: 5px;
          height: 22px;
          background: #1e2d4a;
          border-radius: 2px;
        }

        /* ── SHIP WRAPPER ── */
        .ship-wrap {
          position: absolute;
          bottom: calc(36% - 2px);
          right: 4%;  /* final anchor position */

          /* Entry: start far right off-screen */
          transform: translateX(110vw);
          animation: shipSail 3.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
          will-change: transform;
        }
        @keyframes shipSail {
          0%   { transform: translateX(110vw); }
          75%  { transform: translateX(8px); }    /* slight overshoot */
          88%  { transform: translateX(-4px); }   /* settle back */
          100% { transform: translateX(0); }
        }

        /* After anchored class added — only gentle bob */
        .anchored .ship-wrap {
          animation: none;
          transform: translateX(0);
        }
        .anchored .ship-svg {
          animation: shipBob 3.5s ease-in-out infinite;
        }
        @keyframes shipBob {
          0%,100% { transform: translateY(0) rotate(0deg); }
          30%     { transform: translateY(-3px) rotate(0.4deg); }
          70%     { transform: translateY(2px) rotate(-0.3deg); }
        }

        /* Ship sails during travel */
        .ship-svg {
          display: block;
          filter: drop-shadow(0 4px 20px rgba(0,0,0,0.6))
                  drop-shadow(0 0 12px rgba(201,168,76,0.12));
        }

        /* Wake — only visible while sailing */
        .wake {
          position: absolute;
          bottom: 8px;
          right: 100%;
          width: 0;
          height: 6px;
          background: linear-gradient(to left,
            rgba(201,168,76,0.15) 0%,
            rgba(255,255,255,0.06) 40%,
            transparent 100%
          );
          border-radius: 4px;
          animation: wakeSwell 3.5s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
        }
        @keyframes wakeSwell {
          0%   { width: 0; opacity: 0; }
          30%  { width: 120px; opacity: 1; }
          100% { width: 200px; opacity: 0.3; }
        }
        .anchored .wake {
          opacity: 0;
        }

        /* Sail billow during travel */
        .sail-main {
          transform-origin: top center;
          animation: sailBillow 0.8s ease-in-out infinite alternate;
        }
        .anchored .sail-main {
          animation: sailResttle 1.5s ease-out forwards,
                     sailBreeze 4s ease-in-out 1.5s infinite alternate;
        }
        @keyframes sailBillow {
          from { transform: skewX(-3deg) scaleX(1.04); }
          to   { transform: skewX(2deg) scaleX(0.97); }
        }
        @keyframes sailResttle {
          to { transform: skewX(0) scaleX(1); }
        }
        @keyframes sailBreeze {
          from { transform: skewX(0deg) scaleX(1); }
          to   { transform: skewX(1deg) scaleX(1.02); }
        }

        /* Gold flag flutter */
        .flag {
          transform-origin: left center;
          animation: flagFlutter 0.5s ease-in-out infinite alternate;
        }
        .anchored .flag {
          animation: flagGentleFlutter 2s ease-in-out infinite alternate;
        }
        @keyframes flagFlutter {
          from { transform: rotate(-8deg) scaleX(1); }
          to   { transform: rotate(8deg) scaleX(0.85); }
        }
        @keyframes flagGentleFlutter {
          from { transform: rotate(-3deg); }
          to   { transform: rotate(5deg); }
        }

        /* Smoke/steam from chimney */
        .smoke {
          position: absolute;
          bottom: 100%;
          left: 48%;
          display: flex;
          flex-direction: column-reverse;
          gap: 2px;
          align-items: center;
          pointer-events: none;
        }
        .smoke-puff {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(138,155,184,0.3);
          animation: smokePuff 2s ease-out infinite;
        }
        .smoke-puff:nth-child(2) { animation-delay: 0.6s; width:8px; height:8px; }
        .smoke-puff:nth-child(3) { animation-delay: 1.2s; width:10px;height:10px; }
        @keyframes smokePuff {
          0%   { transform: translateY(0) scale(0.5); opacity: 0.4; }
          100% { transform: translateY(-24px) scale(1.8); opacity: 0; }
        }

        /* Anchor splash on arrival */
        .splash {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          opacity: 0;
          animation: splashAppear 0.5s ease-out 3.85s forwards;
          pointer-events: none;
        }
        .splash::before,
        .splash::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 3px; height: 0;
          background: linear-gradient(to top, rgba(201,168,76,0.4), transparent);
          border-radius: 2px;
        }
        .splash::before { left: -8px; transform: rotate(-30deg); }
        .splash::after  { right: -8px; transform: rotate(30deg); }
        @keyframes splashAppear {
          0%  { opacity: 0; }
          10% { opacity: 1; }
          100%{ opacity: 0; transform: translateX(-50%) scaleY(1.4); }
        }
        .splash::before { animation: splashArm 0.5s ease-out 3.85s forwards; }
        .splash::after  { animation: splashArm 0.5s ease-out 3.85s forwards; }
        @keyframes splashArm {
          0%  { height: 0; }
          40% { height: 14px; }
          100%{ height: 0; }
        }

        /* ── FOG LAYER ── */
        .fog {
          position: absolute;
          bottom: 30%;
          left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to top,
            rgba(10,15,30,0.4) 0%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* Responsive — shrink on mobile */
        @media (max-width: 640px) {
          .ship-wrap { right: 2%; bottom: calc(36% - 1px); }
          .ship-svg  { width: 180px; height: auto; }
          .dock      { right: 3%; }
          .dock-platform { width: 60px; }
        }
      `}</style>

      <div className="ship-scene" ref={wrapRef} aria-hidden="true">
        {/* Stars */}
        <div className="stars" />
        {/* Moon glow */}
        <div className="moon-glow" />

        {/* Sea */}
        <div className="sea">
          <div className="wave wave-1" />
          <div className="wave wave-2" />
          <div className="wave wave-3" />
          <div className="wave wave-4" />
          <div className="sea-shimmer" />
        </div>

        {/* Horizon */}
        <div className="horizon" />

        {/* Fog */}
        <div className="fog" />

        {/* Dock / Port */}
        <div className="dock">
          <div className="dock-light" />
          <div className="dock-platform" />
          <div className="dock-pillars">
            <div className="dock-pillar" />
            <div className="dock-pillar" />
            <div className="dock-pillar" />
            <div className="dock-pillar" />
          </div>
        </div>

        {/* Ship */}
        <div className="ship-wrap">
          {/* Wake trail */}
          <div className="wake" />

          {/* Anchor splash */}
          <div className="splash" />

          {/* Smoke */}
          <div className="smoke">
            <div className="smoke-puff" />
            <div className="smoke-puff" />
            <div className="smoke-puff" />
          </div>

          {/* SVG Ship — fully inline, zero network request */}
          <svg
            className="ship-svg"
            width="320"
            height="180"
            viewBox="0 0 160 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Hull */}
            <path
              d="M10 62 Q20 72 80 74 Q140 72 150 62 L142 56 L18 56 Z"
              fill="#0f2040"
              stroke="#1e2d4a"
              strokeWidth="1"
            />
            {/* Hull highlight */}
            <path
              d="M20 58 Q80 60 140 58"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="1"
              fill="none"
            />
            {/* Deck */}
            <rect x="18" y="48" width="124" height="10" rx="1" fill="#0d1a35" stroke="#1e2d4a" strokeWidth="0.8" />

            {/* Cabin */}
            <rect x="55" y="32" width="50" height="18" rx="2" fill="#0a1528" stroke="#1e2d4a" strokeWidth="0.8" />
            {/* Cabin windows */}
            <rect x="62" y="37" width="8" height="7" rx="1.5" fill="#1a3a6a" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" />
            <rect x="76" y="37" width="8" height="7" rx="1.5" fill="#1a3a6a" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" />
            <rect x="90" y="37" width="8" height="7" rx="1.5" fill="#1a3a6a" stroke="rgba(201,168,76,0.4)" strokeWidth="0.6" />
            {/* Window glow */}
            <rect x="62" y="37" width="8" height="7" rx="1.5" fill="rgba(201,168,76,0.08)" />
            <rect x="76" y="37" width="8" height="7" rx="1.5" fill="rgba(201,168,76,0.06)" />

            {/* Chimney */}
            <rect x="94" y="22" width="7" height="14" rx="1" fill="#0d1a35" stroke="#1e2d4a" strokeWidth="0.8" />
            <rect x="93" y="20" width="9" height="4" rx="1" fill="#131f38" stroke="#1e2d4a" strokeWidth="0.6" />

            {/* Mast */}
            <line x1="75" y1="4" x2="75" y2="50" stroke="#1e3a6a" strokeWidth="1.5" />
            {/* Yard arm */}
            <line x1="55" y1="14" x2="95" y2="14" stroke="#1e3a6a" strokeWidth="1" />

            {/* Main sail */}
            <g className="sail-main">
              <path
                d="M56 15 Q75 16 94 15 L90 46 Q75 48 60 46 Z"
                fill="rgba(14,30,65,0.9)"
                stroke="rgba(201,168,76,0.2)"
                strokeWidth="0.8"
              />
              {/* Sail stripe */}
              <line x1="63" y1="18" x2="61" y2="42" stroke="rgba(201,168,76,0.15)" strokeWidth="0.8" />
              <line x1="75" y1="17" x2="75" y2="44" stroke="rgba(201,168,76,0.12)" strokeWidth="0.8" />
            </g>

            {/* Top sail */}
            <path
              d="M63 6 Q75 5 87 6 L85 14 Q75 15 65 14 Z"
              fill="rgba(14,30,65,0.8)"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="0.6"
            />

            {/* Gold flag */}
            <g className="flag">
              <rect x="75" y="2" width="14" height="8" rx="1" fill="#c9a84c" opacity="0.9" />
              <rect x="75" y="2" width="14" height="4" rx="1" fill="#c9a84c" />
              <rect x="75" y="6" width="14" height="4" rx="0.5" fill="#a07830" />
            </g>

            {/* Ropes */}
            <line x1="75" y1="4"  x2="18" y2="50" stroke="rgba(201,168,76,0.15)" strokeWidth="0.6" />
            <line x1="75" y1="4"  x2="140" y2="50" stroke="rgba(201,168,76,0.15)" strokeWidth="0.6" />
            <line x1="55" y1="14" x2="75" y2="4"  stroke="rgba(201,168,76,0.15)" strokeWidth="0.6" />
            <line x1="95" y1="14" x2="75" y2="4"  stroke="rgba(201,168,76,0.15)" strokeWidth="0.6" />

            {/* Anchor (front of bow) */}
            <circle cx="22" cy="60" r="3" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
            <line x1="22" y1="57" x2="22" y2="53" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />
            <line x1="19" y1="59" x2="25" y2="59" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />

            {/* Gold waterline stripe */}
            <path
              d="M18 56 L142 56"
              stroke="rgba(201,168,76,0.35)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
