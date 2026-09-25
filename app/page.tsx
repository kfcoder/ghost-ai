import { auth } from "@clerk/nextjs/server"

import { EditorLayout } from "@/components/editor/editor-layout"
import { EditorUserMenu } from "@/components/editor/editor-user-menu"

export default async function Home() {
  // Gate the route: an unauthenticated visitor is redirected to the sign-in page with
  // `redirect_url` pointing back here, so signing in returns to the workspace
  // (observed: 307 -> /sign-in?redirect_url=http%3A%2F%2Fhost%2F). Clerk falls back to
  // a 404 only for requests it cannot classify as navigation or server actions.
  // This is route gating only — ownership and membership checks stay at the mutation
  // boundary (architecture-context.md, invariant 3) and are not inherited from here.
  await auth.protect()

  return (
    <EditorLayout rightSection={<EditorUserMenu />}>
      {/* Canvas surface. React Flow + Liveblocks arrive with the canvas feature. */}
      <div data-slot="editor-canvas" className="h-full w-full" />
    </EditorLayout>
  )
}
