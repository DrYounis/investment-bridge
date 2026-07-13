'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const components = {
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => <h2 className="text-2xl font-bold mt-8 mb-3" style={{ color: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</h2>,
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => <h3 className="text-xl font-semibold mt-6 mb-2" style={{ color: '#0a0f1e', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</h3>,
  p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => <p className="leading-loose mb-4 text-start" style={{ color: '#4a5b78', fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</p>,
  strong: ({ children, ...props }: React.ComponentPropsWithoutRef<'strong'>) => <strong className="font-bold" style={{ color: '#0a0f1e' }} {...props}>{children}</strong>,
  ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => <ul className="ms-6 mb-4 space-y-2 list-disc" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</ul>,
  ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => <ol className="ms-6 mb-4 space-y-2 list-decimal" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</ol>,
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => <hr className="my-8" style={{ borderColor: 'rgba(201,168,76,0.3)' }} {...props} />,
  a: ({ children, href, ...props }: React.ComponentPropsWithoutRef<'a'>) => <a href={href} className="text-[#c9a84c] underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
  blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="border-s-4 border-[#c9a84c]/40 bg-[#fdf9ef] p-4 my-4 rounded-e-lg" style={{ fontFamily: 'var(--font-tajawal), sans-serif' }} {...props}>{children}</blockquote>,
};

export default function MarkdownRenderer({ contentKey }: { contentKey: string }) {
  const [content, setContent] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = document.getElementById(contentKey);
    if (el) setContent(el.textContent || '');
    setMounted(true);
  }, [contentKey]);

  if (!mounted) {
    return <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-[#e5e5e5] rounded w-3/4" />
      <div className="h-4 bg-[#e5e5e5] rounded w-full" />
      <div className="h-4 bg-[#e5e5e5] rounded w-2/3" />
      <div className="h-4 bg-[#e5e5e5] rounded w-5/6" />
    </div>;
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
