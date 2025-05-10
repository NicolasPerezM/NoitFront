"use client"
import logoLight from "@/assets/logos/logoLight.png"

export const Header = () => (
  <div className="flex w-full items-center gap-2 mb-8">
    <img src={logoLight.src} alt="Logo" className="w-32 h-auto" />
  </div>
)
