import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { getCachedJobs, type Job } from '@/lib/jobs';
import { Resend } from 'resend';

// One-shot test route — remove after sending.
const TEST_TOKEN = 'jobs-test-7c3e1a';
const RECIPIENT = 'op.younis@gmail.com';
const TOP_N = 10;

function formatSalary(job: Job): string | null {
  if (job.salaryMin == null || job.salaryMax == null) return null;
  const fmt = (n: number) => n.toLocaleString('ar-SA');
  const per = job.salaryPeriod === 'yearly' ? 'سنوياً' : job.salaryPeriod === 'monthly' ? 'شهرياً' : '';
  return `${fmt(job.salaryMin)} – ${fmt(job.salaryMax)} ريال ${per}`.trim();
}

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${TEST_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { jobs, fetchedAt } = await getCachedJobs(supabase);

  if (jobs.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No cached jobs' });
  }

  const top = jobs.slice(0, TOP_N);
  const rows = top
    .map((job) => {
      const title = job.titleAr || job.title;
      const salary = formatSalary(job);
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #c9a84c22;text-align:right">
            <a href="https://www.marfa.sa/jobs/${job.slug}" style="color:#0a0f1e;font-weight:bold;font-size:14px;text-decoration:none">${title}</a>
            <div style="color:#4a5b78;font-size:12px;margin-top:3px">${job.company} · ${job.city}${salary ? ` · ${salary}` : ''}</div>
          </td>
        </tr>`;
    })
    .join('');

  const fetchedLabel = fetchedAt ? new Date(fetchedAt).toLocaleDateString('ar-SA') : '—';

  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="font-family:'Tajawal','Cairo',sans-serif;direction:rtl;background:#faf8f2;padding:30px;margin:0">
<div style="max-width:600px;margin:auto;background:#fff;border:1px solid #c9a84c33;border-radius:24px;overflow:hidden;box-shadow:0 8px 30px rgba(10,15,30,0.06)">
  <div style="background:linear-gradient(135deg,#0a0f1e,#0d1628);padding:32px 24px;text-align:center">
    <h1 style="color:#c9a84c;font-size:22px;margin:0 0 6px 0">💼 وظائف الأسبوع</h1>
    <p style="color:#a0aec0;font-size:13px;margin:0">آخر تحديث: ${fetchedLabel} · ${jobs.length} وظيفة متاحة</p>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse">${rows}</table>
    ${jobs.length > TOP_N ? `<p style="color:#8a94a8;font-size:12px;text-align:center;margin-top:16px">+ ${jobs.length - TOP_N} وظيفة أخرى على /jobs</p>` : ''}
    <div style="text-align:center;margin-top:24px">
      <a href="https://www.marfa.sa/jobs" style="display:inline-block;background:#c9a84c;color:#0a0f1e;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px">عرض كل الوظائف ←</a>
    </div>
  </div>
  <div style="padding:16px 24px;border-top:1px solid #c9a84c33;text-align:center">
    <p style="color:#64748b;font-size:11px;margin:0">www.marfa.sa | منصة مرفأ لرواد الأعمال | حائل 🇸🇦</p>
  </div>
</div>
</body></html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'مرفأ <noreply@marfa.sa>',
    to: RECIPIENT,
    subject: `💼 وظائف الأسبوع — ${jobs.length} وظيفة متاحة`,
    html,
  });

  if (error) {
    console.error('JOBS_TEST_EMAIL_FAIL', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, sent: top.length, total: jobs.length });
}
