'use client'

import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function VerifyEmailPage() {
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const supabase = createClient()

  const handleResend = async () => {
    setResendStatus('loading')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user?.email) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`
        }
      })
      if (error) {
        setResendStatus('error')
      } else {
        setResendStatus('success')
      }
    } else {
      setResendStatus('error')
    }
  }

  return (
    <div className="p-8 w-full flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-nexus-blue/10 rounded-full flex items-center justify-center mb-6">
        <Mail className="w-8 h-8 text-nexus-blue" />
      </div>
      
      <h1 className="text-2xl font-bold tracking-tight text-nexus-primary mb-3">
        Verify your email
      </h1>
      <p className="text-sm text-nexus-secondary-text mb-8 leading-relaxed">
        We've sent a verification link to your email address. Please click the link to verify your account and access NEXUS.
      </p>

      {resendStatus === 'success' && (
        <div className="w-full p-3 mb-6 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">
          Verification email sent.
        </div>
      )}

      {resendStatus === 'error' && (
        <div className="w-full p-3 mb-6 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={resendStatus === 'loading' || resendStatus === 'success'}
        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-nexus-surface text-nexus-primary border border-nexus-border px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-nexus-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {resendStatus === 'loading' ? 'Sending...' : 'Resend Verification'}
      </button>

      <Link 
        href="/app"
        className="text-sm text-nexus-blue hover:underline font-medium"
      >
        I have verified my email
      </Link>
    </div>
  )
}
