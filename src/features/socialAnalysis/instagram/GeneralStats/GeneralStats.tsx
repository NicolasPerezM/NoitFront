"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Comment {
  id: string
  username: string
  text: string
  avatar: string
}

interface PostMedia {
  id: string
  type: "image" | "video"
  url: string
  analysis: {
    engagement: string
    reach: string
    impressions: string
  }
}

interface Post {
  id: string
  username: string
  userAvatar: string
  caption: string
  captionAnalysis: {
    sentiment: string
    keywords: string[]
    engagement: string
  }
  media: PostMedia[]
  comments: Comment[]
  commentsAnalysis: {
    sentiment: string
    topThemes: string[]
    engagement: string
  }
}

// Sample data
const samplePost: Post = {
  id: "1",
  username: "username",
  userAvatar: "/mystical-forest-spirit.png",
  caption: "Este es un ejemplo de caption para un post de Instagram. #hashtag #marketing #socialmedia",
  captionAnalysis: {
    sentiment: "Positivo (85%)",
    keywords: ["hashtag", "marketing", "socialmedia"],
    engagement: "Alto - 3.2% por encima del promedio",
  },
  media: [
    {
      id: "1",
      type: "image",
      url: "/radiant-skin-essentials.png",
      analysis: {
        engagement: "4.5% (2.3% por encima del promedio)",
        reach: "15,000 usuarios",
        impressions: "18,500 impresiones",
      },
    },
    {
      id: "2",
      type: "image",
      url: "/shimmering-serum-closeup.png",
      analysis: {
        engagement: "3.8% (1.6% por encima del promedio)",
        reach: "12,000 usuarios",
        impressions: "14,200 impresiones",
      },
    },
  ],
  comments: [
    {
      id: "1",
      username: "usuario1",
      text: "Me encanta este producto! Lo uso todos los días.",
      avatar: "/elemental-bending.png",
    },
    {
      id: "2",
      username: "usuario2",
      text: "¿Dónde puedo comprarlo? Necesito probarlo!",
      avatar: "/bioluminescent-forest.png",
    },
    {
      id: "3",
      username: "usuario3",
      text: "Los resultados son increíbles, gracias por compartir!",
      avatar: "/diverse-group-meeting.png",
    },
  ],
  commentsAnalysis: {
    sentiment: "Muy positivo (92%)",
    topThemes: ["interés en compra", "satisfacción", "resultados"],
    engagement: "Alto - 5.1% tasa de respuesta",
  },
}

export default function InstagramPostAnalysis() {
  const [post] = useState<Post>(samplePost)

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="max-w-xl mx-auto">
        {/* Instagram Post Preview */}
        <div className="flex flex-col">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="p-3 border-b flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.userAvatar || "/placeholder.svg"} alt={post.username} />
                  <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{post.username}</span>
              </div>

              {/* Media Carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {post.media.map((media) => (
                    <CarouselItem key={media.id}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative">
                            <img
                              src={media.url || "/placeholder.svg"}
                              alt="Instagram post"
                              className="w-full aspect-square object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center">
                              <Button variant="secondary" className="bg-white/80 hover:bg-white/90">
                                Ver análisis de imagen
                              </Button>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Análisis de Imagen</DialogTitle>
                            <DialogDescription>
                              Métricas detalladas sobre el rendimiento de esta imagen
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <img
                              src={media.url || "/placeholder.svg"}
                              alt="Instagram post"
                              className="w-full max-h-[300px] object-contain mb-4"
                            />
                            <div className="grid gap-2">
                              <h3 className="font-semibold">Engagement:</h3>
                              <p className="text-gray-700">{media.analysis.engagement}</p>

                              <h3 className="font-semibold mt-2">Alcance:</h3>
                              <p className="text-gray-700">{media.analysis.reach}</p>

                              <h3 className="font-semibold mt-2">Impresiones:</h3>
                              <p className="text-gray-700">{media.analysis.impressions}</p>

                              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                <h3 className="font-semibold text-gray-800">Recomendaciones:</h3>
                                <ul className="list-disc pl-5 mt-2 text-gray-700">
                                  <li>Utiliza colores similares en futuros posts</li>
                                  <li>El formato cuadrado tiene mejor rendimiento</li>
                                  <li>La iluminación natural aumenta el engagement</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {post.media.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>

              {/* Caption */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="p-4">
                    <p className="text-sm mb-3">{post.caption}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver análisis de caption
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Análisis de Caption</DialogTitle>
                    <DialogDescription>Métricas detalladas sobre el rendimiento del texto</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-sm">{post.caption}</p>
                    </div>

                    <div className="grid gap-2">
                      <h3 className="font-semibold">Sentimiento:</h3>
                      <p className="text-gray-700">{post.captionAnalysis.sentiment}</p>

                      <h3 className="font-semibold mt-2">Palabras clave:</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.captionAnalysis.keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            #{keyword}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-semibold mt-2">Engagement:</h3>
                      <p className="text-gray-700">{post.captionAnalysis.engagement}</p>

                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h3 className="font-semibold text-gray-800">Recomendaciones:</h3>
                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                          <li>Incluye más llamadas a la acción</li>
                          <li>Utiliza entre 3-5 hashtags relevantes</li>
                          <li>Mantén la longitud entre 70-100 caracteres</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Comments */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments.length} comentarios</span>
                    </div>
                    {post.comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
                          <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-xs font-medium">{comment.username}</span>
                          <p className="text-xs">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Ver análisis de comentarios
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Análisis de Comentarios</DialogTitle>
                    <DialogDescription>Métricas detalladas sobre los comentarios del post</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="comments" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="comments">Comentarios</TabsTrigger>
                      <TabsTrigger value="analysis">Análisis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comments" className="max-h-[400px] overflow-y-auto">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2 p-3 border-b">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
                            <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-medium">{comment.username}</span>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="analysis">
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <h3 className="font-semibold">Sentimiento general:</h3>
                          <p className="text-gray-700">{post.commentsAnalysis.sentiment}</p>

                          <h3 className="font-semibold mt-2">Temas principales:</h3>
                          <div className="flex flex-wrap gap-2">
                            {post.commentsAnalysis.topThemes.map((theme, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                {theme}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-semibold mt-2">Engagement:</h3>
                          <p className="text-gray-700">{post.commentsAnalysis.engagement}</p>

                          <div className="mt-4 p-4 bg-gray-50 rounded-md">
                            <h3 className="font-semibold text-gray-800">Recomendaciones:</h3>
                            <ul className="list-disc pl-5 mt-2 text-gray-700">
                              <li>Responde a las preguntas sobre disponibilidad del producto</li>
                              <li>Agradece los comentarios positivos</li>
                              <li>Fomenta más interacción con preguntas abiertas</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
