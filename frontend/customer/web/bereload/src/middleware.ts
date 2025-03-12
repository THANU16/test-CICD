// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const fromSignIn = request.nextUrl.searchParams.get('from') === 'signin'

  // Define protected routes
  const authRoutes = ['/auth/signin/email', '/auth/signin/phone']

  // Check if the requested path is a protected route
  if (authRoutes.includes(path) && !fromSignIn) {
    // Redirect to the main sign-in page if trying to access auth routes directly
    // without the proper query parameter
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/auth/signin/:path*'
}