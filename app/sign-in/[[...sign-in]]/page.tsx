import type { Metadata } from "next"
import { SignIn } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Sign in — Ghost AI",
  description: "Sign in to your Ghost AI workspace.",
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-6">
      <SignIn />
    </div>
  )
}
