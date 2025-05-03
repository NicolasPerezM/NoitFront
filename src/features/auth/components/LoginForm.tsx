// app/(auth)/LoginForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EmailInput } from "./EmailInput"
import { PasswordInput } from "./PasswordInput"
import { RememberMe } from "./RememberMe"
import { Header } from "./LoginHeader"
import { TermsFooter } from "./TermsFooter"
import { LoginTitle } from "./LoginTitle"
import { GoogleSignInButton } from "./GoogleSignInButton"


export default function LoginForm() {
  const [email, setEmail] = useState("ejemplo@noit.com")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleRegisterRedirect = () => {
    window.location.href = "/register"
  }

  return (
    
    <div className="relative flex flex-col justify-center w-full max-w-md p-8 bg-background rounded-lg overflow-hidden">
      <div className="gradient-top-left-primary" />
      <div className="relative z-10">
        <Header />
        <LoginTitle />
        <form className="space-y-4 w-full">
          <EmailInput email={email} setEmail={setEmail} isValid={isEmailValid} />
          <PasswordInput password={password} setPassword={setPassword} />
          <RememberMe rememberMe={rememberMe} setRememberMe={setRememberMe} />
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" className="w-full sm:w-1/2">
              INICIAR SESIÓN
            </Button>
            <Button type="button" variant="outline" className="w-full sm:w-1/2" onClick={handleRegisterRedirect}>
              REGISTRARSE
            </Button>
          </div>
        </form>
        <TermsFooter />
      </div>
    </div>
  )
}
