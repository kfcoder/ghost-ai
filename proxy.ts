import { clerkMiddleware } from "@clerk/nextjs/server"

/**
 * Request interceptor for the whole app.
 *
 * Next.js 16 renamed Middleware to Proxy — `middleware.ts` is now `proxy.ts`.
 * The code is unchanged; only the filename differs. Clerk requires Next.js
 * 16.0.10+ for `@clerk/nextjs@7`, which is satisfied here.
 *
 * This proxy only makes the Clerk session available to the app. It deliberately
 * performs no route protection: `createRouteMatcher()` is deprecated in Clerk
 * Core 3 and route-level checks in the proxy are not a security boundary.
 * `context/architecture-context.md` (invariant 3) requires auth and ownership to
 * be enforced at every mutation boundary instead — i.e. inside the route
 * handlers and background tasks, next to the data they read or mutate.
 */
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
}
