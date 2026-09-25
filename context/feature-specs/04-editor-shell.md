Read `AGENTS.md` and `context/architecture-context.md` before starting.

We're mounting the editor chrome on a real route and putting the session UI into it.

### Editor shell route

Mount `EditorLayout` on `/`:

- the canvas slot stays empty until the canvas feature lands (React Flow + Liveblocks)
- the route requires a signed-in user
- an unauthenticated visitor must land on the sign-in page and come back to `/` after signing in

### Session UI in the chrome

- `EditorNavbar` accepts a `rightSection` slot and forwards it into its right section
- the chrome stays presentational: no Clerk import inside `editor-navbar.tsx` / `editor-layout.tsx`
- `EditorUserMenu` renders Clerk's `UserButton` inside `<Show when="signed-in" />`
- `EditorUserMenu` stays a Server Component: Clerk Core 3's `<Show>` calls the `server-only` `auth()` helper, so it cannot be rendered from a client component. The route renders it and hands it to the chrome as a slot.

### Check when done

- `npm run lint`, `tsc --noEmit` and `npm run build` pass
- `/` is dynamic, `/` redirects a signed-out visitor to `/sign-in?redirect_url=/`
- no server-only module reaches the client bundle
