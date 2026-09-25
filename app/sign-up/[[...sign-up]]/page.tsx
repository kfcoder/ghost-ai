import type { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Sign up — Ghost AI",
  description: "Create a Ghost AI account.",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-6">
      <SignUp />
    </div>
  )
}
