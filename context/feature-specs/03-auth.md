Read `AGENTS.md` and `context/architecture-context.md` before starting.

We're adding authentication and route protection with Clerk.

Install `@clerk/nextjs`.

Wire Clerk into the app:

- create `proxy.ts` at the project root with `clerkMiddleware()` (Next.js 16 renamed Middleware to Proxy; `middleware.ts` is the pre-16 name)
- set the Clerk keys and redirect URLs in `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and both fallback redirect URLs)
- wrap the app in `<ClerkProvider>` in `app/layout.tsx`
- add the sign-in and sign-up routes as optional catch-all routes rendering the prebuilt `<SignIn />` / `<SignUp />` components
- theme Clerk's prebuilt UI with the Ghost AI palette

Requirements:

- Clerk versions in use are Core 3 (`@clerk/nextjs` 7.x); `SignedIn`, `SignedOut` and `Protect` no longer exist and `auth` is imported from `@clerk/nextjs/server`. Use `<Show when="signed-in" />` / `<Show when="signed-out" />` for conditional UI.
- `createRouteMatcher()` is deprecated and must not be used. Auth is enforced at the mutation boundary instead, per invariant 3 in `context/architecture-context.md`.
- The proxy must not perform route protection; it only makes the session available.
- Only authenticated users can reach protected routes.
- No hardcoded hex values in components — Clerk's `appearance` variables are the one exception, because Clerk injects them into its own components.

Not in scope for this unit (moved to `context/feature-specs/04-editor-shell.md`):

- mounting the editor chrome on a route and filling the navbar's right section
- project ownership and collaborator checks (they arrive with the projects feature)

### Check when done

- the sign-in and sign-up routes render and are reachable while signed out
- a signed-out visitor can sign in and is returned to the app
- Clerk's prebuilt components match the dark Ghost AI palette
- no TypeScript errors, no lint errors, build passes
