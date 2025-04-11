"use client"

import { useState, useMemo } from "react"
import {
  CalendarDays,
  Heart,
  MessageCircle,
  ImageIcon,
  PlaySquare,
  LayoutGrid,
  Eye,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import useFetchData from "../../../hooks/useFetch"
import Loader from "../../../components/common/Loader"
import PostDetailsDialog from "./postAnalyzer/PostDetailsDialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PostTable() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useFetchData("/data/infinitekparis_col_posts.json")

  const sortedPosts = useMemo(() => {
    if (!postData) return []
    return [...postData].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })
  }, [postData, sortOrder])

  const paginatedPosts = useMemo(() => {
    return sortedPosts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  }, [sortedPosts, currentPage])

  const totalPages = useMemo(() => {
    return Math.ceil(sortedPosts.length / pageSize)
  }, [sortedPosts])

  const getPostTypeInfo = (type: string) => {
    switch (type) {
      case "Image":
        return {
          label: "Imagen",
          icon: <ImageIcon className="w-4 h-4 text-muted-foreground" />,
        }
      case "Video":
        return {
          label: "Video",
          icon: <PlaySquare className="w-4 h-4 text-muted-foreground" />,
        }
      case "Sidecar":
        return {
          label: "Carrusel",
          icon: <LayoutGrid className="w-4 h-4 text-muted-foreground" />,
        }
      default:
        return { label: type, icon: null }
    }
  }

  if (postLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader size="lg" color="primary" />
      </div>
    )
  }

  if (postError) {
    return <div className="text-red-500">Error al cargar los datos</div>
  }

  if (!postData || postData.length === 0) {
    return <div className="text-gray-500">No hay datos disponibles</div>
  }

  return (
    <>
      {/* Orden por fecha */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar por fecha:</span>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="w-[160px] text-sm">
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Más reciente</SelectItem>
              <SelectItem value="asc">Más antigua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md">
        <Table className="min-w-[760px] border rounded-2xl shadow-md">
          <TableHeader>
            <TableRow className="bg-chart-2 font-sora">
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4 px-8">
                Tipo
              </TableHead>
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4 min-w-[200px] font-sora">
                Caption
              </TableHead>
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4">
                Likes
              </TableHead>
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4">
                Comentarios
              </TableHead>
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4">
                Fecha
              </TableHead>
              <TableHead className="uppercase tracking-wide text-xs sm:text-sm font-semibold text-muted-foreground py-4 text-right px-8">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPosts.map((post) => {
              const { label, icon } = getPostTypeInfo(post.type)
              return (
                <TableRow key={post.id}>
                  <TableCell className="text-sm font-medium px-8">
                    <div className="flex items-center gap-2">
                      {icon}
                      {label}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm">
                    {post.caption}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    <Heart className="inline w-4 h-4 mr-1" />
                    {post.likesCount}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    <MessageCircle className="inline w-4 h-4 mr-1" />
                    {post.commentsCount}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    <CalendarDays className="inline w-4 h-4 mr-1 text-muted-foreground" />
                    {format(new Date(post.timestamp), "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right px-4">
                    <PostDetailsDialog post={post}>
                      <Eye className="w-4 h-4 inline mr-1" />
                      Ver detalles
                    </PostDetailsDialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
