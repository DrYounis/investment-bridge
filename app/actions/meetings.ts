'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function scheduleMeeting(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const message = formData.get('message') as string;
    const preferredTime = formData.get('preferredTime') as string;

    const adminEmail = process.env.ADMIN_EMAIL || 'op.younis@gmail.com';

    try {
        const { error } = await resend.emails.send({
            from: 'Marfa.sa Meetings <onboarding@resend.dev>',
            to: adminEmail,
            subject: `New Investor Meeting Request: ${name}`,
            html: `
                <div style="font-family: sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: auto;">
                    <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">طلب اجتماع مستثمر جديد</h2>
                    <div style="margin-top: 20px;">
                        <p style="margin: 5px 0;"><strong>الاسم:</strong> ${name}</p>
                        <p style="margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>الشركة/الجهة:</strong> ${company}</p>
                        <p style="margin: 5px 0;"><strong>الوقت المفضل:</strong> ${preferredTime}</p>
                    </div>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                    <div>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;"><strong>الرسالة/الاهتمامات:</strong></p>
                        <p style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-style: italic;">${message || 'لا يوجد رسالة إضافية'}</p>
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">تم الإرسال من منصة مرفأ الاستثمارية</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Submission Error:', err);
        return { success: false, error: err.message || 'Failed to send meeting request.' };
    }
}
