import { Show, UserButton } from "@clerk/nextjs"

/**
 * Session-aware part of the editor chrome.
 *
 * This is a Server Component on purpose. The chrome around it is a client
 * component, but Clerk Core 3 resolves sign-in state through `<Show>`, whose
 * implementation calls the `server-only` `auth()` helper — rendering it from a
 * client component would break the bundle boundary. The route renders this
 * component on the server and hands the result to the chrome as a slot, so the
 * chrome itself stays session-agnostic.
 */
function EditorUserMenu() {
  return (
    <Show when="signed-in">
      <UserButton />
    </Show>
  )
}

export { EditorUserMenu }
