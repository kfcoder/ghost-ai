/**
 * Ghost AI theme for Clerk's prebuilt components (`<SignIn />`, `<SignUp />`,
 * `<UserButton />`, …).
 *
 * Clerk injects these values as CSS custom properties inside its own components,
 * so they cannot be Tailwind utilities. They are the literal values of the
 * palette documented in `context/ui-context.md` / `app/globals.css`, kept here
 * so the mapping is defined once and reused by every Clerk surface.
 *
 * Only appearance variables that exist in the installed `@clerk/shared` version
 * are set — the keys are not type-checked because `ClerkAppearanceTheme`
 * resolves to `any` unless `@clerk/ui` augments it, which it does not here.
 */
const clerkAppearance = {
  variables: {
    colorPrimary: "#00c8d4", // --accent-primary
    colorBackground: "#111114", // --bg-surface
    colorText: "#f0f0f4", // --text-primary
    colorTextSecondary: "#c0c0cc", // --text-secondary
    borderRadius: "0.75rem", // rounded-xl, the small-element radius
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
} as const

export { clerkAppearance }
