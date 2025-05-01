"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("wayne.enterprises@gotham.com")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="flex w-full flex-col justify-between bg-white p-8 lg:w-1/2 lg:p-12">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black text-sm font-bold">
            NO
          </div>
          <span className="text-lg font-medium">NOIT</span>
        </div>

        {/* Texto principal */}
        <div className="mt-16 space-y-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            El Adulto Creativo es <br />
            el niño que sobrevivió.
          </h1>
          <p className="text-gray-700">¡Bienvenido de nuevo! Por favor inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-l-4 border-l-sky-400 bg-white pl-4 pr-10"
              />
              {isEmailValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-800">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white pl-4"
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
              <Label htmlFor="remember" className="text-sm font-normal text-gray-700">
                Recordarme
              </Label>
            </div>
            <a href="/forgot-password" className="text-sm text-gray-700 hover:underline">
              Olvidé mi contraseña
            </a>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <Button type="submit" className="w-1/2 bg-sky-400 hover:bg-sky-500">
              INICIAR SESIÓN
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-1/2 border-sky-400 text-sky-700 hover:bg-sky-50 hover:text-sky-600"
              onClick={() => (window.location.href = "/register")}
            >
              REGISTRARSE
            </Button>
          </div>
        </form>
      </div>

      {/* Términos y condiciones */}
      <div className="mt-8 text-xs text-gray-700">
        Al registrarte, aceptas nuestros{" "}
        <a href="/terms" className="text-sky-700 hover:underline">
          Términos y Condiciones
        </a>{" "}
        y{" "}
        <a href="/privacy" className="text-sky-700 hover:underline">
          Política de Privacidad
        </a>
        .
      </div>
    </div>
  )
}
