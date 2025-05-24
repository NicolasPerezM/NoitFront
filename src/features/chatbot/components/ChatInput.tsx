// src/components/ChatInput.tsx (o la ruta que corresponda)
import { PaperclipIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: () => void; // Cambiado: onSubmit no necesita el mensaje, ya lo tiene del estado padre
  isSending: boolean; // Para deshabilitar controles mientras se envía
  isFirstMessage?: boolean;
}

export function ChatInput({
  message,
  onMessageChange,
  onSubmit,
  isSending,
  isFirstMessage = true,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return; // No enviar si está vacío o ya se está enviando
    onSubmit(); // Llama a la función onSubmit del padre
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Input
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder={isFirstMessage ? 'Ej: "Quiero lanzar una marca de skincare vegano"' : ""}
        className="pr-24 py-6 text-small bg-background border-border"
        disabled={isSending}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full h-9 w-9"
          aria-label="Adjuntar archivo"
          disabled={isSending}
        >
          <PaperclipIcon className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="rounded-full h-9 w-9"
          aria-label="Enviar mensaje"
          disabled={isSending || !message.trim()}
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}