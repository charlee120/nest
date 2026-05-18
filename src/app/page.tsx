import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import LandingPage from './_components/LandingPage'

export const metadata: Metadata = {
  title: 'nest — you don\'t have to carry this alone',
  description: 'nest is a warm, private space for people navigating loneliness, breakups, anxiety, relationship struggles and the heavy in-between days.',
}

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <LandingPage isAuthenticated={!!user} />
}
