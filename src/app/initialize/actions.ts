'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Provide generic error rather than specifics
    return { error: 'The email or password is incorrect.' }
  }

  revalidatePath('/', 'layout')
  redirect('/app')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/initialize')
}

// Simple in-memory rate limiter for password resets
const resetRateLimit = new Map<string, { count: number, timestamp: number }>()
const MAX_REQUESTS = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function resetPasswordRequest(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) {
    return { error: 'Please enter your email address.' }
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase()
  
  // Rate limiting check
  const now = Date.now()
  const limitData = resetRateLimit.get(normalizedEmail)
  
  if (limitData) {
    if (now - limitData.timestamp < WINDOW_MS) {
      if (limitData.count >= MAX_REQUESTS) {
        return { error: 'Too many requests. Please try again later.' }
      }
      limitData.count += 1
    } else {
      // Reset window
      resetRateLimit.set(normalizedEmail, { count: 1, timestamp: now })
    }
  } else {
    resetRateLimit.set(normalizedEmail, { count: 1, timestamp: now })
  }

  // Check authorization
  const ownerEmail = (process.env.NEXUS_OWNER_EMAIL || '').trim().toLowerCase()
  if (!ownerEmail || normalizedEmail !== ownerEmail) {
    console.warn('PASSWORD_RESET_REJECTED: Unauthorized email attempt', normalizedEmail)
    return { error: 'Unauthorized password reset request.' }
  }

  console.log('PASSWORD_RESET_REQUESTED: Valid owner email', normalizedEmail)

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    // Need an absolute URL for redirect
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/initialize/update-password`,
  })

  if (error) {
    console.error('PASSWORD_RESET_FAILURE:', error)
    return { error: 'We couldn\'t process the password reset request. Please try again.' }
  }

  console.log('PASSWORD_RESET_TRIGGERED')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
