"use client"

import { FolderIcon, Plus, UsersIcon, XIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/** Shared with `EditorNavbar` so the toggle button can reference the sidebar. */
const PROJECT_SIDEBAR_ID = "project-sidebar"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

function ProjectListEmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-surface-border bg-elevated text-copy-faint">
        <Icon className="size-8" />
      </div>
      <p className="text-sm font-medium text-copy-secondary">{title}</p>
      <p className="text-xs text-copy-muted">{description}</p>
    </div>
  )
}

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

function ProjectSidebar({ isOpen, onClose, className }: ProjectSidebarProps) {
  return (
    <aside
      id={PROJECT_SIDEBAR_ID}
      aria-label="Projects"
      inert={!isOpen}
      className={cn(
        "absolute inset-y-0 left-0 z-40 w-72 transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "pointer-events-none -translate-x-full",
        className
      )}
    >
      <div className="absolute inset-3 flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-surface-border px-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close projects sidebar"
          >
            <XIcon />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="min-h-0 flex-1 p-3">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects">
            <ProjectListEmptyState
              icon={FolderIcon}
              title="No projects yet"
              description="Create a project to start designing a system."
            />
          </TabsContent>

          <TabsContent value="shared">
            <ProjectListEmptyState
              icon={UsersIcon}
              title="Nothing shared with you"
              description="Projects shared by collaborators will appear here."
            />
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button className="w-full">
            <Plus data-icon="inline-start" />
            New Project
          </Button>
        </div>
      </div>
    </aside>
  )
}

export { ProjectSidebar, PROJECT_SIDEBAR_ID }
export type { ProjectSidebarProps }
