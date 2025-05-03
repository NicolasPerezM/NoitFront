"use client"

import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const EmailInput = ({ email, setEmail, isValid }: any) => (
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
        placeholder="Ingresa tu correo electrónico"
      />
      {isValid && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
          <Check className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  </div>
)
