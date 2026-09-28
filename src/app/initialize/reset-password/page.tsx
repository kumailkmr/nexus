'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { resetPasswordRequest } from '../actions'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { AuthShell } from '@/components/ui/AuthShell'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true)
    setServerError(null)
    setIsSuccess(false)
    
    const formData = new FormData()
    formData.append('email', data.email)

    try {
      const result = await resetPasswordRequest(formData)
      if (result?.error) {
        setServerError(result.error)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            Password reset link sent
          </h1>
          <p className="text-sm text-nexus-secondary-text mb-8 leading-relaxed">
            Check your email. If an account exists for this email, you'll receive instructions to reset your password.
          </p>
          <Link 
            href="/initialize/sign-in"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-nexus-surface text-nexus-primary border border-nexus-border px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-nexus-primary focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell robotState="idle">
      <div className="p-8 w-full relative">
        <div className="absolute top-6 left-8 hidden lg:block">
           <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm overflow-hidden border border-nexus-border">
             <span className="text-transparent bg-clip-text bg-gradient-to-br from-nexus-blue to-nexus-blue-hover font-extrabold text-sm tracking-tighter">N</span>
           </div>
        </div>

        <div className="text-center mb-8 lg:mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-nexus-primary mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-nexus-secondary-text">
            Enter your NEXUS account email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-nexus-primary mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-nexus-border bg-white text-nexus-primary text-sm focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:border-transparent transition-all"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-nexus-blue hover:bg-nexus-blue-hover text-white px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all shadow-md shadow-nexus-blue/10 focus:outline-none focus:ring-2 focus:ring-nexus-blue focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              'SEND RESET LINK'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/initialize/sign-in" className="font-medium text-nexus-secondary-text hover:text-nexus-primary hover:underline focus:outline-none focus:ring-1 focus:ring-nexus-primary rounded transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}
