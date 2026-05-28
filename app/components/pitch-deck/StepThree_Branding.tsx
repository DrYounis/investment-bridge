'use client';

import { BrandingConfig } from '@/types/pitch-deck';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const PRESET_PALETTES = [
  { name: 'ذهبي / Navy', primary: '#c9a84c', secondary: '#0a0f1e', accent: '#e2c478' },
  { name: 'أزرق / أبيض', primary: '#378ADD', secondary: '#0d1426', accent: '#6DB3F2' },
  { name: 'أخضر / داكن', primary: '#1D9E75', secondary: '#0a0f1e', accent: '#4ECCA3' },
  { name: 'أحمر / داكن', primary: '#E24B4A', secondary: '#0a0f1e', accent: '#FF6B6B' },
  { name: 'بنفسجي / داكن', primary: '#8B5CF6', secondary: '#0a0f1e', accent: '#A78BFA' },
  { name: 'Teal / داكن', primary: '#14B8A6', secondary: '#0a0f1e', accent: '#5EEAD4' },
];

interface StepThreeProps {
  branding: BrandingConfig;
  onChange: (branding: BrandingConfig) => void;
  onNext: () => void;
}

export default function StepThree_Branding({ branding, onChange, onNext }: StepThreeProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(branding.logoUrl || null);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      const url = URL.createObjectURL(accepted[0]);
      setLogoPreview(url);
      onChange({ ...branding, logoUrl: url });
    }
  }, [branding, onChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const selectPalette = (palette: typeof PRESET_PALETTES[0]) => {
    onChange({
      ...branding,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">الهوية البصرية</h2>
        <p className="text-[#8a9bb8] text-sm">ارفع شعارك واختر ألوان علامتك التجارية</p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-semibold text-[#8a9bb8] mb-2">الشعار</label>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-[#1e2d4a] rounded-xl p-6 text-center cursor-pointer hover:border-[#c9a84c]/40 transition-all"
        >
          <input {...getInputProps()} />
          {logoPreview ? (
            <img src={logoPreview} alt="Logo preview" className="h-16 mx-auto object-contain" />
          ) : (
            <div className="text-[#4a5a78] text-sm">اسحب الشعار هنا أو اضغط للرفع (PNG, JPG, SVG)</div>
          )}
        </div>
      </div>

      {/* Color palettes */}
      <div>
        <label className="block text-sm font-semibold text-[#8a9bb8] mb-3">لوحة الألوان</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {PRESET_PALETTES.map((palette, i) => (
            <button
              key={i}
              onClick={() => selectPalette(palette)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                branding.primaryColor === palette.primary
                  ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                  : 'border-[#1e2d4a] hover:border-[#c9a84c]/30'
              }`}
            >
              <div className="flex gap-1 mb-2 justify-center">
                <div className="w-5 h-5 rounded-full" style={{ background: palette.primary }} />
                <div className="w-5 h-5 rounded-full" style={{ background: palette.secondary }} />
                <div className="w-5 h-5 rounded-full" style={{ background: palette.accent }} />
              </div>
              <span className="text-xs text-[#8a9bb8]">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom color inputs */}
      <div className="grid grid-cols-3 gap-4">
        {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((key) => (
          <div key={key}>
            <label className="block text-xs text-[#8a9bb8] mb-1">
              {key === 'primaryColor' ? 'اللون الأساسي' : key === 'secondaryColor' ? 'الخلفية' : 'التمييز'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding[key]}
                onChange={e => onChange({ ...branding, [key]: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={branding[key]}
                onChange={e => onChange({ ...branding, [key]: e.target.value })}
                className="flex-1 p-2 rounded-lg bg-[#1a2235] border border-white/10 text-white text-sm font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="rounded-xl p-4 border border-[#1e2d4a]" style={{ background: branding.secondaryColor }}>
        <p className="text-sm mb-2" style={{ color: branding.accentColor }}>معاينة</p>
        <div className="text-center py-6 rounded-lg" style={{ background: `${branding.primaryColor}10` }}>
          <span className="text-lg font-bold" style={{ color: branding.primaryColor }}>عنوان تجريبي</span>
          <p className="text-sm mt-1" style={{ color: branding.accentColor }}>نص وصفي بلون التمييز</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0a0f1e] font-bold rounded-xl hover:from-[#e2c478] hover:to-[#c9a84c] transition-all duration-300 shadow-lg"
        >
          متابعة ←
        </button>
      </div>
    </div>
  );
}
