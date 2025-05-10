"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export const RememberMe = ({ rememberMe, setRememberMe }: any) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
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
      Olvide mi contraseña
    </a>
  </div>
)
