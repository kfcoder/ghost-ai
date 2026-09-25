# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- In progress

## Current Goal

- None — Feature 04 (editor shell on `/`) is complete and verified; the only unverified step is a real browser sign-in. Next: the canvas feature.

## Completed

- Feature 01: Design system and UI primitives.
  - shadcn/ui installed and configured (`components.json`, style `base-nova`, primitives on `@base-ui/react`).
  - UI primitives added in `components/ui/`: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. Generated files left unmodified after installation.
  - `lucide-react` installed and used (e.g. `XIcon` in `components/ui/dialog.tsx`).
  - `lib/utils.ts` exposes the reusable `cn()` helper for merging Tailwind classes.
  - Dark-only theme enforced: `dark` class applied on `<html>` in `app/layout.tsx`; no light mode is rendered.
  - Ghost AI palette from `context/ui-context.md` mapped in `app/globals.css` — raw custom properties plus `@theme inline` tokens: `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle`, `border-surface-border`, `border-surface-border-subtle`, `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `text-brand`, `bg-accent-dim`, `text-ai`, `text-ai-text`, `text-error`, `text-success`, `text-warning`.
  - Verified: `tsc --noEmit` exits 0; `npm run build` exits 0 (compiled successfully, 4/4 static pages).

- Feature 02: Editor chrome (`context/feature-specs/02-editor.md`).
  - `components/editor/editor-navbar.tsx` — fixed-height (`h-14`) navbar with left / center / right sections; the left section holds the sidebar toggle button (`PanelLeftOpen` when closed, `PanelLeftClose` when open, plus `aria-expanded` / `aria-controls`); the right section is intentionally empty for now; dark `bg-surface` with a subtle `border-b border-surface-border`.
  - `components/editor/project-sidebar.tsx` — floating sidebar that slides in from the left (`translate-x-0` / `-translate-x-full` with `duration-300`), positioned `absolute inset-y-0 left-0` so opening it overlays the canvas and never pushes page content; panel is `rounded-2xl`, semi-transparent (`bg-surface/80`) with `backdrop-blur-md` and a subtle border, inset by 0.75rem inside the sidebar track; header with `Projects` title and a close button; shadcn `Tabs` for `My Projects` / `Shared`, both rendering an empty placeholder state (icon, title, description); full-width `New Project` button with a `Plus` icon pinned to the bottom.
  - Collapsed state is inert (`inert` plus `pointer-events-none`) so the hidden sidebar cannot be focused or clicked.
  - `PROJECT_SIDEBAR_ID` is exported from the sidebar and imported by the navbar so the toggle button stays linked to the sidebar element.
  - Dialog pattern: the shadcn semantic tokens in `app/globals.css` are now mapped to the Ghost AI palette (`--popover` → `--bg-elevated`, `--card` → `--bg-surface`, `--muted` → `--bg-subtle`, `--border` → `--border-default`, `--input` → `--border-subtle`, `--ring` → `--accent-primary`, `--primary` → `--accent-primary`, …), so `Dialog` title, description and footer actions resolve to Ghost AI colors without overriding foundation components. No concrete dialogs were built.
  - Fixed the font token wiring: `--font-sans` referenced itself, so `html { font-family: var(--font-sans) }` was invalid and the loaded Geist fonts were never applied. `--font-sans` now maps to `--font-geist-sans` and `--font-mono` to `--font-geist-mono`.
  - Verified: `npm run lint` exits 0; `npm run build` exits 0 (compiled successfully, TypeScript clean, 4/4 static pages); prerendered HTML and emitted CSS inspected to confirm the chrome markup, the Ghost AI token wiring, and the dialog/tab styling.

- Feature 03: Authentication (`context/feature-specs/03-auth.md`).
  - `@clerk/nextjs@7.9.5` installed. This is Clerk Core 3, so the Core 2 API surface is gone: `SignedIn` / `SignedOut` / `Protect` were removed in Core 3 and now throw at render, replaced by `<Show when="signed-in" | "signed-out" | { role | permission | feature | plan } | (has) => boolean>` (with a `fallback` prop), and `auth` is only exported from `@clerk/nextjs/server` (the root import is typed `never`).
  - `proxy.ts` at the project root exports `clerkMiddleware()` from `@clerk/nextjs/server` with Clerk's documented matcher (skips `_next` and static files, always runs for `/api|trpc` and `/__clerk`). Next.js 16 renamed Middleware to Proxy, so the file is `proxy.ts`, not `middleware.ts`; the build reports it as `ƒ Proxy (Middleware)`.
  - The proxy performs no route protection: `createRouteMatcher()` is deprecated in Core 3 (it logs a runtime deprecation warning) and route-level checks in the proxy are not a security boundary. Protection stays resource-based, per invariant 3 in `context/architecture-context.md`.
  - `app/layout.tsx` renders `<ClerkProvider appearance={clerkAppearance}>` inside `<body>`; the dark-only `<html>` class list is untouched, so the theme contract in `context/ui-context.md` still holds.
  - `lib/clerk-appearance.ts` maps the Ghost AI palette onto Clerk's `appearance.variables` (`colorPrimary` `#00c8d4`, `colorBackground` `#111114`, `colorText` `#f0f0f4`, `colorTextSecondary` `#c0c0cc`, `borderRadius` `0.75rem`, `fontFamily`). Only variables that exist in the installed `@clerk/shared` are set, because `@clerk/ui` is not installed and `ClerkAppearanceTheme` therefore resolves to `any` — that prop cannot be type-checked.
  - `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` render the prebuilt `<SignIn />` / `<SignUp />` centred on `bg-base`, each with its own metadata.
  - `.env.local` holds the Clerk variables: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (real development keys, gitignored), plus `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `..._SIGN_UP_URL` and both fallback redirect URLs, so Clerk uses the local routes instead of the hosted Account Portal.
  - First verification, before the keys existed: `npm run lint` exit 0; `tsc --noEmit` exit 0; `npm run build` exit 0 using a well-formed *dummy* publishable key, which also proved Clerk needs no network access at build time (the frontend API domain is resolved in the browser). The dummy key was removed from `.env.local` straight afterwards.
  - Verified again with the real development keys (`pk_test_` / `sk_test_`, instance `whole-bluebird-4723`): `npm run build` exit 0 (`ƒ Proxy (Middleware)` + both catch-all routes), `next start` served `/` 200, `/sign-in` 200, `/sign-up` 200, the SSR payload points at `https://whole-bluebird-4723.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js` (followed redirect → 200, so the publishable key is live) and still carries the serialized Ghost AI `appearance` variables, and the secret key authenticated against `https://api.clerk.com/v1/users` (200, `[]` because the instance has no users yet).

- Feature 04: Editor shell mounted on `/` (`context/feature-specs/04-editor-shell.md`).
  - `app/page.tsx` is now an async Server Component: `await auth.protect()` then `<EditorLayout>`, with the canvas slot (`data-slot="editor-canvas"`) deliberately empty until the canvas feature lands. In the build output `/` moved from `○` (static) to `ƒ` (dynamic).
  - `EditorNavbar` gained a `rightSection` slot and `EditorLayout` forwards it, so the chrome still imports no Clerk code and stays presentational and session-agnostic.
  - `components/editor/editor-user-menu.tsx` is a Server Component rendering `<Show when="signed-in"><UserButton /></Show>`. It cannot live inside the client chrome: Core 3's `<Show>` calls the `server-only` `auth()` helper, so the route renders it on the server and hands it to the chrome as a slot element.
  - Verified: `npm run lint` 0; `tsc --noEmit` 0; `npm run build` 0 (TypeScript clean, `ƒ /`, `ƒ Proxy (Middleware)`). Against `next start`, the full unauthenticated chain was observed: `GET /` → 307 to Clerk's dev-browser handshake (`__clerk_hs_reason=dev-browser-missing`) → back to `/` with a `__clerk_db_jwt` cookie → 307 → `http://localhost:3100/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3100%2F` → 200, so signing in returns to the workspace. `.next/static` contains no `server-only` module while the client chunks do contain the `UserButton` UI.

## In Progress

- None.

## Next Up

- Sign in once from `/sign-in` in the browser to create the first user and confirm the chrome renders with the user menu. This is the last step that cannot be verified headlessly — the instance has zero users and the route is gated, so the signed-in markup never renders for curl.
- Replace the empty `data-slot="editor-canvas"` surface on `/` with the real canvas (React Flow + Liveblocks).
- The root layout still carries the scaffolder metadata (`title: "Create Next App"`); give the workspace real Ghost AI metadata.
- When the first real dialog is built, pass `className="rounded-3xl"` to `DialogContent`

## Open Questions

- None open. Resolved in Feature 04: the protected surface is `/` (the editor shell), so the `/preview` route floated by Feature 02 is no longer needed — the navbar and sidebar are now viewable at `/` once signed in.

## Architecture Decisions

- Dark-only theme: the app never renders a light mode, so the Ghost AI palette variables live in `:root` and the `dark` class is hardcoded on `<html>` rather than toggled at runtime.
- Editor chrome stays presentational: `EditorNavbar` receives `isSidebarOpen` / `onToggleSidebar` and `ProjectSidebar` receives `isOpen` / `onClose`, so the editor shell owns the state and the chrome can be reused by every editor screen.
- The project sidebar floats instead of reflowing: it is `absolute inset-y-0 left-0` inside a `relative` editor shell and animates with `transform`, so opening it overlays the canvas rather than pushing page content.
- Foundation components are never restyled to get the theme: `components/ui/*` stays untouched and the shadcn semantic tokens are re-pointed at the Ghost AI palette in `app/globals.css` instead. That is what makes `Dialog` (title, description, footer actions) and `Tabs` render on-brand.
- Modal radius: shadcn `DialogContent` ships `rounded-xl` while `context/ui-context.md` requires `rounded-3xl` for modals; dialogs override it at the call site with `className="rounded-3xl"`.
- Auth lives in `proxy.ts`, not `middleware.ts`: Next.js 16 renamed Middleware to Proxy, and Clerk needs no other change than the filename. The proxy only makes the session available — it never protects routes, because Clerk Core 3 deprecates `createRouteMatcher()` and `context/architecture-context.md` invariant 3 puts enforcement at the mutation boundary.
- Clerk's prebuilt UI is themed through `appearance.variables` in `lib/clerk-appearance.ts` rather than by restyling it, mirroring the rule that `components/ui/*` is never restyled: the values are the literal palette from `context/ui-context.md`. This is the one sanctioned place for hex values, because Clerk injects them into CSS custom properties of its own components rather than through Tailwind tokens.
- Clerk components stay unstyled/untouched and are mounted from route files (`app/sign-in/[[...sign-in]]/page.tsx`) instead of being wrapped in project components, so the auth routes have no UI layer of their own to maintain.
- `/` is the editor workspace shell and the app's single protected surface (`await auth.protect()` in `app/page.tsx`). This is route gating for navigation only, never the authorization boundary: ownership and membership checks stay next to the data they touch (invariant 3), so no route handler may assume the gate already ran for it.
- Session UI reaches the chrome as a slot (`rightSection`), it is not rendered inside it. The chrome is a client component and Core 3's `<Show>` is server-only, so the rule that follows is: everything under `components/editor/` stays presentational and session-agnostic, and anything that reads the session is rendered by a route (or another Server Component) and passed in.
- `EditorLayout`'s children are the canvas surface, so the canvas feature can mount React Flow + Liveblocks without touching the chrome — the same slot idea as `rightSection`.

## Session Notes

- `LayoutProps` / `PageProps` are global Next.js types generated into `.next/types`. Deleting `.next` makes `tsc --noEmit` fail with `Cannot find name 'LayoutProps'` until `next build` / `next dev` regenerates them — run a build before trusting a standalone `tsc` run.
- Font tokens were fixed in Feature 02: `--font-sans` used to reference itself (`var(--font-sans)`), which made `html { font-family: var(--font-sans) }` invalid at computed-value time and silently dropped the Geist fonts. `--font-sans` now maps to `--font-geist-sans` and `--font-mono` to `--font-geist-mono`.
- Rendering of the new chrome was verified by temporarily mounting both components in a throwaway `/preview` route, inspecting the prerendered HTML output, then deleting the route — the final build serves only `/` and `/_not-found`.
- `inert={!isOpen}` (React 19 supports the boolean `inert` attribute) keeps the collapsed sidebar out of the tab order, in addition to `pointer-events-none` for the mouse.
- VS Code reported 7 problems after Feature 02, none of them real in the sources. The 2 TypeScript `2307` errors point at `app/preview/page.tsx`, the throwaway verification route deleted before the Feature 02 commit: its editor tab stayed open, so the TS server keeps checking the orphaned buffer in an inferred project that does not apply the `@/*` path mapping from `tsconfig.json`, and reports both `@/components/editor/*` imports as missing even though `components/editor/editor-navbar.tsx` and `components/editor/project-sidebar.tsx` exist on disk. Evidence: `app/` contains only `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`; a scratch file importing both modules with the exact same specifiers type-checked clean (`tsc --noEmit` exit 0) and was then removed; `tsc --noEmit` and `npm run build` both exit 0, and neither `.next/types` nor `.next/dev/types` references the preview route. Remedy: close the stale `page.tsx` tab and answer "Don't Save" when VS Code offers to save it (or use View: Close All Editors + Don't Save), then run "Developer: Reload Window". A reload on its own is not enough: with hot exit VS Code restores the unsaved buffer of the deleted file, so the TS server keeps reporting on it. The other 5 warnings are `css(unknownAtRules)` for the Tailwind v4 directives `@custom-variant`, `@theme` and `@apply` in `app/globals.css`. The same stale-diagnostic effect appears for the throwaway `app/_ts-check/page.tsx` used as resolution proof while it existed; both sets disappear only once their tabs are released.
- The Tailwind v4 CSS warnings are handled with `.vscode/css-custom-data.json` (declares the Tailwind v4 at-rules for the built-in CSS language service) plus `css.customData` and `css.lint.unknownAtRules: "ignore"` in `.vscode/settings.json`: the custom data documents/completes the directives, and the lint override makes the false positives disappear deterministically. No Tailwind IntelliSense extension is installed in this VS Code, so `files.associations: { "*.css": "tailwindcss" }` is not an option.
- Do not put a `$schema` key in `.vscode/css-custom-data.json`: the remote schema URL cannot be loaded here and VS Code reports `json(65538) Unable to load schema`.
- There is no global `tsc` shim in this environment: run `node ./node_modules/typescript/bin/tsc --noEmit` (`npx tsc` fails with `tsc: not found`).
- Clerk Core 3 note: `@clerk/nextjs@7` requires Next.js 16.0.10+ (15.2.8+ on 15) and Node.js 20.9.0+; this project has Next 16.3.5 on Node 20.20.2.
- `@clerk/ui` is not installed, so `ClerkAppearanceTheme` resolves to `any` (`components.server.d.ts` types `appearance?: any`). A typo in `lib/clerk-appearance.ts` will not fail `tsc` — only keys that exist in the installed `@clerk/shared` build were used, and the serialized SSR payload was inspected to confirm they reach the client.
- Build verification without credentials: `next build` fails with `Missing publishableKey` when the key is absent, so the build was verified with a well-formed *dummy* test key (`pk_test_` + base64 of `ghost-ai-dev.clerk.accounts.dev$`) plus a dummy secret key in `.env.local`, after which the file was restored to empty placeholders. Clerk resolves the frontend API domain in the browser, so no network access is needed at build time. Do not leave a dummy key in `.env.local`: the app will load Clerk JS from a domain that does not exist. Those placeholders were later replaced by the real development keys, which is why the build and the runtime checks now run against `whole-bluebird-4723.clerk.accounts.dev`.
- The terminal in this environment intermittently fails to report command completion through shell integration, and starting a new foreground command can kill the previous one — `npm run lint` was even killed with SIGHUP once (exit 129), which is not a lint failure. Long-running verification must be fully detached (`setsid bash -c '… > /tmp/<name>.txt 2>&1' < /dev/null &`; plain `nohup … &` was not always enough) and then polled by reading the output file.
- `auth.protect()` in an App Router page does not behave the way `server/protect.d.ts` documents: the comment claims "protect() in pages throws a notFound error if signed out", but `protect.js` decides at runtime via `isPageRequest()` / `isServerActionRequest()`. Observed against `next start`, every unauthenticated variant tested (a document-like request with `Sec-Fetch-Dest: document`, a plain `Accept: */*` request, and a `Next-Action` request) answered 307 → `/sign-in?redirect_url=…`. Read the implementation, not the doc comment, when behaviour matters.
- A first visit to a development instance costs one extra redirect: `clerkMiddleware()` answers with the dev-browser handshake (`https://<instance>.clerk.accounts.dev/v1/client/handshake?…&__clerk_hs_reason=dev-browser-missing&format=nonce`), which sets `__clerk_db_jwt` and returns to the original URL. The complete unauthenticated chain for `/` is 4 redirects, ending at `200 /sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3100%2F`.
- The signed-in chrome cannot be checked with curl: `/` is gated and the Clerk instance still has no users, and forging a session cookie would create residue in the user's instance. The boundary was checked structurally instead (no `server-only` module in `.next/static`, `UserButton` UI present in a client chunk) and the real confirmation is the browser sign-in in Next Up.
- `next start` spawns a `next-server` child process: killing only the wrapper (e.g. `pkill -f 'next start -p 3100'`) leaves the child holding the port, and the next start fails with `EADDRINUSE`. Kill `next-server` itself and confirm the port is free.
- `.env.local` now holds the development keys of the `whole-bluebird-4723.clerk.accounts.dev` instance. Sign-in can be exercised in the browser from `/sign-in`; the instance still has zero users, so the first sign-up creates the first user.
