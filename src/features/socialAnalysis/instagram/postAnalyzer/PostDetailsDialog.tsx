"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageCircle, Heart } from "lucide-react";

export default function PostDetailsDialog({ post }: { post: any }) {
  const postsImg = Array.from({ length: 9 }, (_, index) => ({
    id: index + 1,
    image: `/data/${
      index === 0
        ? "ad91b300ace666c49adef8b341594b9e.jpeg"
        : index === 1
        ? "3dc49cee2e13559e70a1edab1858771e.jpeg"
        : index === 2
        ? "5d8fb97a8ceb691cdbd926217c029701.jpeg"
        : index === 3
        ? "774a725701ce6eb078b4b3d1fe4c5348.jpeg"
        : index === 4
        ? "74829a8a5f44228a1c976b49dcde22ff.jpeg"
        : index === 5
        ? "c5213c928a54051921ce726817234f5d.jpeg"
        : index === 6
        ? "d03bdf0ae811eae983f8a39cecd86b8b.jpeg"
        : index === 7
        ? "dfc5895f5f6953cf95cf4fbc03333f36.jpeg"
        : index === 8
        ? "f178ff804ad9fcfe765c7d77e82151fc.jpeg"
        : "placeholder.svg"
    }`,
    likes: post.likesCount,
    comments: post.commentsCount,
  }));

  const [open, setOpen] = useState(false);

  const extractHashtags = (caption: string) => {
    const regex = /#\w+/g;
    return caption.match(regex) || [];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd MMM yyyy", { locale: es });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm cursor-pointer"
          onClick={() => setOpen(true)}
        >
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:w-[1000px] h-[500px] max-w-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Detalles del Post</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Publicado el {formatDate(post.timestamp)}
          </p>
        </DialogHeader>

        <Tabs defaultValue="detalles" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
          </TabsList>

          <TabsContent value="detalles" className="pt-4 space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/logo.jpg" alt="@infinitekparis_col" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none">
                  Infinitek Paris Colombia
                </p>
                <p className="text-sm text-muted-foreground">
                  @infinitekparis_col
                </p>
              </div>
            </div>

            <div className="border rounded-md p-4 space-y-2 bg-muted/40">
              <p className="font-semibold text-sm">Descripción</p>
              <p className="text-sm">{post.caption}</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {extractHashtags(post.caption).map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted px-2 py-0.5 rounded text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Heart className="w-5 h-5 text-red-500 mb-1" />
                <p className="font-semibold">{post.likesCount}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <MessageCircle className="w-5 h-5 text-blue-500 mb-1" />
                <p className="font-semibold">{post.commentsCount}</p>
                <p className="text-sm text-muted-foreground">Comentarios</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">Imágenes</p>
              <div className="grid grid-cols-2 gap-2">
                {postsImg.map((postImg, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={postImg.image}
                      alt={`Post ${postImg.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="comentarios" className="pt-4 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="border rounded-lg p-4 bg-muted/40">
                <p className="text-2xl font-semibold">
                  {post.latestComments?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Comentarios totales
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-muted/40">
                <p className="text-2xl font-semibold">
                  {post.latestComments?.reduce(
                    (acc, c) => acc + (c.repliesCount || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Respuestas</p>
              </div>
              <div className="border rounded-lg p-4 bg-muted/40">
                <p className="text-2xl font-semibold">
                  {post.latestComments?.reduce(
                    (acc, c) => acc + (c.likesCount || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Likes en comentarios
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {post.latestComments?.map((comment: any) => (
                <div
                  key={comment.id}
                  className="border rounded-md p-4 space-y-2 bg-background shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.ownerProfilePicUrl} />
                      <AvatarFallback>
                        {comment.ownerUsername[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {comment.ownerUsername}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.timestamp), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{comment.text}</p>
                  {comment.replies?.length > 0 && (
                    <div className="mt-2 pl-4 border-l text-sm space-y-2">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id}>
                          <span className="font-medium">
                            {reply.ownerUsername}
                          </span>
                          : {reply.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(!post.latestComments || post.latestComments.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Este post no tiene comentarios.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
