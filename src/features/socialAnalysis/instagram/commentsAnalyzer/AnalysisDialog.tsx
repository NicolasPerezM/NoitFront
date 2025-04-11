"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function AnalysisPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Ver análisis a profundidad
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 shadow-xl" align="end">
        <div className="space-y-2 text-sm text-muted-foreground">
          <h4 className="text-base font-semibold text-foreground">Análisis de temas</h4>
          <p>
            Las palabras más comunes giran en torno a intención de compra, belleza, y testimonio.
          </p>
          <p>
            Temas como <strong>“precio”</strong>, <strong>“cómo comprar”</strong> y <strong>“regalo”</strong> se repiten con frecuencia.
          </p>
          <p>
            Esto sugiere un interés genuino en adquirir el producto y una percepción positiva de su propuesta estética. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus laudantium eligendi ad aspernatur adipisci, voluptatem debitis temporibus provident doloribus tempore obcaecati, in ipsum. Doloribus reprehenderit inventore, labore optio alias cumque, dolore pariatur voluptates aliquam dolorem, animi odit laudantium culpa illo rerum. Suscipit dolore nostrum distinctio nihil labore qui voluptas facere?
          </p>
          <p>
            Esto sugiere un interés genuino en adquirir el producto y una percepción positiva de su propuesta estética. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Natus laudantium eligendi ad aspernatur adipisci, voluptatem debitis temporibus provident doloribus tempore obcaecati, in ipsum. Doloribus reprehenderit inventore, labore optio alias cumque, dolore pariatur voluptates aliquam dolorem, animi odit laudantium culpa illo rerum. Suscipit dolore nostrum distinctio nihil labore qui voluptas facere?
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
