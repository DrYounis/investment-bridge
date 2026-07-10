'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div
          style={{
            fontFamily: 'Tajawal, sans-serif',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0f1e',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '400px',
              textAlign: 'center',
              padding: '40px 32px',
              borderRadius: '24px',
              background: '#0d1628',
              border: '1px solid #1a2540',
            }}
          >
            <h1
              style={{
                color: '#c9a84c',
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              حدث خطأ غير متوقع
            </h1>
            <p
              style={{
                color: '#a0aec0',
                fontSize: '14px',
                lineHeight: 1.8,
                marginBottom: '24px',
              }}
            >
              حدث خطأ تقني. يرجى المحاولة مرة أخرى.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#c9a84c',
                  color: '#0a0f1e',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                حاول مرة أخرى
              </button>
              <a
                href="/"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: '#a0aec0',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: '1px solid #1a2540',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                الصفحة الرئيسية
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
