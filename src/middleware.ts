import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from "next-intl/middleware";
import { routing } from './lib/localization/routing';

const handleI18nRouting = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
  return handleI18nRouting(req);
})

export const config = {
  matcher: [
    // next intl
    '/', 
    '/(ar|en)/:path*',

    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}