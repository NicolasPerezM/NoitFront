"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("ejemplo@noit.com")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="flex justify-around border flex-col items-center bg-background p-8 lg:w-1/2 lg:p-12">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold">
            NO
          </div>
          <span className="text-lg font-medium text-foreground">NOIT</span>
        </div>

        {/* Texto principal */}
        <div className="mt-4 space-y-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl font-sora">
          Inicia sesión para explorar el posicionamiento de tu industria
          </h1>
          
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-l-4 border-l-primary bg-background pl-4 pr-10"
              />
              {isEmailValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background pl-4"
            />
          </div>

          {/* Recordarme y Olvidé mi contraseña */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Recordarme
              </Label>
            </div>
            <a href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
              Olvidé mi contraseña
            </a>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <Button type="submit" className="w-1/2">
              INICIAR SESIÓN
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-1/2"
              onClick={() => (window.location.href = "/register")}
            >
              REGISTRARSE
            </Button>
          </div>
        </form>
      </div>

      {/* Términos y condiciones */}
      <div className="mt-8 text-xs text-muted-foreground">
        Al registrarte, aceptas nuestros{" "}
        <a href="/terms" className="text-primary hover:underline">
          Términos y Condiciones
        </a>{" "}
        y{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Política de Privacidad
        </a>
        .
      </div>
    </div>
  )
}
