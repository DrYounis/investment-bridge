'use client';

import Link from 'next/link';

interface ArticleCardProps {
  slug: string;
  title: string;
  originalTitle: string;
  sourceUrl: string;
  date: string;
  tags?: string[];
}

export default function ArticleCard({
  slug,
  title,
  originalTitle,
  sourceUrl,
  date,
  tags = ['استثمار', 'أخبار مالية'],
}: ArticleCardProps) {
  return (
    <div
      className="
        bg-white/5 backdrop-blur-sm
        border border-white/10
        rounded-2xl p-5
        hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5
        transition-all duration-300
        flex flex-col gap-3
      "
      dir="rtl"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-100 leading-tight flex-1">
          <Link
            href={`/financial-news/${slug}`}
            className="hover:text-gold transition-colors"
          >
            {title}
          </Link>
        </h3>
      </div>

      {/* Original title */}
      <p className="text-sm text-slate-400">العنوان الأصلي: {originalTitle}</p>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {date}
        </span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            المصدر
          </a>
        )}
        <Link
          href={`/financial-news/${slug}`}
          className="hover:text-gold transition-colors"
        >
          عرض ←
        </Link>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium
                       bg-gold/10 text-gold/80
                       border border-gold/20"
          >
            #{tag.replace(/\s+/g, '-')}
          </span>
        ))}
      </div>
    </div>
  );
}
