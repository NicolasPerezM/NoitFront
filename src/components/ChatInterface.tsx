"use client"

import type React from "react"

import { useState } from "react"
import { PaperclipIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "../components/ui/projectCard"

// Datos de ejemplo para los proyectos pasados
const pastProjects = [
  {
    id: 1,
    title: "Face It",
    description: "E-commerce para productos de skin care para hombres",
    date: "10 mayo, 2023",
  },
  {
    id: 2,
    title: "Life time ecommerce",
    description: "Servicio ecommerce para venta de productos",
    date: "22 junio, 2023",
  },
  {
    id: 3,
    title: "Plataforma educativa",
    description: "Cursos online para profesionales",
    date: "5 agosto, 2023",
  },
]

export function ChatInterface() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el mensaje al agente AI
    console.log("Mensaje enviado:", message)
    setMessage("")
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12 mt-4">
      {/* Texto de bienvenida */}
      <h1 className="text-4xl font-bold text-center tracking-tight font-sora">Descubre oportunidades para tu marca, ¿qué te gustaría explorar hoy?</h1>

      {/* Input para chatear */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: “Quiero lanzar una marca de skincare vegano”."
          className="pr-24 py-6 text-base bg-background border-border"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full h-9 w-9"
            aria-label="Adjuntar archivo"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" className="rounded-full h-9 w-9" aria-label="Enviar mensaje">
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Proyectos pasados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold font-sora">Recientes</h2>
          <Button variant="ghost" size="sm">
            Ver todos
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pastProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
