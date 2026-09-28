import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { AppShell } from '@/components/app-shell/AppShell'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/initialize/sign-in')
  }

  return <AppShell user={user}>{children}</AppShell>
}
