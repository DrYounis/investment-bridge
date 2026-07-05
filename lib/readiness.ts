import 'server-only'
import { createServiceClient } from '@/lib/supabase/service'

export interface ReadinessBreakdown {
  team_score: number
  financials_score: number
  pitch_score: number
  traction_score: number
}

export interface ReadinessResult extends ReadinessBreakdown {
  total_score: number
  grade: 'A' | 'B' | 'C' | 'D'
}

function computeGrade(total: number): 'A' | 'B' | 'C' | 'D' {
  if (total >= 85) return 'A'
  if (total >= 70) return 'B'
  if (total >= 50) return 'C'
  return 'D'
}

export async function computeReadiness(userId: string): Promise<ReadinessResult> {
  const supabase = createServiceClient()

  // --- Team score (0–25): profile completeness ---
  let teamScore = 0
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, bio, company_description')
    .eq('id', userId)
    .maybeSingle()
  if (profile) {
    if (profile.full_name && profile.full_name.trim().length > 0) teamScore += 8
    if (profile.phone && profile.phone.trim().length > 0) teamScore += 8
    if ((profile.bio && profile.bio.trim().length > 0) || (profile.company_description && profile.company_description.trim().length > 0)) teamScore += 9
  }

  // --- Financials score (0–25): has_financial_projections flag ---
  let financialsScore = 0
  const { data: finProfile } = await supabase
    .from('profiles')
    .select('has_financial_projections')
    .eq('id', userId)
    .maybeSingle()
  if (finProfile?.has_financial_projections) financialsScore = 25

  // --- Pitch score (0–25): pitch deck uploaded + pitch audit exists ---
  let pitchScore = 0
  const { data: pitchDeck } = await supabase
    .from('pitch_decks')
    .select('id')
    .eq('owner_id', userId)
    .limit(1)
  if (pitchDeck && pitchDeck.length > 0) pitchScore += 15

  const { count: auditCount } = await supabase
    .from('pitch_audits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (auditCount && auditCount > 0) pitchScore += 10

  // --- Traction score (0–25): investor signals in last 30 days ---
  let tractionScore = 0
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const { count: signalCount } = await supabase
    .from('investor_signals')
    .select('*', { count: 'exact', head: true })
    .eq('entrepreneur_id', userId)
    .gte('created_at', thirtyDaysAgo)
  tractionScore = Math.min(25, (signalCount || 0) * 5)

  const total = teamScore + financialsScore + pitchScore + tractionScore

  return {
    total_score: Math.min(100, total),
    grade: computeGrade(total),
    team_score: teamScore,
    financials_score: financialsScore,
    pitch_score: pitchScore,
    traction_score: tractionScore,
  }
}

export async function computeAndUpsertReadiness(userId: string): Promise<ReadinessResult> {
  const supabase = createServiceClient()
  const result = await computeReadiness(userId)

  await supabase
    .from('readiness_scores')
    .upsert({
      user_id: userId,
      total_score: result.total_score,
      grade: result.grade,
      team_score: result.team_score,
      financials_score: result.financials_score,
      pitch_score: result.pitch_score,
      traction_score: result.traction_score,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  return result
}
