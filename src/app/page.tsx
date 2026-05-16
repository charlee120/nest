import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error && error.message !== 'Auth session missing!') {
    return <p>Connection failed: {error.message}</p>
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <p>✓ Supabase connected</p>
      <p>User: {user ? user.email : 'not signed in (expected)'}</p>
    </div>
  )
}