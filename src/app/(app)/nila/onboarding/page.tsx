import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NilaOnboarding from './_components/NilaOnboarding'

export const metadata = {
  title: 'Meet Nila — Nest',
}

export default async function NilaOnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('nila_onboarded, display_name, full_name')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.nila_onboarded) {
    redirect('/nila')
  }

  const displayName = profile?.display_name ?? profile?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'You'
  const initial = displayName[0]?.toUpperCase() ?? 'Y'

  return <NilaOnboarding userName={displayName} userInitial={initial} />
}
