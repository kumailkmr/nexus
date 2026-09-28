'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { login } from '../actions'
import { Loader2 } from 'lucide-react'
import { AuthShell } from '@/components/ui/AuthShell'

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

type SignInValues = z.infer<typeof signInSchema>
type GuideState = 'idle' | 'pointing' | 'looking-email' | 'looking-password' | 'looking-button' | 'activating'

export default function SignInPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [robotState, setRobotState] = useState<GuideState>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true)
    setServerError(null)
    setRobotState('activating')
    
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    try {
      const result = await login(formData)
      if (result?.error) {
        setServerError(result.error)
        setRobotState('idle')
      }
      // If success, it redirects
    } catch (err) {
      setServerError('Connection interrupted. Please try again.')
      setRobotState('idle')
    } finally {
      setIsLoading(false)
    }
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
            SIGN IN TO NEXUS
          </h1>
          <p className="text-sm text-nexus-secondary-text">
            Access your creative workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nexus-primary mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              onFocus={() => setRobotState('looking-email')}
              onBlur={() => setRobotState('idle')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-nexus-border bg-white text-nexus-primary text-sm focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:border-transparent transition-all shadow-sm"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-nexus-primary">
                Password
              </label>
            </div>
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

          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {serverError}
            </div>
          )}

          <div className="flex items-center justify-end mt-1 mb-2">
            <Link 
              href="/initialize/reset-password" 
              className="text-xs font-medium text-nexus-blue hover:text-nexus-blue-hover transition-colors focus:outline-none"
              onMouseEnter={() => setRobotState('looking-button')}
              onMouseLeave={() => setRobotState('idle')}
            >
              FORGOT PASSWORD?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setRobotState('looking-button')}
            onMouseLeave={() => setRobotState('idle')}
            className="w-full flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(21,94,239,0.2)] hover:shadow-[0_6px_20px_rgba(21,94,239,0.3)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                AUTHENTICATING...
              </span>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>
      </div>
    </AuthShell>
  )
}
