"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { RememberMe } from "./RememberMe";
import { Header } from "./LoginHeader";
import { TermsFooter } from "./TermsFooter";
import { LoginTitle } from "./LoginTitle";
import { GoogleSignInButton } from "./GoogleSignInButton";

export default function LoginForm() {
  const [email, setEmail] = useState("ejemplo@noit.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Error al iniciar sesión");
      }
  
      // Redirigir al dashboard si el login fue exitoso
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-[500px] w-full max-w-[95%] md:max-w-md mx-auto justify-between p-4 sm:p-6 md:p-8 bg-background rounded-lg my-4 sm:my-6 md:my-auto font-montreal">
      <div className="gradient-top-left-primary" />
      <div className="relative z-10 flex flex-col justify-between w-full h-full gap-6">
        <div className="flex flex-col gap-4">
          <Header />
          <LoginTitle />
        </div>
        <form
          className="flex flex-col gap-6 md:gap-8 w-full"
          onSubmit={handleLogin}
        >
          <EmailInput
            email={email}
            setEmail={setEmail}
            isValid={isEmailValid}
          />
          <PasswordInput password={password} setPassword={setPassword} />
          <RememberMe rememberMe={rememberMe} setRememberMe={setRememberMe} />

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <div className="flex flex-col gap-3 sm:gap-4">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "INICIAR SESIÓN"}
            </Button>
            <a href="/register">
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm sm:text-base"
              >
                REGISTRARSE
              </Button>
            </a>
          </div>

          <div className="relative flex items-center justify-center w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative z-10 bg-background px-4 text-sm text-muted-foreground">
              o
            </div>
          </div>

          <GoogleSignInButton />
        </form>
        <TermsFooter />
      </div>
    </div>
  );
}
