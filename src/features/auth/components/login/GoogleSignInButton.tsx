"use client"

import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export const GoogleSignInButton = () => {
  const handleGoogleLogin = () => {
    // Aquí puedes integrar tu lógica OAuth con NextAuth, Firebase, Supabase, etc.
    window.location.href = "/api/auth/google"
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleLogin}
    >
      <Chrome className="h-5 w-5" />
      Iniciar con Google
    </Button>
  )
}
