"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { cn } from "@/lib/utils"

interface EditorLayoutProps {
  children?: ReactNode
  className?: string
}

/**
 * Compose the editor chrome (navbar + floating project sidebar) with an
 * arbitrary content area. State is owned here so the navbar toggle and the
 * sidebar stay in sync.
 *
 * The container is `relative` so the sidebar's `absolute` positioning is
 * resolved against this shell rather than the viewport.
 */
function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div
      data-slot="editor-layout"
      className={cn(
        "relative flex h-screen flex-col overflow-hidden",
        className
      )}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <main className="flex-1 overflow-auto">{children}</main>

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  )
}

export { EditorLayout }
export type { EditorLayoutProps }