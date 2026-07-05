import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { recordSignal } from '@/lib/signals'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 })
    }

    const { profile } = await supabase
      .from('profiles')
      .select('user_type, role')
      .eq('id', user.id)
      .maybeSingle()
      .then(r => ({ profile: r.data }))

    const role = profile?.user_type || profile?.role
    if (role !== 'investor') {
      return NextResponse.json({ error: 'المستثمرون فقط يمكنهم إنشاء غرف الصفقات' }, { status: 403 })
    }

    const body = await req.json().catch(() => null)
    const entrepreneurId = body?.entrepreneur_id
    if (!entrepreneurId) {
      return NextResponse.json({ error: 'معرف رائد الأعمال مطلوب' }, { status: 400 })
    }

    const svc = createServiceClient()

    // Record interest signal + create deal room
    await recordSignal(svc, {
      entrepreneurId,
      investorId: user.id,
      signalType: 'interest',
    })

    const { data: room, error } = await svc
      .from('deal_rooms')
      .upsert(
        { entrepreneur_id: entrepreneurId, investor_id: user.id, status: 'pending' },
        { onConflict: 'entrepreneur_id,investor_id' }
      )
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: 'حدث خطأ في إنشاء الغرفة' }, { status: 500 })
    }

    return NextResponse.json({ room })
  } catch {
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}
