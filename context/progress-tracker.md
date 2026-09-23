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

- Feature 03: Editor shell composition + `/preview` route.
  - `components/editor/editor-layout.tsx` — owns the shared `isSidebarOpen` state and composes `EditorNavbar` (`isSidebarOpen` / `onToggleSidebar`), a `<main>` content area for the canvas, and `ProjectSidebar` (`isOpen` / `onClose`); the container is `relative flex h-screen flex-col overflow-hidden` so the floating sidebar resolves against the shell instead of the viewport. Accepts optional `children` and `className`, merged with `cn()`.
  - `app/preview/page.tsx` — thin server route that mounts `EditorLayout` around a temporary "Canvas area" placeholder so the chrome is viewable at `/preview` in the browser.
  - Verified: `node ./node_modules/typescript/bin/tsc --noEmit` exit 0; `npm run lint` clean; `npm run build` exit 0 (5/5 static pages: `/`, `/_not-found`, `/preview`).

## In Progress

- None.

## Next Up

- Add the next feature spec under `context/feature-specs/` and implement it.
- Replace the `/preview` placeholder content with the real editor surface (canvas + toolbar) once the canvas feature is specified.
- When the first real dialog is built, pass `className="rounded-3xl"` to `DialogContent` to match the modal radius defined in `context/ui-context.md`.

## Open Questions

- **Resolved:** the `/preview` route for the editor chrome lives in the repo — `app/preview/page.tsx` mounts `EditorLayout` around a "Canvas area" placeholder, so the navbar + sidebar are viewable in the browser at `/preview`. `npm run lint` and `tsc --noEmit` are clean with it, so it does not reintroduce the `ts(2307)` noise.

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
- VS Code reported 7 problems after Feature 02, none of them real in the sources. The 2 TypeScript `2307` errors point at `app/preview/page.tsx`, the throwaway verification route deleted before the Feature 02 commit: its editor tab stayed open, so the TS server keeps checking the orphaned buffer in an inferred project that does not apply the `@/*` path mapping from `tsconfig.json`, and reports both `@/components/editor/*` imports as missing even though `components/editor/editor-navbar.tsx` and `components/editor/project-sidebar.tsx` exist on disk. Evidence: `app/` contains only `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`; a scratch file importing both modules with the exact same specifiers type-checked clean (`tsc --noEmit` exit 0) and was then removed; `tsc --noEmit` and `npm run build` both exit 0, and neither `.next/types` nor `.next/dev/types` references the preview route. Remedy: close the stale `page.tsx` tab and answer "Don't Save" when VS Code offers to save it (or use View: Close All Editors + Don't Save), then run "Developer: Reload Window". A reload on its own is not enough: with hot exit VS Code restores the unsaved buffer of the deleted file, so the TS server keeps reporting on it. The other 5 warnings are `css(unknownAtRules)` for the Tailwind v4 directives `@custom-variant`, `@theme` and `@apply` in `app/globals.css`. The same stale-diagnostic effect appears for the throwaway `app/_ts-check/page.tsx` used as resolution proof while it existed; both sets disappear only once their tabs are released.
- The Tailwind v4 CSS warnings are handled with `.vscode/css-custom-data.json` (declares the Tailwind v4 at-rules for the built-in CSS language service) plus `css.customData` and `css.lint.unknownAtRules: "ignore"` in `.vscode/settings.json`: the custom data documents/completes the directives, and the lint override makes the false positives disappear deterministically. No Tailwind IntelliSense extension is installed in this VS Code, so `files.associations: { "*.css": "tailwindcss" }` is not an option.
- Do not put a `$schema` key in `.vscode/css-custom-data.json`: the remote schema URL cannot be loaded here and VS Code reports `json(65538) Unable to load schema`.
- There is no global `tsc` shim in this environment: run `node ./node_modules/typescript/bin/tsc --noEmit` (`npx tsc` fails with `tsc: not found`).
- Correction to the `app/preview` account above: it is no longer true that `app/` contains only `favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`, nor that the build serves only `/` and `/_not-found`. `app/preview/page.tsx` is on disk (untracked, dated 2026-09-21 19:54) and imports `@/components/editor/editor-layout`, a component that **is** committed in `c14b327`, so the throwaway route was recreated as a real one. Re-verified on this exact tree: `node ./node_modules/typescript/bin/tsc --noEmit` exit 0; `npm run lint` clean (no output); `npm run build` exit 0 — `✓ Compiled successfully in 2.7min`, `Finished TypeScript in 10.8s`, `Generating static pages (5/5)`, routes `/`, `/_not-found`, `/preview`. That open git decision was taken positively: `app/preview/page.tsx` is tracked as of this commit. Note that `next build` is expensive here: 7.5 GiB RAM with ~1.9 GiB of swap already in use on a rotational disk stretched compilation to 2.7 min at load average ~15.
- Shell startup made cheap to fix the VS Code "Unable to resolve your shell environment in a reasonable time" error (VS Code 1.138.0, `application.shellEnvironmentResolutionTimeout` default **10 s**). VS Code resolves the terminal/agent-host environment by running an **interactive login shell**, so `~/.bashrc` ran on every resolution. Measured cost of the old `~/.bashrc` (warm): `~/.nvm/nvm.sh` 1.46 s + `~/.nvm/bash_completion` 0.48 s + the `conda shell.bash hook` block 1.85 s (it spawns python through `$CONDA_EXE`) ≈ 3.8 s, i.e. 4.40 s for a full interactive shell. On this machine (`/dev/sda` is a rotational 1.8 TB HDD, 7.5 GiB RAM with 1.8 GiB swap in use, load average >15) that warm 4.4 s stretched past the 10 s budget, which is why every session logs `Unable to resolve your shell environment` in `~/.config/Code/logs/<session>/main.log` (verified in the 16:22 and 18:21 sessions) and why the same log fills up with `No ptyHost heartbeat after 6 seconds`. Fix in `~/.bashrc` (backup: `~/.bashrc.bak-pre-shellfix`): (1) the `conda initialize` block now sources `~/miniconda3/etc/profile.d/conda.sh` instead of evaluating `conda shell.bash hook` — `conda.sh` defines the same `conda` shell function and adds the same `<root>/condabin` PATH entry at 0.058 s instead of 1.851 s, and base stays non-automatically-activated as before; (2) the nvm block is now lazy — the default node bin (`~/.nvm/versions/node/*/bin`, newest via `sort -V`) is prepended to PATH directly so `node`/`npm`/`npx` keep working in interactive shells, non-interactive shells and VS Code tasks, while `nvm.sh` + `bash_completion` are sourced from an `nvm()` stub on first use so `nvm use` / `nvm install` / completions still work. Result: interactive shell 4.398 s → 0.118 s, login+interactive 0.992 s; verified `bash -n ~/.bashrc` clean, `conda activate base` → `CONDA_DEFAULT_ENV=base` / `CONDA_PREFIX=/home/kfw/miniconda3` and `conda deactivate` back to empty, `nvm use 20` → `Now using node v20.20.2`, `node -v` v20.20.2 and `npm`/`conda` resolvable from a plain `bash -lc`. As headroom on this loaded HDD, user settings now also set `application.shellEnvironmentResolutionTimeout: 30` — an application-scope setting, so it needs a full VS Code restart. Measure shell startup through a pty (`script -qec 'bash -i -c exit' /dev/null`); plain `bash -i` without a tty stalls on job control.
- Seeing the editor chrome locally: `npm run dev` then open `http://localhost:3000/preview` (`app/preview/page.tsx` mounts `EditorLayout`). The route is prerendered by `next build` too, so `/preview` works from a plain `next start` as well; use `curl -sI http://localhost:3000/preview` to confirm a `200 OK` without a browser.

