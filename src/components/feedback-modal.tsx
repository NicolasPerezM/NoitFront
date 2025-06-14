import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function FeedbackModal() {
  const [open, setOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el feedback
    console.log("Feedback enviado:", feedback);
    setOpen(false);
    setFeedback({ title: "", description: "" });
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton asChild size="sm">
                  <button>
                    <Send className="size-4" />
                    <span className="text-[14px]">Feedback</span>
                  </button>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="font-normal text-xl">Envíanos tu Feedback</DialogTitle>
                    <DialogDescription>
                      Tu opinión es importante para nosotros. Ayúdanos a mejorar.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="description" className="font-normal">Descripción</Label>
                      <Textarea
                        id="description"
                        value={feedback.description}
                        onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
                        placeholder="Cuéntanos más detalles..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Enviar Feedback</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
} 