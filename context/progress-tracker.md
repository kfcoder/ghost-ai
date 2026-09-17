# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- In progress

## Current Goal

- Install and configure the dark Ghost AI design system and its required shadcn/ui primitives.

## Completed

- Feature 01: Design system and UI primitives.
  - shadcn/ui installed and configured (`components.json`, style `base-nova`, primitives on `@base-ui/react`).
  - UI primitives added in `components/ui/`: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea. Generated files left unmodified after installation.
  - `lucide-react` installed and used (e.g. `XIcon` in `components/ui/dialog.tsx`).
  - `lib/utils.ts` exposes the reusable `cn()` helper for merging Tailwind classes.
  - Dark-only theme enforced: `dark` class applied on `<html>` in `app/layout.tsx`; no light mode is rendered.
  - Ghost AI palette from `context/ui-context.md` mapped in `app/globals.css` — raw custom properties plus `@theme inline` tokens: `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle`, `border-surface-border`, `border-surface-border-subtle`, `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `text-brand`, `bg-accent-dim`, `text-ai`, `text-ai-text`, `text-error`, `text-success`, `text-warning`.
  - Verified: `tsc --noEmit` exits 0; `npm run build` exits 0 (compiled successfully, 4/4 static pages).

## In Progress

- None.

## Next Up

- Add the next feature spec under `context/feature-specs/` and implement it.
- Optionally wire the shadcn semantic tokens (`--background`, `--card`, `--border`, `--popover`, `--ring`) to the Ghost AI palette so base shadcn components render with the custom colors by default.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Dark-only theme: the app never renders a light mode, so the Ghost AI palette variables live in `:root` and the `dark` class is hardcoded on `<html>` rather than toggled at runtime.

## Session Notes

- `LayoutProps` / `PageProps` are global Next.js types generated into `.next/types`. Deleting `.next` makes `tsc --noEmit` fail with `Cannot find name 'LayoutProps'` until `next build` / `next dev` regenerates them — run a build before trusting a standalone `tsc` run.
