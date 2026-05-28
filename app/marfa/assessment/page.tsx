'use client';

import { useState } from 'react';

const SWOT_STEPS = [
  {
    key: 'strengths',
    label: 'نقاط القوة',
    labelEn: 'Strengths',
    icon: '⚡',
    color: '#c9a84c',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.3)',
    questions: [
      { id: 'core_advantage', label: 'ما هي ميزتك التنافسية الأساسية؟', placeholder: 'ما الذي تقدمه بشكل استثنائي لا يقدمه الآخرون؟' },
      { id: 'resources', label: 'ما الموارد والكفاءات الفريدة التي تمتلكها؟', placeholder: 'التقنية، الفريق، العلاقات، الملكية الفكرية...' },
      { id: 'track_record', label: 'ما أبرز إنجازاتك حتى الآن؟', placeholder: 'أرقام، شراكات، عملاء، جوائز...' },
    ],
  },
  {
    key: 'weaknesses',
    label: 'نقاط الضعف',
    labelEn: 'Weaknesses',
    icon: '🔍',
    color: '#e05252',
    bg: 'rgba(224,82,82,0.08)',
    border: 'rgba(224,82,82,0.3)',
    questions: [
      { id: 'gaps', label: 'ما أكبر الفجوات في فريقك أو منتجك؟', placeholder: 'مهارات ناقصة، تقنية، تمويل...' },
      { id: 'bottlenecks', label: 'ما الذي يُبطئ نموك حالياً؟', placeholder: 'عمليات، موارد، قرارات...' },
      { id: 'feedback', label: 'ما أكثر الانتقادات التي تسمعها عن مشروعك؟', placeholder: 'ما يقوله العملاء أو المستثمرون بصراحة...' },
    ],
  },
  {
    key: 'opportunities',
    label: 'الفرص',
    labelEn: 'Opportunities',
    icon: '🚀',
    color: '#4caf7e',
    bg: 'rgba(76,175,126,0.08)',
    border: 'rgba(76,175,126,0.3)',
    questions: [
      { id: 'market_gap', label: 'ما الفرصة السوقية التي تراها ولا يراها الآخرون؟', placeholder: 'اتجاه ناشئ، فجوة في السوق، تغيير تنظيمي...' },
      { id: 'timing', label: 'لماذا الآن هو الوقت المناسب لهذا المشروع؟', placeholder: 'ما الذي تغيّر في السوق أو التكنولوجيا؟' },
      { id: 'expansion', label: 'ما قنوات النمو التي لم تستثمرها بعد؟', placeholder: 'شراكات، أسواق جديدة، منتجات مكملة...' },
    ],
  },
  {
    key: 'threats',
    label: 'التهديدات',
    labelEn: 'Threats',
    icon: '🛡',
    color: '#5b8ee8',
    bg: 'rgba(91,142,232,0.08)',
    border: 'rgba(91,142,232,0.3)',
    questions: [
      { id: 'competition', label: 'من هم منافسوك الحاليون والمحتملون؟', placeholder: 'من يمكنه منافستك بمليار دولار غداً؟' },
      { id: 'risks', label: 'ما السيناريوهات التي قد توقف نموك؟', placeholder: 'تغييرات تنظيمية، ركود، تكنولوجيا بديلة...' },
      { id: 'dependencies', label: 'على ماذا يعتمد مشروعك بشكل خطير؟', placeholder: 'مورد واحد، سياسة حكومية، منصة خارجية...' },
    ],
  },
];

const BASIC_FIELDS = [
  { id: 'full_name', label: 'الاسم الكامل', placeholder: 'محمد العمري', type: 'text' },
  { id: 'company', label: 'الشركة / المنظمة', placeholder: 'مرفأ للاستثمار', type: 'text' },
  { id: 'email', label: 'البريد الإلكتروني', placeholder: 'info @company.com', type: 'email', dir: 'ltr' },
  { id: 'idea_title', label: 'اسم المشروع / الفكرة', placeholder: 'منصة ربط المستثمرين', type: 'text' },
];

export default function AssessmentPage() {
  const [phase, setPhase] = useState<'intro' | 'basic' | 'swot' | 'result'>('intro');
  const [currentSwot, setCurrentSwot] = useState(0);
  const [basicData, setBasicData] = useState<Record<string, string>>({});
  const [swotData, setSwotData] = useState<Record<string, Record<string, string>>>({
    strengths: {},
    weaknesses: {},
    opportunities: {},
    threats: {},
  });
  const [animIn, setAnimIn] = useState(true);

  const totalSteps = 4;
  const progressPct =
    phase === 'basic' ? 10
    : phase === 'swot' ? 20 + (currentSwot / totalSteps) * 70
    : phase === 'result' ? 100
    : 0;

  const transition = (fn: () => void) => {
    setAnimIn(false);
    setTimeout(() => { fn(); setAnimIn(true); }, 300);
  };

  const handleBasicChange = (id: string, val: string) => setBasicData(p => ({ ...p, [id]: val }));
  const handleSwotChange = (key: string, qid: string, val: string) =>
    setSwotData(p => ({ ...p, [key]: { ...p[key], [qid]: val } }));

  const canAdvanceBasic = BASIC_FIELDS.every(f => basicData[f.id]?.trim());
  const canAdvanceSwot = (idx: number) => {
    const step = SWOT_STEPS[idx];
    return step.questions.every(q => swotData[step.key][q.id]?.trim());
  };

  const handleSubmit = () => {
    transition(() => setPhase('result'));
  };

  const currentStep = SWOT_STEPS[currentSwot];
  const allSwotFilled = SWOT_STEPS.every((_, i) => canAdvanceSwot(i));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          background: #0a0f1e;
          color: #e8e4d8;
          font-family: 'Tajawal', sans-serif;
          direction: rtl;
          min-height: 100vh;
        }

        .page-wrap {
          min-height: 100vh;
          background: #0a0f1e;
          background-image:
            radial-gradient(ellipse 60% 40% at 20% 10%, rgba(201,168,76,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 90%, rgba(91,142,232,0.04) 0%, transparent 60%);
          padding-bottom: 6rem;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid rgba(201,168,76,0.12);
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10,15,30,0.92);
          backdrop-filter: blur(12px);
        }
        .nav-logo { height: 36px; }
        .nav-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link {
          color: rgba(232,228,216,0.6);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #c9a84c; }
        .nav-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(201,168,76,0.7);
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-back:hover { color: #c9a84c; }

        .progress-bar-wrap {
          height: 2px;
          background: rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #c9a84c, #e8cc80);
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .progress-bar-fill::after {
          content: '';
          position: absolute;
          right: -2px;
          top: -2px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8cc80;
          box-shadow: 0 0 8px #c9a84c;
        }

        .container {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .fade-slide {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .fade-slide.out {
          opacity: 0;
          transform: translateY(12px);
        }
        .fade-slide.in {
          opacity: 1;
          transform: translateY(0);
        }

        .intro-hero {
          text-align: center;
          padding: 5rem 0 3rem;
        }
        .intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 100px;
          padding: 6px 16px;
          font-size: 13px;
          color: #c9a84c;
          margin-bottom: 2rem;
          letter-spacing: 0.5px;
        }
        .intro-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c9a84c;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .intro-title {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.2;
          color: #f0ead8;
          margin-bottom: 0.75rem;
        }
        .intro-title span {
          background: linear-gradient(135deg, #c9a84c, #f0d080);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .intro-sub {
          font-size: 1.05rem;
          color: rgba(232,228,216,0.55);
          line-height: 1.8;
          max-width: 520px;
          margin: 0 auto 3rem;
        }

        .swot-grid-preview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          max-width: 480px;
          margin: 0 auto 3rem;
        }
        .swot-quad {
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          border: 1px solid;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: default;
        }
        .swot-quad:hover {
          transform: translateY(-3px);
        }
        .swot-quad-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 4px;
        }
        .swot-quad-title {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .swot-quad-icon {
          font-size: 1.6rem;
          margin-bottom: 8px;
          display: block;
        }

        .btn-start {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #c9a84c, #b89238);
          color: #0a0f1e;
          font-family: 'Tajawal', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          padding: 0.875rem 2.5rem;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(201,168,76,0.3);
        }
        .btn-start:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,76,0.4);
        }
        .btn-start:active { transform: scale(0.98); }

        .section-header {
          padding: 3.5rem 0 2rem;
          text-align: center;
        }
        .section-step-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.6rem;
        }
        .section-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #f0ead8;
        }
        .section-desc {
          font-size: 0.95rem;
          color: rgba(232,228,216,0.45);
          margin-top: 0.5rem;
        }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem 2.5rem;
          margin-bottom: 1rem;
        }

        .swot-step-card {
          border-radius: 20px;
          padding: 2rem 2.5rem;
          margin-bottom: 1rem;
        }

        .field-group {
          margin-bottom: 1.5rem;
        }
        .field-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: rgba(232,228,216,0.75);
          margin-bottom: 8px;
        }
        .field-input,
        .field-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #e8e4d8;
          font-family: 'Tajawal', sans-serif;
          font-size: 15px;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
          direction: rtl;
        }
        .field-input[dir=ltr], .field-textarea[dir=ltr] { direction: ltr; text-align: left; }
        .field-input::placeholder, .field-textarea::placeholder {
          color: rgba(232,228,216,0.25);
        }
        .field-input:focus, .field-textarea:focus {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.04);
        }
        .field-textarea {
          resize: vertical;
          min-height: 88px;
          line-height: 1.7;
        }

        .swot-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2.5rem;
        }
        .swot-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: all 0.3s ease;
        }
        .swot-dot.done { background: rgba(201,168,76,0.6); }
        .swot-dot.active {
          width: 28px;
          border-radius: 100px;
          background: #c9a84c;
          box-shadow: 0 0 8px rgba(201,168,76,0.5);
        }

        .nav-buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          gap: 1rem;
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(232,228,216,0.6);
          font-family: 'Tajawal', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 0.7rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: rgba(255,255,255,0.3);
          color: #e8e4d8;
        }
        .btn-primary {
          background: linear-gradient(135deg, #c9a84c, #b89238);
          color: #0a0f1e;
          font-family: 'Tajawal', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 3px 12px rgba(201,168,76,0.25);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.35);
        }
        .btn-primary:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }

        .result-hero {
          text-align: center;
          padding: 4rem 0 3rem;
        }
        .result-check {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: rgba(201,168,76,0.12);
          border: 2px solid rgba(201,168,76,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
          animation: scale-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .result-title {
          font-size: 2rem;
          font-weight: 800;
          color: #f0ead8;
          margin-bottom: 0.5rem;
        }
        .result-sub {
          font-size: 0.95rem;
          color: rgba(232,228,216,0.45);
          max-width: 440px;
          margin: 0 auto 3rem;
          line-height: 1.8;
        }

        .result-swot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 2rem;
        }
        .result-quad {
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid;
        }
        .result-quad-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .result-quad-icon { font-size: 1.2rem; }
        .result-quad-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .result-quad-answer {
          margin-bottom: 8px;
          color: rgba(232,228,216,0.8);
          font-size: 13px;
          line-height: 1.6;
        }
        .result-quad-answer strong {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.45;
          margin-bottom: 2px;
        }

        .next-steps {
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 16px;
          padding: 1.75rem 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .next-steps h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #c9a84c;
          margin-bottom: 0.5rem;
        }
        .next-steps p {
          font-size: 14px;
          color: rgba(232,228,216,0.5);
          line-height: 1.7;
          max-width: 480px;
          margin: 0 auto;
        }

        .page-footer {
          text-align: center;
          padding: 3rem 0 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          color: rgba(232,228,216,0.25);
          font-size: 13px;
        }

        @media (max-width: 600px) {
          .nav { padding: 1rem 1.25rem; }
          .form-card, .swot-step-card { padding: 1.5rem 1.25rem; }
          .swot-grid-preview, .result-swot-grid { grid-template-columns: 1fr; }
          .intro-hero { padding: 3rem 0 2rem; }
        }
      `}</style>

      <div className="page-wrap">
        {/* NAV */}
        <nav className="nav">
          <a href="https://www.marfa.sa/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://www.marfa.sa/_next/image?url=%2Fimages%2Flogo-marfa.png&w=256&q=75"
              alt="مرفأ"
              className="nav-logo"
            />
          </a>
          <div className="nav-links">
            <a href="https://www.marfa.sa/meetings" className="nav-link">لقاءات مرفأ</a>
            <a href="https://www.marfa.sa/financial-news" className="nav-link">📰 الأخبار</a>
          </div>
          <a href="https://www.marfa.sa/marfa" className="nav-back">
            ← العودة لمرفأ
          </a>
        </nav>

        {/* PROGRESS */}
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="container">
          <div className={`fade-slide ${animIn ? 'in' : 'out'}`}>

            {/* ── INTRO ── */}
            {phase === 'intro' && (
              <div className="intro-hero">
                <div className="intro-badge">
                  <span className="intro-badge-dot" />
                  محرك التحليل والفلترة
                </div>
                <h1 className="intro-title">
                  اكتشف حقيقة<br />
                  <span>مشروعك الاستثماري</span>
                </h1>
                <p className="intro-sub">
                  أجب بصدق وشفافية. هذا المحرك مصمم لاكتشاف نقاط الضعف مبكراً لمعالجتها، وليس لتعجيزك. كل إجابة تقربك من قرار استثماري واضح.
                </p>

                <div className="swot-grid-preview">
                  {SWOT_STEPS.map((s) => (
                    <div
                      key={s.key}
                      className="swot-quad"
                      style={{ background: s.bg, borderColor: s.border }}
                    >
                      <span className="swot-quad-icon">{s.icon}</span>
                      <div className="swot-quad-label" style={{ color: s.color }}>{s.labelEn}</div>
                      <div className="swot-quad-title" style={{ color: s.color }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <button className="btn-start" onClick={() => transition(() => setPhase('basic'))}>
                  ابدأ التحليل الآن
                  <span style={{ fontSize: '1.1rem' }}>←</span>
                </button>
              </div>
            )}

            {/* ── BASIC INFO ── */}
            {phase === 'basic' && (
              <>
                <div className="section-header">
                  <div className="section-step-label">الخطوة الأولى</div>
                  <h2 className="section-title">بيانات المشروع الأساسية</h2>
                  <p className="section-desc">معلوماتك لن تُشارك إلا مع فريق مرفأ المختص</p>
                </div>

                <div className="form-card">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                    {BASIC_FIELDS.map((f) => (
                      <div key={f.id} className="field-group" style={f.id === 'idea_title' ? { gridColumn: '1 / -1' } : {}}>
                        <label className="field-label">{f.label}</label>
                        <input
                          type={f.type}
                          dir={f.dir || 'rtl'}
                          className="field-input"
                          placeholder={f.placeholder}
                          value={basicData[f.id] || ''}
                          onChange={(e) => handleBasicChange(f.id, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="nav-buttons">
                  <button className="btn-secondary" onClick={() => transition(() => setPhase('intro'))}>رجوع</button>
                  <button
                    className="btn-primary"
                    disabled={!canAdvanceBasic}
                    onClick={() => transition(() => { setCurrentSwot(0); setPhase('swot'); })}
                  >
                    التالي — تحليل SWOT ←
                  </button>
                </div>
              </>
            )}

            {/* ── SWOT STEPS ── */}
            {phase === 'swot' && (
              <>
                <div className="section-header">
                  <div className="section-step-label" style={{ color: currentStep.color }}>
                    {currentStep.labelEn} — الخطوة {currentSwot + 2} من 5
                  </div>
                  <h2 className="section-title" style={{ color: currentStep.color }}>
                    {currentStep.icon} {currentStep.label}
                  </h2>
                  <p className="section-desc">أجب بتفاصيل كافية — الإجابات الدقيقة تُنتج تحليلاً أدق</p>
                </div>

                <div className="swot-stepper">
                  {SWOT_STEPS.map((s, i) => (
                    <div
                      key={s.key}
                      className={`swot-dot ${i < currentSwot ? 'done' : i === currentSwot ? 'active' : ''}`}
                    />
                  ))}
                </div>

                <div
                  className="swot-step-card"
                  style={{ background: currentStep.bg, border: `1px solid ${currentStep.border}` }}
                >
                  {currentStep.questions.map((q) => (
                    <div key={q.id} className="field-group">
                      <label className="field-label">{q.label}</label>
                      <textarea
                        className="field-textarea"
                        placeholder={q.placeholder}
                        value={swotData[currentStep.key][q.id] || ''}
                        onChange={(e) => handleSwotChange(currentStep.key, q.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="nav-buttons">
                  <button
                    className="btn-secondary"
                    onClick={() => transition(() => {
                      if (currentSwot === 0) setPhase('basic');
                      else setCurrentSwot(p => p - 1);
                    })}
                  >
                    رجوع
                  </button>

                  {currentSwot < SWOT_STEPS.length - 1 ? (
                    <button
                      className="btn-primary"
                      disabled={!canAdvanceSwot(currentSwot)}
                      onClick={() => transition(() => setCurrentSwot(p => p + 1))}
                    >
                      التالي ←
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      disabled={!allSwotFilled}
                      onClick={handleSubmit}
                      style={{ background: 'linear-gradient(135deg, #c9a84c, #b89238)' }}
                    >
                      إرسال التحليل ✓
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ── RESULT ── */}
            {phase === 'result' && (
              <>
                <div className="result-hero">
                  <div className="result-check">✓</div>
                  <h2 className="result-title">تم استلام تحليلك</h2>
                  <p className="result-sub">
                    يراجع فريق مرفأ تحليل SWOT الخاص بك. ستتلقى تقييماً تفصيلياً
                    على بريدك الإلكتروني خلال ٢–٣ أيام عمل.
                  </p>
                </div>

                <div className="result-swot-grid">
                  {SWOT_STEPS.map((s) => (
                    <div
                      key={s.key}
                      className="result-quad"
                      style={{ background: s.bg, borderColor: s.border }}
                    >
                      <div className="result-quad-header">
                        <span className="result-quad-icon">{s.icon}</span>
                        <span className="result-quad-label" style={{ color: s.color }}>{s.label}</span>
                      </div>
                      {s.questions.map((q) => (
                        <div key={q.id} className="result-quad-answer">
                          <strong>{q.label}</strong>
                          {swotData[s.key][q.id] || '—'}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="next-steps">
                  <h3>ما الخطوة التالية؟</h3>
                  <p>
                    سيتواصل معك فريق مرفأ لجدولة جلسة تقييم مفصّلة بناءً على إجاباتك.
                    يمكنك في هذه الأثناء استكشاف لقاءات مرفأ أو متابعة آخر الأخبار المالية.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://www.marfa.sa/meetings" className="btn-primary" style={{ textDecoration: 'none' }}>
                    احجز لقاء مرفأ ←
                  </a>
                  <button className="btn-secondary" onClick={() => transition(() => {
                    setPhase('intro');
                    setBasicData({});
                    setSwotData({ strengths:{}, weaknesses:{}, opportunities:{}, threats:{} });
                    setCurrentSwot(0);
                  })}>
                    بدء تحليل جديد
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <footer className="page-footer">
          <div className="container">
            <p>© 2026 Marfa — Investment Bridge &nbsp;|&nbsp; صُنع بحب في حائل ❤️</p>
          </div>
        </footer>
      </div>
    </>
  );
}
