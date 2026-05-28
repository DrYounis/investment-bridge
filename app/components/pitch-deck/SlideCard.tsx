'use client';

import { Slide, BrandingConfig } from '@/types/pitch-deck';

interface SlideCardProps {
  slide: Slide;
  branding?: BrandingConfig;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SlideCard({ slide, branding, isActive, onClick }: SlideCardProps) {
  const bg = branding?.secondaryColor || '#0a0f1e';
  const accent = branding?.primaryColor || '#c9a84c';
  const textColor = '#f0eada';
  const mutedColor = '#8a9bb8';

  return (
    <div
      onClick={onClick}
      className={`relative w-full rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
        isActive ? 'border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.2)]' : 'border-[#1e2d4a] hover:border-[#c9a84c]/40'
      }`}
      style={{ aspectRatio: '16/9', background: bg }}
      dir="rtl"
    >
      {/* Slide number */}
      <div className="absolute top-2 left-2 text-xs z-10" style={{ color: mutedColor }}>
        {slide.order + 1}
      </div>

      {/* Content based on type */}
      <div className="p-4 md:p-6 h-full flex flex-col justify-center">
        {slide.type === 'cover' && (
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: accent }}>{slide.title}</h2>
            {slide.subtitle && <p className="text-sm" style={{ color: mutedColor }}>{slide.subtitle}</p>}
          </div>
        )}

        {slide.type === 'problem' && (
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: accent }}>{slide.title || 'المشكلة'}</h3>
            <ul className="space-y-2">
              {slide.bullets?.slice(0, 3).map((b, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: textColor }}>
                  <span style={{ color: accent }}>•</span> {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(slide.type === 'solution' || slide.type === 'product') && (
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: accent }}>{slide.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: mutedColor }}>{slide.content}</p>
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="mt-3 space-y-1">
                {slide.bullets.slice(0, 3).map((b, i) => (
                  <li key={i} className="text-sm" style={{ color: textColor }}>✓ {b}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {slide.type === 'market' && (
          <div className="text-center">
            <h3 className="text-lg font-bold mb-3" style={{ color: accent }}>{slide.title || 'حجم السوق'}</h3>
            <div className="flex justify-center gap-2 md:gap-4 text-xs">
              <div className="px-3 py-2 rounded-lg border" style={{ borderColor: accent, color: accent, background: `${accent}10` }}>TAM</div>
              <div className="px-3 py-2 rounded-lg border opacity-70" style={{ borderColor: accent, color: accent, background: `${accent}08` }}>SAM</div>
              <div className="px-3 py-2 rounded-lg border opacity-50" style={{ borderColor: accent, color: accent, background: `${accent}05` }}>SOM</div>
            </div>
            <p className="text-xs mt-2" style={{ color: mutedColor }}>{slide.content}</p>
          </div>
        )}

        {slide.type === 'team' && (
          <div>
            <h3 className="text-lg font-bold mb-3" style={{ color: accent }}>{slide.title || 'الفريق'}</h3>
            <div className="grid grid-cols-2 gap-2">
              {slide.bullets?.slice(0, 4).map((b, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: `${accent}10` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: accent, color: bg }}>{i + 1}</div>
                  <span className="text-xs" style={{ color: textColor }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === 'ask' && (
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2" style={{ color: accent }}>{slide.title || 'طلب التمويل'}</h3>
            <div className="text-2xl font-black mb-2" style={{ color: accent }}>{slide.content}</div>
            {slide.bullets && (
              <ul className="space-y-1">
                {slide.bullets.map((b, i) => (
                  <li key={i} className="text-sm" style={{ color: mutedColor }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {!['cover', 'problem', 'solution', 'product', 'market', 'team', 'ask'].includes(slide.type) && (
          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: accent }}>{slide.title}</h3>
            <p className="text-sm" style={{ color: mutedColor }}>{slide.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
