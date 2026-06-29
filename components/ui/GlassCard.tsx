'use client';

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
}

export default function GlassCard({ children, className = '', featured = false, ...props }: GlassCardProps) {
  return (
    <div
      {...props}
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: 'rgba(13,22,40,0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: featured
          ? '1px solid rgba(201,168,76,0.3)'
          : '1px solid rgba(201,168,76,0.12)',
        ...props.style,
      }}
    >
      {children}
    </div>
  );
}
