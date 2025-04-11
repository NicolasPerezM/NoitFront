"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function AnalysisDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Ver análisis a profundidad
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Análisis de temas</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Las palabras más comunes giran en torno a intención de compra, belleza, y testimonio.
          </p>
          <p>
            Temas como <strong>“precio”</strong>, <strong>“cómo comprar”</strong> y <strong>“regalo”</strong> se repiten con frecuencia.
          </p>
          <p>
            Esto sugiere un interés genuino en adquirir el producto y una percepción positiva de su propuesta estética. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, consequatur! Sit eum voluptatem ducimus natus alias ipsam nostrum nesciunt iusto minus ad aliquid illum vel iste soluta, doloribus incidunt. Maxime ut tempore, ducimus sequi laborum amet rem quas odio quos neque, nemo ratione facilis vero illo eaque facere? Sequi ipsam doloribus ea inventore delectus sint incidunt in nihil molestias debitis?
          </p>
          <p>
            Esto sugiere un interés genuino en adquirir el producto y una percepción positiva de su propuesta estética. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, consequatur! Sit eum voluptatem ducimus natus alias ipsam nostrum nesciunt iusto minus ad aliquid illum vel iste soluta, doloribus incidunt. Maxime ut tempore, ducimus sequi laborum amet rem quas odio quos neque, nemo ratione facilis vero illo eaque facere? Sequi ipsam doloribus ea inventore delectus sint incidunt in nihil molestias debitis?
          </p>
          <p>
            Esto sugiere un interés genuino en adquirir el producto y una percepción positiva de su propuesta estética. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim, consequatur! Sit eum voluptatem ducimus natus alias ipsam nostrum nesciunt iusto minus ad aliquid illum vel iste soluta, doloribus incidunt. Maxime ut tempore, ducimus sequi laborum amet rem quas odio quos neque, nemo ratione facilis vero illo eaque facere? Sequi ipsam doloribus ea inventore delectus sint incidunt in nihil molestias debitis?
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}