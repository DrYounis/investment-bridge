'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-[#8a9bb8]">{label}</label>}
      <textarea
        className={`w-full p-3.5 rounded-xl bg-[#1a2235] border border-white/10 text-white placeholder:text-[#4a5a78] text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 transition-all resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
