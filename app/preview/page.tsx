import { EditorLayout } from "@/components/editor/editor-layout"

export default function PreviewPage() {
  return (
    <EditorLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-copy-primary">
          Canvas area
        </h1>
        <p className="mt-2 text-sm text-copy-secondary">
          This is where your editor content will render.
        </p>
      </div>
    </EditorLayout>
  )
}