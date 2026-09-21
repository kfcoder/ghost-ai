# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- In progress

## Current Goal

- None — Feature 02 (editor chrome) is complete. Next: add the following feature spec under `context/feature-specs/`.

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

## In Progress

- None.

## Next Up

- Add the next feature spec under `context/feature-specs/` and implement it.
- Compose the editor shell (route + layout) that owns the sidebar open/closed state and mounts the canvas between the navbar and the floating sidebar. The shell container must be `relative` for `ProjectSidebar` to overlay it.
- When the first real dialog is built, pass `className="rounded-3xl"` to `DialogContent` to match the modal radius defined in `context/ui-context.md`.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme: the app never renders a light mode, so the Ghost AI palette variables live in `:root` and the `dark` class is hardcoded on `<html>` rather than toggled at runtime.
- Editor chrome stays presentational: `EditorNavbar` receives `isSidebarOpen` / `onToggleSidebar` and `ProjectSidebar` receives `isOpen` / `onClose`, so the editor shell owns the state and the chrome can be reused by every editor screen.
- The project sidebar floats instead of reflowing: it is `absolute inset-y-0 left-0` inside a `relative` editor shell and animates with `transform`, so opening it overlays the canvas rather than pushing page content.
- Foundation components are never restyled to get the theme: `components/ui/*` stays untouched and the shadcn semantic tokens are re-pointed at the Ghost AI palette in `app/globals.css` instead. That is what makes `Dialog` (title, description, footer actions) and `Tabs` render on-brand.
- Modal radius: shadcn `DialogContent` ships `rounded-xl` while `context/ui-context.md` requires `rounded-3xl` for modals; dialogs override it at the call site with `className="rounded-3xl"`.

## Session Notes

- `LayoutProps` / `PageProps` are global Next.js types generated into `.next/types`. Deleting `.next` makes `tsc --noEmit` fail with `Cannot find name 'LayoutProps'` until `next build` / `next dev` regenerates them — run a build before trusting a standalone `tsc` run.
- Font tokens were fixed in Feature 02: `--font-sans` used to reference itself (`var(--font-sans)`), which made `html { font-family: var(--font-sans) }` invalid at computed-value time and silently dropped the Geist fonts. `--font-sans` now maps to `--font-geist-sans` and `--font-mono` to `--font-geist-mono`.
- Rendering of the new chrome was verified by temporarily mounting both components in a throwaway `/preview` route, inspecting the prerendered HTML output, then deleting the route — the final build serves only `/` and `/_not-found`.
- `inert={!isOpen}` (React 19 supports the boolean `inert` attribute) keeps the collapsed sidebar out of the tab order, in addition to `pointer-events-none` for the mouse.
- VS Code reported 7 problems after Feature 02, none of them real in the sources. The 2 TypeScript `2307` errors point at `app/preview/page.tsx`, the throwaway verification route deleted before the Feature 02 commit: its editor tab stayed open, so the TS server keeps checking the orphaned buffer in an inferred project that does not apply the `@/*` path mapping from `tsconfig.json`, and reports both `@/components/editor/*` imports as missing even though `components/editor/editor-navbar.tsx` and `components/editor/project-sidebar.tsx` exist on disk. Evidence: `app/` contains only `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`; a scratch file importing both modules with the exact same specifiers type-checked clean (`tsc --noEmit` exit 0) and was then removed; `tsc --noEmit` and `npm run build` both exit 0, and neither `.next/types` nor `.next/dev/types` references the preview route. Remedy: close the stale `page.tsx` tab (or run "Developer: Reload Window" / "TypeScript: Restart TS Server"). The other 5 warnings are `css(unknownAtRules)` for the Tailwind v4 directives `@custom-variant`, `@theme` and `@apply` in `app/globals.css`.
- The Tailwind v4 CSS warnings are handled with `.vscode/settings.json` (`css.customData`) + `.vscode/css-custom-data.json`, which teach the built-in CSS language service the Tailwind v4 at-rules. This keeps `unknownAtRules` active for real typos instead of disabling the check; apply it with "Developer: Reload Window".
- There is no global `tsc` shim in this environment: run `node ./node_modules/typescript/bin/tsc --noEmit` (`npx tsc` fails with `tsc: not found`).
