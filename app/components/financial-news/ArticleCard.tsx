'use client';

interface ArticleCardProps {
  filename: string;
  title: string;
  originalTitle: string;
  sourceUrl: string;
  date: string;
  tags?: string[];
  onDownload?: (filename: string) => void;
}

export default function ArticleCard({
  filename,
  title,
  originalTitle,
  sourceUrl,
  date,
  tags = ['استثمار', 'أخبار مالية'],
  onDownload,
}: ArticleCardProps) {
  const handleDownload = () => {
    if (onDownload) onDownload(filename);
  };

  return (
    <div
      className="
        bg-white/5 backdrop-blur-sm
        border border-white/10
        rounded-2xl p-5
        hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5
        transition-all duration-300
        flex flex-col gap-3
        cursor-pointer
      "
      dir="rtl"
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-100 leading-tight flex-1">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {title}
          </a>
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="shrink-0 p-2 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold transition-colors"
          title="تحميل الملف"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            المصدر
          </a>
        </span>
        <button onClick={handleDownload} className="hover:text-gold transition-colors">
          {filename.length > 40 ? filename.slice(0, 37) + '...' : filename}
        </button>
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
