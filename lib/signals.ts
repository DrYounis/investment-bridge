import 'server-only'

export type SignalType = 'profile_view' | 'deck_download' | 'interest' | 'sector_view'

export async function recordSignal(
  supabase: any,
  params: { entrepreneurId: string; investorId: string; signalType: SignalType; sector?: string }
) {
  const { error } = await supabase
    .from('investor_signals')
    .insert({
      entrepreneur_id: params.entrepreneurId,
      investor_id: params.investorId,
      signal_type: params.signalType,
      sector: params.sector || null,
    })

  if (error) {
    // Don't throw — signals are fire-and-forget
    console.error('Failed to record signal:', error)
  }
}
