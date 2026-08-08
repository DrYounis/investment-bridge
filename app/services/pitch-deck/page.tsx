'use client';

import Link from 'next/link';
import { useEffect, useRef, useCallback } from 'react';

export default function PitchDeckServicePage() {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const setupObserver = useCallback(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
        }, { threshold: 0.12 });
        document.querySelectorAll('.fade-up').forEach(el => observerRef.current!.observe(el));
    }, []);

    useEffect(() => {
        setupObserver();
        // Animate bars
        const bars = document.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
        bars.forEach((bar, i) => {
            const h = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => { bar.style.height = h; }, 300 + i * 100);
        });
        return () => observerRef.current?.disconnect();
    }, [setupObserver]);

    const filterTabs = (e: React.MouseEvent<HTMLButtonElement>, cat: string) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        (e.target as HTMLElement).classList.add('active');
        document.querySelectorAll('.template-card').forEach((card: Element) => {
            const el = card as HTMLElement;
            if (cat === 'all' || el.dataset.cat === cat) {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
        });
    };

    return (
        <div className="min-h-screen" dir="rtl">
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                :root {
                    --navy: #0a0f1e; --navy-mid: #0f172a; --navy-card: #111827; --navy-border: #1e2d4a;
                    --gold: #c9a84c; --gold-light: #e2c478; --gold-dim: rgba(201,168,76,0.15);
                    --gold-glow: rgba(201,168,76,0.08); --text: #f0eada; --text-muted: #8a9bb8; --text-faint: #4a5a78;
                }
                .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
                .fade-up.visible { opacity: 1; transform: translateY(0); }
                .feat-card:nth-child(1) { transition-delay: 0s; }
                .feat-card:nth-child(2) { transition-delay: 0.08s; }
                .feat-card:nth-child(3) { transition-delay: 0.16s; }
                .feat-card:nth-child(4) { transition-delay: 0.24s; }
                .feat-card:nth-child(5) { transition-delay: 0.32s; }
                .feat-card:nth-child(6) { transition-delay: 0.4s; }
                @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
                .pulse-dot { animation: pulse 2s ease-in-out infinite; }
            `}</style>

            {/* NAV */}
            <nav style={{
                position:'fixed',top:0,right:0,left:0,zIndex:100,
                background:'rgba(10,15,30,0.85)',backdropFilter:'blur(20px)',
                borderBottom:'1px solid var(--navy-border)',
                padding:'0 clamp(1.5rem, 5vw, 4rem)',height:64,
                display:'flex',alignItems:'center',justifyContent:'space-between'
            }}>
                <Link href="/" style={{fontSize:'1.4rem',fontWeight:700,color:'var(--gold)',textDecoration:'none',letterSpacing:'0.02em'}}>
                    مرفأ <span style={{color:'var(--text)',fontWeight:300,fontSize:'0.9rem',marginRight:6}}>Investment Bridge</span>
                </Link>
                <div style={{display:'flex',gap:'1.8rem',alignItems:'center'}}>
                    <Link href="/meetings" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.9rem'}}>لقاءات مرفأ</Link>
                    <Link href="/financial-news" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.9rem'}}>📰 الأخبار المالية</Link>
                    <Link href="/services/pitch-deck/create" style={{
                        background:'var(--gold)',color:'var(--navy)',padding:'8px 22px',
                        borderRadius:6,fontWeight:700,fontSize:'0.9rem',textDecoration:'none'
                    }}>ابدأ الآن</Link>
                </div>
            </nav>

            {/* HERO */}
            <section style={{
                minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',
                alignItems:'center',textAlign:'center',
                padding:'120px clamp(1.5rem, 8vw, 8rem) 80px',
                position:'relative',overflow:'hidden',
                background:'var(--navy)',color:'var(--text)',fontFamily:"'Tajawal',sans-serif",direction:'rtl',lineHeight:1.7
            }}>
                <div style={{
                    position:'absolute',inset:0,zIndex:0,
                    background:'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(14,30,70,0.6) 0%, transparent 50%)'
                }}></div>
                <div style={{
                    position:'absolute',inset:0,zIndex:0,
                    backgroundImage:'linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)',
                    backgroundSize:'60px 60px',
                    maskImage:'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)' as any
                }}></div>

                <div style={{
                    display:'inline-flex',alignItems:'center',gap:8,
                    background:'var(--gold-dim)',border:'1px solid rgba(201,168,76,0.3)',
                    color:'var(--gold-light)',padding:'6px 18px',borderRadius:999,
                    fontSize:'0.82rem',fontWeight:500,marginBottom:'2rem',
                    position:'relative',zIndex:1
                }}>
                    <span className="pulse-dot" style={{width:7,height:7,borderRadius:'50%',background:'var(--gold)',display:'inline-block'}}></span>
                    باقة رواد الأعمال 💼
                </div>

                <h1 style={{
                    fontSize:'clamp(2rem, 5vw, 3.8rem)',fontWeight:900,lineHeight:1.2,
                    marginBottom:'1.5rem',position:'relative',zIndex:1
                }}>
                    مصمم العروض الاستثمارية<br />
                    <em style={{
                        fontStyle:'normal',
                        background:'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)',
                        WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'
                    }}>AI Pitch Deck Generator</em>
                </h1>

                <p style={{
                    fontSize:'clamp(1rem, 2vw, 1.2rem)',color:'var(--text-muted)',
                    maxWidth:620,margin:'0 auto 1.5rem',position:'relative',zIndex:1
                }}>
                    خدمة احترافية لتحويل مسودة مشروعك إلى عرض استثماري متكامل.
                    نستخدم الذكاء الاصطناعي لدمج البيانات المالية وهوية مشروعك في ملف واحد
                    يتبع معايير صناديق الاستثمار الجريء.
                </p>

                <ul style={{
                    display:'flex',flexWrap:'wrap',justifyContent:'center',
                    gap:'0.8rem 1.8rem',marginBottom:'2.5rem',position:'relative',zIndex:1,
                    listStyle:'none',padding:0
                }}>
                    {['هيكلة القصة (Storytelling) ومسار الإقناع','تصاميم بصرية ذكية وجداول بيانية تلقائية','إعادة صياغة النصوص لتكون أكثر اختصاراً وتأثيراً'].map((item, i) => (
                        <li key={i} style={{
                            display:'flex',alignItems:'center',gap:8,
                            color:'var(--text-muted)',fontSize:'0.9rem'
                        }}>
                            <span style={{
                                color:'var(--gold)',fontWeight:700,fontSize:'0.85rem',
                                background:'var(--gold-dim)',width:20,height:20,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                borderRadius:'50%',flexShrink:0
                            }}>✓</span>
                            {item}
                        </li>
                    ))}
                </ul>

                <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',justifyContent:'center',position:'relative',zIndex:1}}>
                    <Link href="/services/pitch-deck/create" style={{
                        background:'var(--gold)',color:'var(--navy)',padding:'14px 36px',
                        borderRadius:8,fontWeight:700,fontSize:'1rem',textDecoration:'none',
                        display:'inline-flex',alignItems:'center',gap:8
                    }}>
                        ابدأ التصميم الآن
                        <span style={{background:'rgba(10,15,30,0.2)',padding:'2px 10px',borderRadius:4,fontSize:'0.85rem'}}>مجاناً</span>
                    </Link>
                    <Link href="/marfa/assessment" style={{
                        background:'transparent',color:'var(--text-muted)',padding:'14px 28px',
                        borderRadius:8,fontSize:'0.9rem',textDecoration:'none',
                        border:'1px solid var(--navy-border)',display:'inline-flex',alignItems:'center',gap:6
                    }}>جرّب أداة SWOT مجاناً ←</Link>
                </div>

                {/* Mini chart */}
                <div style={{
                    position:'relative',zIndex:1,marginTop:'4rem',
                    background:'var(--navy-card)',border:'1px solid var(--navy-border)',
                    borderRadius:16,padding:'1.5rem',maxWidth:460,width:'100%'
                }}>
                    <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span>📊 Market Growth</span>
                        <strong style={{color:'var(--gold)'}}>Auto-generated Chart</strong>
                    </div>
                    <div style={{display:'flex',alignItems:'flex-end',gap:10,height:100}}>
                        {['35%','50%','62%','78%','91%','100%'].map((h, i) => (
                            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                                <div className="bar" style={{
                                    width:'100%',borderRadius:'4px 4px 0 0',height:h,
                                    background:'linear-gradient(to top, var(--gold), rgba(201,168,76,0.3))',
                                    transition:'height 0.8s cubic-bezier(0.34,1.56,0.64,1)'
                                }}></div>
                                <div style={{fontSize:'0.7rem',color:'var(--text-faint)'}}>Q{i+1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section style={{
                padding:'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 7vw, 6rem)',
                background:'var(--navy)',color:'var(--text)',fontFamily:"'Tajawal',sans-serif",direction:'rtl',lineHeight:1.7
            }} id="features">
                <div style={{display:'inline-block',fontSize:'0.75rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:700,background:'var(--gold-dim)',padding:'4px 14px',borderRadius:999,marginBottom:'1rem',border:'1px solid rgba(201,168,76,0.25)'}}>المميزات الأساسية</div>
                <h2 style={{fontSize:'clamp(1.6rem, 3.5vw, 2.6rem)',fontWeight:800,lineHeight:1.25,marginBottom:'1rem'}}>كل ما تحتاجه في عرضك الاستثماري</h2>
                <p style={{color:'var(--text-muted)',fontSize:'1.05rem',maxWidth:520,marginBottom:'3rem'}}>ستة أدوات متكاملة تحوّل أفكارك الخام إلى عرض يقنع المستثمر من الشريحة الأولى.</p>
                <div style={{width:60,height:3,background:'linear-gradient(90deg, var(--gold), transparent)',borderRadius:2,marginBottom:'2rem'}}></div>

                <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'1.2rem'}}>
                    {[
                        {icon:'⚡',title:'توليد المحتوى الذكي',desc:'لا داعي للكتابة من الصفر. أدخل رؤوس الأقلام، وسيقوم النظام بصياغة النصوص التسويقية ووصف المشكلة والحل بلغة استثمارية رصينة.'},
                        {icon:'🎨',title:'هوية بصرية مرنة',desc:'قوالب جاهزة تتكيف مع ألوان شعارك تلقائياً. المظهر النهائي يبدو وكأنه صُمِّم يدوياً بواسطة وكالة إعلانية.'},
                        {icon:'📈',title:'تصوير البيانات (Visualization)',desc:'يحوّل الأرقام الجافة من Excel إلى رسوم بيانية ومخططات نمو جذابة وسهلة القراءة للمستثمر.'},
                        {icon:'📑',title:'تحليل المستندات',desc:'أرفق ملف المشروع (Word/PDF) وسنقوم باستخراج النقاط الجوهرية (Highlights) ووضعها في الشرائح المناسبة.'},
                        {icon:'🔄',title:'تصدير متعدد الصيغ',desc:'احصل على الملف بصيغة PPTX قابلة للتعديل، أو PDF جاهز للإرسال عبر البريد الإلكتروني.'},
                        {icon:'👥',title:'جاهز للعرض (Present Mode)',desc:'نرفق ملاحظات المتحدث (Speaker Notes) لكل شريحة لمساعدتك في تقديم العرض بثقة واحترافية.'},
                    ].map((f, i) => (
                        <div key={i} className="feat-card fade-up" style={{
                            background:'var(--navy-card)',border:'1px solid var(--navy-border)',
                            borderRadius:14,padding:'1.8rem',position:'relative',overflow:'hidden',
                            transition:'border-color 0.25s, transform 0.25s'
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(201,168,76,0.4)'; (e.currentTarget as HTMLElement).style.transform='translateY(-3px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=''; (e.currentTarget as HTMLElement).style.transform=''; }}
                        >
                            <span style={{fontSize:'2rem',marginBottom:'1rem',display:'block',filter:'drop-shadow(0 2px 8px rgba(201,168,76,0.3))'}}>{f.icon}</span>
                            <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'0.6rem',color:'var(--text)'}}>{f.title}</h3>
                            <p style={{color:'var(--text-muted)',fontSize:'0.92rem',lineHeight:1.65}}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TEMPLATES */}
            <section style={{
                padding:'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 7vw, 6rem)',
                background:'var(--navy-mid)',color:'var(--text)',fontFamily:"'Tajawal',sans-serif",direction:'rtl',lineHeight:1.7
            }}>
                <div style={{display:'inline-block',fontSize:'0.75rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',fontWeight:700,background:'var(--gold-dim)',padding:'4px 14px',borderRadius:999,marginBottom:'1rem',border:'1px solid rgba(201,168,76,0.25)'}}>+20 قالب جاهز</div>
                <h2 style={{fontSize:'clamp(1.6rem, 3.5vw, 2.6rem)',fontWeight:800,lineHeight:1.25,marginBottom:'1rem'}}>اكتشف مكتبة القوالب الاحترافية</h2>
                <p style={{color:'var(--text-muted)',fontSize:'1.05rem',maxWidth:520,marginBottom:'3rem'}}>استلهمنا تصاميمنا من أفضل الشركات العالمية مثل Pitch.com وAirbnb وUber. مكتبة متكاملة تغطي جميع احتياجاتك.</p>
                <div style={{width:60,height:3,background:'linear-gradient(90deg, var(--gold), transparent)',borderRadius:2,marginBottom:'2rem'}}></div>

                <div style={{display:'flex',gap:'0.5rem',marginBottom:'2.5rem',flexWrap:'wrap'}}>
                    {['all','investor','marketing','sales','agency','startup'].map(cat => (
                        <button key={cat} className={`tab-btn ${cat === 'all' ? 'active' : ''}`}
                            onClick={(e) => filterTabs(e, cat)}
                            style={{
                                background:'transparent',color:'var(--text-muted)',
                                border:'1px solid var(--navy-border)',padding:'8px 20px',
                                borderRadius:999,fontFamily:"'Tajawal',sans-serif",
                                fontSize:'0.9rem',cursor:'pointer'
                            }}>
                            {cat === 'all' ? 'الكل' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',gap:'1rem'}}>
                    {[
                        { cat:'investor',thumb:'t1',icon:'📊',pro:true,title:'جولة استثمارية - Series A',tag:'Investor' },
                        { cat:'startup',thumb:'t2',icon:'🚀',pro:true,title:'شريحة الفكرة - Seed',tag:'Startup' },
                        { cat:'marketing',thumb:'t3',icon:'📣',pro:true,title:'حملة تسويقية',tag:'Marketing' },
                        { cat:'sales',thumb:'t4',icon:'💼',pro:true,title:'عرض مبيعات B2B',tag:'Sales' },
                        { cat:'agency',thumb:'t5',icon:'🏢',pro:true,title:'عرض الوكالة الإبداعية',tag:'Agency' },
                        { cat:'investor',thumb:'t2',icon:'📉',pro:true,title:'تقرير أداء ربع سنوي',tag:'Investor' },
                        { cat:'startup',thumb:'t4',icon:'💡',pro:true,title:'عرض المشروع التقني',tag:'Startup' },
                        { cat:'marketing',thumb:'t1',icon:'🎯',pro:true,title:'استراتيجية الوصول للسوق',tag:'Marketing' },
                    ].map((t, i) => {
                        const thumbGradients: Record<string,string> = {
                            t1:'linear-gradient(135deg, #0f2040, #0a1530)',
                            t2:'linear-gradient(135deg, #1a0f30, #0f0a25)',
                            t3:'linear-gradient(135deg, #0f2518, #081510)',
                            t4:'linear-gradient(135deg, #301010, #200a0a)',
                            t5:'linear-gradient(135deg, #0a1828, #06101c)',
                        };
                        return (
                            <div key={i} className="template-card" data-cat={t.cat} style={{
                                background:'var(--navy-card)',border:'1px solid var(--navy-border)',
                                borderRadius:12,overflow:'hidden',cursor:'pointer',
                                transition:'transform 0.2s, border-color 0.2s'
                            }}>
                                <div style={{
                                    height:130,display:'flex',alignItems:'center',justifyContent:'center',
                                    fontSize:'2rem',position:'relative',overflow:'hidden',
                                    background: thumbGradients[t.thumb] || thumbGradients.t1
                                }}>
                                    {t.icon}
                                </div>
                                <div style={{padding:'0.9rem 1rem'}}>
                                    <h4 style={{fontSize:'0.9rem',fontWeight:600,marginBottom:2}}>
                                        {t.pro && <span style={{display:'inline-block',background:'var(--gold-dim)',color:'var(--gold)',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.08em',padding:'2px 8px',borderRadius:4,marginRight:6,border:'1px solid rgba(201,168,76,0.3)'}}>PRO</span>}
                                        {t.title}
                                    </h4>
                                    <span style={{fontSize:'0.78rem',color:'var(--text-muted)'}}>{t.tag}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Link href="/services/pitch-deck/templates" style={{
                    display:'inline-flex',alignItems:'center',gap:8,
                    marginTop:'2rem',color:'var(--gold)',textDecoration:'none',
                    fontWeight:600,fontSize:'0.95rem',
                    borderBottom:'1px solid rgba(201,168,76,0.3)',paddingBottom:2
                }}>تصفح المكتبة كاملة ⬅</Link>
            </section>

            {/* CTA / PRICING */}
            <section style={{
                background:'var(--navy-mid)',borderTop:'1px solid var(--navy-border)',
                borderBottom:'1px solid var(--navy-border)',
                padding:'4rem clamp(1.5rem, 7vw, 6rem)',textAlign:'center',
                position:'relative',overflow:'hidden',
                color:'var(--text)',fontFamily:"'Tajawal',sans-serif",direction:'rtl',lineHeight:1.7
            }}>
                <div style={{
                    position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                    width:600,height:300,
                    background:'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 60%)',
                    pointerEvents:'none'
                }}></div>
                <h2 style={{fontSize:'clamp(1.5rem, 3vw, 2.4rem)',fontWeight:800,marginBottom:'0.5rem'}}>ابدأ عرضك الاستثماري اليوم</h2>
                <p style={{color:'var(--text-muted)',marginBottom:'2rem',fontSize:'1rem'}}>صمم عرضك أولاً — والسعر يُحدد بعد التواصل حسب حجم العمل.</p>

                <div style={{
                    display:'inline-block',background:'var(--navy-card)',
                    border:'1px solid rgba(201,168,76,0.35)',borderRadius:20,
                    padding:'2.5rem 3rem',position:'relative',zIndex:1
                }}>
                    <div style={{fontSize:'1.8rem',fontWeight:900,color:'var(--gold)',lineHeight:1,marginBottom:'0.2rem'}}>
                        سعر مخصّص
                    </div>
                    <div style={{color:'var(--text-muted)',fontSize:'0.9rem',marginBottom:'1.8rem'}}>يُحدد بعد التواصل — حسب احتياجات مشروعك</div>
                    <ul style={{listStyle:'none',marginBottom:'2rem',textAlign:'right',padding:0}}>
                        {['توليد محتوى ذكي بالكامل','هوية بصرية مخصصة لشعارك','تصدير PPTX + PDF','Speaker Notes لكل شريحة','وصول لأكثر من 20 قالب','تحليل المستندات (Word/PDF)'].map((p, i) => (
                            <li key={i} style={{
                                display:'flex',alignItems:'center',gap:10,
                                padding:'6px 0',fontSize:'0.9rem',color:'var(--text-muted)',
                                borderBottom:'1px solid rgba(255,255,255,0.04)'
                            }}>
                                <span style={{color:'var(--gold)',fontWeight:700,flexShrink:0}}>✓</span> {p}
                            </li>
                        ))}
                    </ul>
                    <a href="https://wa.me/966555056545" target="_blank" rel="noopener noreferrer" style={{
                        background:'var(--gold)',color:'var(--navy)',padding:'14px 36px',
                        borderRadius:8,fontWeight:700,fontSize:'1rem',textDecoration:'none',
                        display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%'
                    }}>💬 تواصل واتساب للاستفسار ←</a>
                    <p style={{color:'var(--text-faint)',fontSize:'0.75rem',marginTop:'1rem',textAlign:'center'}}>أو ابدأ التصميم مجاناً ثم تواصل معنا</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{
                background:'var(--navy)',borderTop:'1px solid var(--navy-border)',
                padding:'2.5rem clamp(1.5rem, 7vw, 6rem)',
                display:'flex',flexWrap:'wrap',alignItems:'center',
                justifyContent:'space-between',gap:'1rem',
                color:'var(--text)',fontFamily:"'Tajawal',sans-serif",direction:'rtl'
            }}>
                <div>
                    <div style={{fontSize:'1.2rem',fontWeight:800,color:'var(--gold)'}}>مرفأ</div>
                    <span style={{display:'block',fontSize:'0.78rem',color:'var(--text-faint)',fontWeight:400,marginTop:2}}>© 2026 Marfa. جميع الحقوق محفوظة · صُنع بحب في حائل ❤️</span>
                </div>
                <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
                    <Link href="/meetings" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.85rem'}}>لقاءات مرفأ</Link>
                    <Link href="/financial-news" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.85rem'}}>الأخبار المالية</Link>
                    <Link href="/marfa/assessment" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.85rem'}}>تقييم SWOT</Link>
                    <a href="https://wa.me/966555056545" style={{color:'var(--text-muted)',textDecoration:'none',fontSize:'0.85rem'}}>واتساب</a>
                </div>
                <div style={{color:'var(--text-faint)',fontSize:'0.8rem'}}>Investment Bridge · المملكة العربية السعودية</div>
            </footer>
        </div>
    );
}
