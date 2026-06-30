'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/browser';

// ─── Data ───────────────────────────────────────────────────
const SWOT_STEPS = [
  {
    key: 'strengths', label: 'نقاط القوة', labelEn: 'Strengths', icon: '⚡',
    color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.3)',
    questions: [
      { id: 'core_advantage', label: 'ما هي ميزتك التنافسية الأساسية؟', placeholder: 'ما الذي تقدمه بشكل استثنائي لا يقدمه الآخرون؟' },
      { id: 'resources',      label: 'ما الموارد والكفاءات الفريدة التي تمتلكها؟', placeholder: 'التقنية، الفريق، العلاقات، الملكية الفكرية...' },
      { id: 'track_record',   label: 'ما أبرز إنجازاتك حتى الآن؟', placeholder: 'أرقام، شراكات، عملاء، جوائز...' },
    ],
  },
  {
    key: 'weaknesses', label: 'نقاط الضعف', labelEn: 'Weaknesses', icon: '🔍',
    color: '#e05252', bg: 'rgba(224,82,82,0.08)', border: 'rgba(224,82,82,0.3)',
    questions: [
      { id: 'gaps',        label: 'ما أكبر الفجوات في فريقك أو منتجك؟', placeholder: 'مهارات ناقصة، تقنية، تمويل...' },
      { id: 'bottlenecks', label: 'ما الذي يُبطئ نموك حالياً؟', placeholder: 'عمليات، موارد، قرارات...' },
      { id: 'feedback',    label: 'ما أكثر الانتقادات التي تسمعها عن مشروعك؟', placeholder: 'ما يقوله العملاء أو المستثمرون بصراحة...' },
    ],
  },
  {
    key: 'opportunities', label: 'الفرص', labelEn: 'Opportunities', icon: '🚀',
    color: '#4caf7e', bg: 'rgba(76,175,126,0.08)', border: 'rgba(76,175,126,0.3)',
    questions: [
      { id: 'market_gap', label: 'ما الفرصة السوقية التي تراها ولا يراها الآخرون؟', placeholder: 'اتجاه ناشئ، فجوة في السوق، تغيير تنظيمي...' },
      { id: 'timing',     label: 'لماذا الآن هو الوقت المناسب لهذا المشروع؟', placeholder: 'ما الذي تغيّر في السوق أو التكنولوجيا؟' },
      { id: 'expansion',  label: 'ما قنوات النمو التي لم تستثمرها بعد؟', placeholder: 'شراكات، أسواق جديدة، منتجات مكملة...' },
    ],
  },
  {
    key: 'threats', label: 'التهديدات', labelEn: 'Threats', icon: '🛡',
    color: '#5b8ee8', bg: 'rgba(91,142,232,0.08)', border: 'rgba(91,142,232,0.3)',
    questions: [
      { id: 'competition',  label: 'من هم منافسوك الحاليون والمحتملون؟', placeholder: 'من يمكنه منافستك بمليار دولار غداً؟' },
      { id: 'risks',        label: 'ما السيناريوهات التي قد توقف نموك؟', placeholder: 'تغييرات تنظيمية، ركود، تكنولوجيا بديلة...' },
      { id: 'dependencies', label: 'على ماذا يعتمد مشروعك بشكل خطير؟', placeholder: 'مورد واحد، سياسة حكومية، منصة خارجية...' },
    ],
  },
];

const BASIC_FIELDS = [
  { id: 'full_name',   label: 'الاسم الكامل',         placeholder: 'محمد العمري',           type: 'text'  },
  { id: 'company',     label: 'الشركة / المنظمة',      placeholder: 'مرفأ للاستثمار',        type: 'text'  },
  { id: 'email',       label: 'البريد الإلكتروني',     placeholder: 'info @company.com',      type: 'email', dir: 'ltr' },
  { id: 'idea_title',  label: 'اسم المشروع / الفكرة',  placeholder: 'منصة ربط المستثمرين',  type: 'text', full: true },
];

// ─── Main component ─────────────────────────────────────────
export default function AssessmentPage() {
  // Auth
  const [user,    setUser]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // UI flow
  const [phase,        setPhase]        = useState('intro');   // intro|auth|basic|swot|result
  const [animIn,       setAnimIn]       = useState(true);

  // Assessment data
  const [currentSwot, setCurrentSwot] = useState(0);
  const [basicData,   setBasicData]   = useState<Record<string, string>>({});
  const [swotData,    setSwotData]    = useState<Record<string, Record<string, string>>>({
    strengths: {}, weaknesses: {}, opportunities: {}, threats: {},
  });
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // ── Session check on mount ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Pre-fill email from auth user
  useEffect(() => {
    if (user && !basicData.email) {
      setBasicData(p => ({ ...p, email: user.email || '' }));
    }
  }, [user]);

  // ── Helpers ──
  const progress =
    phase === 'basic'  ? 10 :
    phase === 'swot'   ? 20 + (currentSwot / 4) * 70 :
    phase === 'result' ? 100 : 0;

  const transition = (fn: () => void) => {
    setAnimIn(false);
    setTimeout(() => { fn(); setAnimIn(true); }, 280);
  };

  const canAdvanceBasic = BASIC_FIELDS.every(f => basicData[f.id]?.trim());
  const canAdvanceSwot  = (idx: number) => SWOT_STEPS[idx].questions.every(q => swotData[SWOT_STEPS[idx].key][q.id]?.trim());
  const allSwotFilled   = SWOT_STEPS.every((_, i) => canAdvanceSwot(i));

  // ── Logout handler ──
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPhase('intro');
    setBasicData({});
    setSwotData({ strengths:{}, weaknesses:{}, opportunities:{}, threats:{} });
    setCurrentSwot(0);
  };

  // ── Submit + save to Supabase ──
  const handleSubmit = async () => {
    setSaving(true); setSaveError('');
    try {
      // 1. Upsert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id:         user.id,
          full_name:  basicData.full_name,
          company:    basicData.company,
          email:      basicData.email,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) throw profileError;

      // 2. Insert assessment
      const payload = {
        user_id:    user.id,
        full_name:  basicData.full_name,
        company:    basicData.company,
        email:      basicData.email,
        idea_title: basicData.idea_title,

        s_core_advantage: swotData.strengths.core_advantage,
        s_resources:      swotData.strengths.resources,
        s_track_record:   swotData.strengths.track_record,

        w_gaps:        swotData.weaknesses.gaps,
        w_bottlenecks: swotData.weaknesses.bottlenecks,
        w_feedback:    swotData.weaknesses.feedback,

        o_market_gap: swotData.opportunities.market_gap,
        o_timing:     swotData.opportunities.timing,
        o_expansion:  swotData.opportunities.expansion,

        t_competition:  swotData.threats.competition,
        t_risks:        swotData.threats.risks,
        t_dependencies: swotData.threats.dependencies,

        status: 'pending',
      };

      const { data: inserted, error: assessError } = await supabase
        .from('assessments')
        .insert(payload)
        .select('id')
        .maybeSingle();

      if (assessError) throw assessError;

      setAssessmentId(inserted?.id ?? null);
      setSaving(false);
      transition(() => setPhase('result'));
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveError('حدث خطأ أثناء الحفظ. تحقق من اتصالك وحاول مجدداً.');
      setSaving(false);
    }
  };

  // ── Loading splash ──
  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0a0f1e', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'2px solid rgba(201,168,76,.2)', borderTop:'2px solid #c9a84c', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 1rem' }} />
        <p style={{ color:'rgba(232,228,216,.4)', fontFamily:'Tajawal,sans-serif', fontSize:14 }}>جارٍ التحقق من جلستك...</p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0f1e;color:#e8e4d8;font-family:'Tajawal',sans-serif;direction:rtl;min-height:100vh}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes scale-in{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}

        .page-wrap{min-height:100vh;background:#0a0f1e;background-image:radial-gradient(ellipse 60% 40% at 20% 10%,rgba(201,168,76,.05) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 80% 90%,rgba(91,142,232,.04) 0%,transparent 60%);padding-bottom:6rem}

        .nav{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2.5rem;border-bottom:1px solid rgba(201,168,76,.12);position:sticky;top:0;z-index:50;background:rgba(10,15,30,.92);backdrop-filter:blur(12px)}
        .nav-logo{height:36px}
        .nav-links{display:flex;gap:1.5rem;align-items:center}
        .nav-link{color:rgba(232,228,216,.6);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s}
        .nav-link:hover{color:#c9a84c}
        .nav-back{color:rgba(201,168,76,.7);font-size:13px;text-decoration:none;transition:color .2s;background:none;border:none;cursor:pointer;font-family:inherit}
        .nav-back:hover{color:#c9a84c}
        .nav-user{display:flex;align-items:center;gap:10px}
        .nav-user-pill{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:5px 12px;font-size:13px;color:#c9a84c;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .nav-signout{background:none;border:none;color:rgba(232,228,216,.35);font-size:12px;cursor:pointer;font-family:inherit;transition:color .2s}
        .nav-signout:hover{color:rgba(232,228,216,.7)}

        .progress-bar-wrap{height:2px;background:rgba(255,255,255,.05);overflow:hidden}
        .progress-bar-fill{height:100%;background:linear-gradient(90deg,#c9a84c,#e8cc80);transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
        .progress-bar-fill::after{content:'';position:absolute;right:-2px;top:-2px;width:6px;height:6px;border-radius:50%;background:#e8cc80;box-shadow:0 0 8px #c9a84c}

        .container{max-width:780px;margin:0 auto;padding:0 1.5rem}
        .fade-slide{transition:opacity .28s ease,transform .28s ease}
        .fade-slide.out{opacity:0;transform:translateY(10px)}
        .fade-slide.in{opacity:1;transform:translateY(0)}

        .intro-hero{text-align:center;padding:5rem 0 3rem}
        .intro-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);border-radius:100px;padding:6px 16px;font-size:13px;color:#c9a84c;margin-bottom:2rem}
        .intro-badge-dot{width:6px;height:6px;border-radius:50%;background:#c9a84c;animation:pulse-dot 2s infinite}
        .intro-title{font-size:clamp(2.2rem,5vw,3.2rem);font-weight:800;line-height:1.2;color:#f0ead8;margin-bottom:.75rem}
        .intro-title span{background:linear-gradient(135deg,#c9a84c,#f0d080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .intro-sub{font-size:1.05rem;color:rgba(232,228,216,.55);line-height:1.8;max-width:520px;margin:0 auto 3rem}
        .swot-grid-preview{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:480px;margin:0 auto 3rem}
        .swot-quad{border-radius:16px;padding:1.25rem 1.5rem;border:1px solid;transition:transform .25s}
        .swot-quad:hover{transform:translateY(-3px)}
        .swot-quad-icon{font-size:1.6rem;margin-bottom:8px;display:block}
        .swot-quad-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;opacity:.6;margin-bottom:4px}
        .swot-quad-title{font-size:1.2rem;font-weight:700}

        .auth-wrap{max-width:440px;margin:0 auto;padding:4rem 0 3rem}
        .auth-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:2.5rem}
        .auth-header{text-align:center;margin-bottom:2rem}
        .auth-lock{width:56px;height:56px;border-radius:50%;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin:0 auto 1rem}
        .auth-title{font-size:1.5rem;font-weight:800;color:#f0ead8;margin-bottom:.4rem}
        .auth-sub{font-size:.9rem;color:rgba(232,228,216,.45);line-height:1.7}
        .auth-free-badge{display:inline-block;background:rgba(76,175,126,.12);border:1px solid rgba(76,175,126,.3);border-radius:100px;padding:3px 12px;font-size:12px;color:#4caf7e;margin-top:.5rem}
        .auth-tabs{display:flex;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;margin-bottom:1.75rem}
        .auth-tab{flex:1;text-align:center;padding:.6rem;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;border:none;background:none;color:rgba(232,228,216,.45);font-family:inherit}
        .auth-tab.active{background:rgba(201,168,76,.15);color:#c9a84c}
        .auth-error{background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.3);border-radius:8px;padding:.75rem 1rem;font-size:13px;color:#e05252;margin-bottom:1rem;line-height:1.6}

        .section-header{padding:3.5rem 0 2rem;text-align:center}
        .section-step-label{font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#c9a84c;margin-bottom:.6rem}
        .section-title{font-size:1.8rem;font-weight:800;color:#f0ead8}
        .section-desc{font-size:.95rem;color:rgba(232,228,216,.45);margin-top:.5rem}
        .form-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;padding:2rem 2.5rem;margin-bottom:1rem}
        .swot-step-card{border-radius:20px;padding:2rem 2.5rem;margin-bottom:1rem}
        .field-group{margin-bottom:1.5rem}
        .field-label{display:block;font-size:14px;font-weight:600;color:rgba(232,228,216,.75);margin-bottom:8px}
        .field-input,.field-textarea{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.75rem 1rem;color:#e8e4d8;font-family:'Tajawal',sans-serif;font-size:15px;transition:border-color .2s,background .2s;outline:none;direction:rtl}
        .field-input[dir=ltr],.field-textarea[dir=ltr]{direction:ltr;text-align:left}
        .field-input::placeholder,.field-textarea::placeholder{color:rgba(232,228,216,.25)}
        .field-input:focus,.field-textarea:focus{border-color:rgba(201,168,76,.5);background:rgba(201,168,76,.04)}
        .field-textarea{resize:vertical;min-height:88px;line-height:1.7}
        .basic-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1.5rem}
        .full-col{grid-column:1/-1}

        .swot-stepper{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:2.5rem}
        .swot-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.15);transition:all .3s}
        .swot-dot.done{background:rgba(201,168,76,.6)}
        .swot-dot.active{width:28px;border-radius:100px;background:#c9a84c;box-shadow:0 0 8px rgba(201,168,76,.5)}

        .nav-buttons{display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;gap:1rem}
        .btn-secondary{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(232,228,216,.6);font-family:'Tajawal',sans-serif;font-size:14px;font-weight:500;padding:.7rem 1.5rem;border-radius:10px;cursor:pointer;transition:all .2s}
        .btn-secondary:hover{border-color:rgba(255,255,255,.3);color:#e8e4d8}
        .btn-primary{background:linear-gradient(135deg,#c9a84c,#b89238);color:#0a0f1e;font-family:'Tajawal',sans-serif;font-size:15px;font-weight:700;padding:.75rem 2rem;border-radius:10px;border:none;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 3px 12px rgba(201,168,76,.25)}
        .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,.35)}
        .btn-primary:disabled{opacity:.35;cursor:not-allowed}
        .btn-start{border-radius:100px;padding:.875rem 2.5rem;font-size:1.05rem;box-shadow:0 4px 20px rgba(201,168,76,.3)}
        .btn-start:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.4)}
        .btn-full{width:100%;justify-content:center}

        .save-error{background:rgba(224,82,82,.1);border:1px solid rgba(224,82,82,.3);border-radius:8px;padding:.75rem 1rem;font-size:13px;color:#e05252;margin-top:.75rem;text-align:center}

        .result-hero{text-align:center;padding:4rem 0 3rem}
        .result-check{width:72px;height:72px;border-radius:50%;background:rgba(201,168,76,.12);border:2px solid rgba(201,168,76,.4);display:flex;align-items:center;justify-content:center;font-size:2rem;margin:0 auto 1.5rem;animation:scale-in .4s cubic-bezier(.34,1.56,.64,1) both}
        .result-id{font-size:12px;color:rgba(232,228,216,.3);letter-spacing:.5px;margin-top:.5rem;font-family:monospace}
        .result-title{font-size:2rem;font-weight:800;color:#f0ead8;margin-bottom:.5rem}
        .result-sub{font-size:.95rem;color:rgba(232,228,216,.45);max-width:440px;margin:0 auto 3rem;line-height:1.8}
        .result-swot-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:2rem}
        .result-quad{border-radius:16px;padding:1.5rem;border:1px solid}
        .result-quad-header{display:flex;align-items:center;gap:8px;margin-bottom:1rem;padding-bottom:.75rem;border-bottom:1px solid rgba(255,255,255,.06)}
        .result-quad-label{font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;opacity:.75}
        .result-quad-answer{margin-bottom:8px;color:rgba(232,228,216,.8);font-size:13px;line-height:1.6}
        .result-quad-answer strong{display:block;font-size:11px;font-weight:600;letter-spacing:.5px;opacity:.4;margin-bottom:2px}
        .next-steps{background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:16px;padding:1.75rem 2rem;margin-bottom:1.5rem;text-align:center}
        .next-steps h3{font-size:1rem;font-weight:700;color:#c9a84c;margin-bottom:.5rem}
        .next-steps p{font-size:14px;color:rgba(232,228,216,.5);line-height:1.7;max-width:480px;margin:0 auto}

        .page-footer{text-align:center;padding:3rem 0 2rem;border-top:1px solid rgba(255,255,255,.05);color:rgba(232,228,216,.25);font-size:13px}

        @media(max-width:600px){
          .nav{padding:1rem 1.25rem}
          .form-card,.swot-step-card,.auth-card{padding:1.5rem 1.25rem}
          .basic-grid,.result-swot-grid,.swot-grid-preview{grid-template-columns:1fr}
          .intro-hero{padding:3rem 0 2rem}
        }
      `}</style>

      <div className="page-wrap">

        {/* ── NAV ── */}
        <nav className="nav">
          <Link href="/" className="nav-logo-link">
            <img src="/images/logo-marfa.png" alt="مرفأ" className="nav-logo" />
          </Link>
          <div className="nav-links">
            <Link href="/meetings"       className="nav-link">لقاءات مرفأ</Link>
            <Link href="/financial-news" className="nav-link">📰 الأخبار</Link>
          </div>
          <div className="nav-user">
            {user ? (
              <>
                <span className="nav-user-pill">👤 {user.email}</span>
                <button className="nav-signout" onClick={handleSignOut}>خروج</button>
              </>
            ) : (
              <Link href="/marfa" className="nav-back">← العودة لمرفأ</Link>
            )}
          </div>
        </nav>

        {/* PROGRESS */}
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="container">
          <div className={`fade-slide ${animIn ? 'in' : 'out'}`}>

            {/* ══════════ INTRO ══════════ */}
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
                  أجب بصدق وشفافية. هذا المحرك مصمم لاكتشاف نقاط الضعف مبكراً لمعالجتها،
                  وليس لتعجيزك. كل إجابة تقربك من قرار استثماري واضح.
                </p>
                <div className="swot-grid-preview">
                  {SWOT_STEPS.map(s => (
                    <div key={s.key} className="swot-quad" style={{ background: s.bg, borderColor: s.border }}>
                      <span className="swot-quad-icon">{s.icon}</span>
                      <div className="swot-quad-label" style={{ color: s.color }}>{s.labelEn}</div>
                      <div className="swot-quad-title" style={{ color: s.color }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn-primary btn-start"
                  onClick={() => transition(() => user ? setPhase('basic') : setPhase('auth'))}
                >
                  ابدأ التحليل الآن <span style={{ fontSize:'1.1rem' }}>←</span>
                </button>
              </div>
            )}

            {/* ══════════ AUTH GATE ══════════ */}
            {phase === 'auth' && (
              <div className="auth-wrap">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                  <div className="auth-header">
                    <div className="auth-lock">🔐</div>
                    <h2 className="auth-title">تسجيل الدخول مطلوب</h2>
                    <p className="auth-sub">
                      سجّل الدخول أو أنشئ حساباً لحفظ تحليلك وربطه بملفك الشخصي في مرفأ
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                      href="/login?redirect=/marfa/assessment"
                      className="btn-primary btn-full"
                      style={{ textDecoration: 'none', textAlign: 'center' }}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register?redirect=/marfa/assessment"
                      className="btn-primary btn-full"
                      style={{ textDecoration: 'none', textAlign: 'center', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}
                    >
                      إنشاء حساب جديد
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ BASIC INFO ══════════ */}
            {phase === 'basic' && (
              <>
                <div className="section-header">
                  <div className="section-step-label">الخطوة الأولى</div>
                  <h2 className="section-title">بيانات المشروع الأساسية</h2>
                  <p className="section-desc">معلوماتك لن تُشارك إلا مع فريق مرفأ المختص</p>
                </div>
                <div className="form-card">
                  <div className="basic-grid">
                    {BASIC_FIELDS.map(f => (
                      <div key={f.id} className={`field-group${f.full ? ' full-col' : ''}`}>
                        <label className="field-label">{f.label}</label>
                        <input
                          type={f.type} dir={f.dir || 'rtl'}
                          className="field-input"
                          placeholder={f.placeholder}
                          value={basicData[f.id] || ''}
                          onChange={e => setBasicData(p => ({ ...p, [f.id]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="nav-buttons">
                  <button className="btn-secondary" onClick={() => transition(() => setPhase('intro'))}>رجوع</button>
                  <button className="btn-primary" disabled={!canAdvanceBasic} onClick={() => transition(() => { setCurrentSwot(0); setPhase('swot'); })}>
                    التالي — تحليل SWOT ←
                  </button>
                </div>
              </>
            )}

            {/* ══════════ SWOT STEPS ══════════ */}
            {phase === 'swot' && (() => {
              const s = SWOT_STEPS[currentSwot];
              const isLast = currentSwot === SWOT_STEPS.length - 1;
              return (
                <>
                  <div className="section-header">
                    <div className="section-step-label" style={{ color: s.color }}>{s.labelEn} — الخطوة {currentSwot + 2} من 5</div>
                    <h2 className="section-title" style={{ color: s.color }}>{s.icon} {s.label}</h2>
                    <p className="section-desc">أجب بتفاصيل كافية — الإجابات الدقيقة تُنتج تحليلاً أدق</p>
                  </div>
                  <div className="swot-stepper">
                    {SWOT_STEPS.map((st, i) => (
                      <div key={st.key} className={`swot-dot${i < currentSwot ? ' done' : i === currentSwot ? ' active' : ''}`} />
                    ))}
                  </div>
                  <div className="swot-step-card" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    {s.questions.map(q => (
                      <div key={q.id} className="field-group">
                        <label className="field-label">{q.label}</label>
                        <textarea
                          className="field-textarea" placeholder={q.placeholder}
                          value={swotData[s.key][q.id] || ''}
                          onChange={e => setSwotData(p => ({ ...p, [s.key]: { ...p[s.key], [q.id]: e.target.value } }))}
                        />
                      </div>
                    ))}
                  </div>
                  {saveError && <div className="save-error">{saveError}</div>}
                  <div className="nav-buttons">
                    <button className="btn-secondary" onClick={() => transition(() => { if (currentSwot === 0) setPhase('basic'); else setCurrentSwot(p => p - 1); })}>رجوع</button>
                    {isLast ? (
                      <button className="btn-primary" disabled={!allSwotFilled || saving} onClick={handleSubmit}>
                        {saving
                          ? <><span style={{ width:16,height:16,border:'2px solid rgba(10,15,30,.3)',borderTop:'2px solid #0a0f1e',borderRadius:'50%',animation:'spin .7s linear infinite',display:'inline-block' }} /> جارٍ الحفظ...</>
                          : 'إرسال وحفظ التحليل ✓'
                        }
                      </button>
                    ) : (
                      <button className="btn-primary" disabled={!canAdvanceSwot(currentSwot)} onClick={() => transition(() => setCurrentSwot(p => p + 1))}>
                        التالي ←
                      </button>
                    )}
                  </div>
                </>
              );
            })()}

            {/* ══════════ RESULT ══════════ */}
            {phase === 'result' && (
              <>
                <div className="result-hero">
                  <div className="result-check">✓</div>
                  <h2 className="result-title">تم حفظ تحليلك بنجاح</h2>
                  {assessmentId && <p className="result-id">#{assessmentId.slice(0,8).toUpperCase()}</p>}
                  <p className="result-sub">
                    تم حفظ تحليل SWOT في ملفك الشخصي وفي قاعدة بيانات مرفأ.
                    سيتواصل معك فريقنا خلال ٢–٣ أيام عمل بتقييم مفصّل.
                  </p>
                </div>

                <div className="result-swot-grid">
                  {SWOT_STEPS.map(s => (
                    <div key={s.key} className="result-quad" style={{ background: s.bg, borderColor: s.border }}>
                      <div className="result-quad-header">
                        <span style={{ fontSize:'1.2rem' }}>{s.icon}</span>
                        <span className="result-quad-label" style={{ color: s.color }}>{s.label}</span>
                      </div>
                      {s.questions.map(q => (
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
                  <p>سيتواصل معك فريق مرفأ لجدولة جلسة تقييم مفصّلة بناءً على إجاباتك. يمكنك في هذه الأثناء استكشاف لقاءات مرفأ أو متابعة آخر الأخبار المالية.</p>
                </div>

                <div style={{ display:'flex', justifyContent:'center', gap:'1rem', flexWrap:'wrap' }}>
                  <Link href="/meetings" className="btn-primary" style={{ textDecoration:'none' }}>احجز لقاء مرفأ ←</Link>
                  <button className="btn-secondary" onClick={() => transition(() => {
                    setPhase('basic');
                    setBasicData({ email: user?.email || '' });
                    setSwotData({ strengths:{}, weaknesses:{}, opportunities:{}, threats:{} });
                    setCurrentSwot(0);
                    setAssessmentId(null);
                  })}>
                    إضافة مشروع آخر
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        <footer className="page-footer">
          <div className="container">
            <p>© 2026 Marfa — Investment Bridge &nbsp;|&nbsp; صُنع بحب في حائل ❤️</p>
          </div>
        </footer>
      </div>
    </>
  );
}
