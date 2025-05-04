import { PaperclipIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  message: string
  onMessageChange: (value: string) => void
  onSubmit: (message: string) => void
}

export function ChatInput({ message, onMessageChange, onSubmit }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(message)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Ej: “Quiero lanzar una marca de skincare vegano”."
        className="pr-24 py-6 text-small bg-background border-border"
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
  )
}
