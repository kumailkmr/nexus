import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isInitializeRoute = request.nextUrl.pathname.startsWith('/initialize')
  const isAppRoute = request.nextUrl.pathname.startsWith('/app')

  // Not authenticated and trying to access /app -> redirect to sign in
  if (!user && isAppRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/initialize/sign-in'
    return NextResponse.redirect(url)
  }

  // Authenticated user logic
  if (user) {
    const emailConfirmed = user.email_confirmed_at != null
    const isVerifyRoute = request.nextUrl.pathname === '/initialize/verify'
    const isSignOutRoute = request.nextUrl.pathname === '/auth/sign-out'
    const isUpdatePasswordRoute = request.nextUrl.pathname === '/initialize/update-password'

    // If unverified and trying to access /app -> redirect to verify
    if (!emailConfirmed && isAppRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/initialize/verify'
      return NextResponse.redirect(url)
    }

    // If verified and trying to access /initialize (auth routes) -> redirect to /app
    if (emailConfirmed && isInitializeRoute && !isVerifyRoute && !isSignOutRoute && !isUpdatePasswordRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/app'
      return NextResponse.redirect(url)
    }
    
    // If unverified but trying to access /initialize (except verify) -> redirect to verify
    if (!emailConfirmed && isInitializeRoute && !isVerifyRoute && !isSignOutRoute && !isUpdatePasswordRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/initialize/verify'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
