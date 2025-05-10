"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const PasswordInput = ({ password, setPassword }: any) => (
  <div className="space-y-2">
    <Label htmlFor="password" className="text-foreground">
      Contrasena
    </Label>
    <Input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="bg-background pl-4"
      placeholder="Ingresa tu contrasena"
    />
  </div>
)
