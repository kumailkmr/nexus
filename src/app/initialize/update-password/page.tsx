'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { updatePassword } from '../actions'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AuthShell } from '@/components/ui/AuthShell'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
type GuideState = 'idle' | 'pointing' | 'looking-email' | 'looking-password' | 'looking-button' | 'activating'

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingSession, setIsValidatingSession] = useState(true)
  const [isInvalidSession, setIsInvalidSession] = useState(false)
  const [robotState, setRobotState] = useState<GuideState>('idle')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsInvalidSession(true)
      }
      setIsValidatingSession(false)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true)
    setServerError(null)
    setRobotState('activating')
    
    const formData = new FormData()
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)

    try {
      const result = await updatePassword(formData)
      if (result?.error) {
        setServerError(result.error)
        setRobotState('idle')
      } else if (result?.success) {
        setIsSuccess(true)
        setRobotState('idle')
      }
    } catch (err) {
      setServerError('Unable to process the request. Please try again.')
      setRobotState('idle')
    } finally {
      setIsLoading(false)
    }
  }

  if (isInvalidSession) {
    return (
      <AuthShell robotState="idle">
        <div className="p-8 w-full flex flex-col items-center text-center relative">
          <div className="absolute top-6 left-8 hidden lg:block">
             <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden border border-nexus-border">
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-sm tracking-tighter">N</span>
             </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-nexus-primary mb-3 lg:mt-6">
            This password reset link is invalid or has expired.
          </h1>
          <Link 
            href="/initialize/reset-password"
            className="w-full mt-6 flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-md shadow-nexus-blue/10 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2"
          >
            REQUEST A NEW LINK
          </Link>
        </div>
      </AuthShell>
    )
  }

  if (isValidatingSession) {
    return (
      <AuthShell robotState="idle">
        <div className="p-8 w-full flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-6 h-6 animate-spin text-nexus-blue" />
        </div>
      </AuthShell>
    )
  }

  if (isSuccess) {
    return (
      <AuthShell robotState="idle">
        <div className="p-8 w-full flex flex-col items-center text-center relative">
          <div className="absolute top-6 left-8 hidden lg:block">
             <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden border border-nexus-border">
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-sm tracking-tighter">N</span>
             </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-nexus-primary mb-3 lg:mt-6">
            Password updated successfully.
          </h1>
          <Link 
            href="/initialize/sign-in"
            className="w-full mt-6 flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-md shadow-nexus-blue/10 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2"
          >
            SIGN IN TO NEXUS
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell robotState={robotState}>
      <div className="p-8 w-full relative">
        <div className="absolute top-6 left-8 hidden lg:block">
           <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden border border-nexus-border">
             <span className="text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-sm tracking-tighter">N</span>
           </div>
        </div>

        <div className="text-center mb-8 lg:mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-nexus-primary mb-2">
            Create a new password
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nexus-primary mb-1.5">
              New password
            </label>
            <input
              {...register('password')}
              onFocus={() => setRobotState('looking-password')}
              onBlur={() => setRobotState('idle')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-nexus-border bg-white text-nexus-primary text-sm focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nexus-primary mb-1.5">
              Confirm new password
            </label>
            <input
              {...register('confirmPassword')}
              onFocus={() => setRobotState('looking-password')}
              onBlur={() => setRobotState('idle')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-nexus-border bg-white text-nexus-primary text-sm focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setRobotState('looking-button')}
            onMouseLeave={() => setRobotState('idle')}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(21,94,239,0.2)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                UPDATING...
              </span>
            ) : (
              'UPDATE PASSWORD'
            )}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
