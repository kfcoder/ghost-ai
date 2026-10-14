"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { PROJECT_SIDEBAR_ID } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  className?: string
}

function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  className,
}: EditorNavbarProps) {
  const SidebarToggleIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header
      data-slot="editor-navbar"
      className={cn(
        "flex h-14 shrink-0 items-center gap-4 border-b border-surface-border bg-surface px-3",
        className
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={
            isSidebarOpen ? "Hide projects sidebar" : "Show projects sidebar"
          }
          aria-expanded={isSidebarOpen}
          aria-controls={PROJECT_SIDEBAR_ID}
        >
          <SidebarToggleIcon className="size-5" />
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center" />

      <div className="flex flex-1 items-center justify-end" />
    </header>
  )
}

export { EditorNavbar }
export type { EditorNavbarProps }
