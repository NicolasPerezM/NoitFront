"use client"
import { useState } from "react"
import GeneralAnalysis from "./GeneralAnalysis"
import PostCard from "./PostCard"
import TabsInstagram from "../TabsInstagram"
import InstagramHeader from "../InstagramHeader"
import useFetchData from "../../../hooks/useFetch"
import Loader from "../../Loader"


// Página principal que orquesta el análisis de posts.
// Los datos se simulan aquí; en un entorno real se obtendrían de una API.
export default function PostAnalyzer() {
  const [selectedAccount, setSelectedAccount] = useState("mi_cuenta")
  const [sortBy, setSortBy] = useState("date")

  const {
      data: headerData,
      loading: headerLoading,
      error: headerError,
    } = useFetchData("/data/Processed_data_infinitekparis_col.json");

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError
  } = useFetchData("/data/instagram_statistics_infinitekparis_col.json")

  if (headerLoading || statsLoading)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loader
            size="lg"
            color="primary"
            text="Cargando..."
            fullScreen={false}
            speed="normal"
            logo={
              <img
                src="/data/661173d22e87885e52d592e7_Group 73.svg"
                alt="Logo"
                className="object-contain h-full w-full"
              />
            }
          />
        </div>
      );
    if(statsError) return <div>Error en stats: {statsError.message}</div>
    if(!statsData) return <div>No hay datos en stats</div>
    if (headerError) return <div>Error en header: {headerError.message}</div>
    if (!headerData) return <div>No hay datos de header disponibles</div>
  
    const accountData = headerData.UserInfo

  const accounts = [
    { id: "mi_cuenta", name: "Mi Cuenta" },
    { id: "cuenta2", name: "Cuenta 2" },
    { id: "cuenta3", name: "Cuenta 3" },
  ]

  const sortOptions = [
    { id: "date", name: "Fecha (más reciente)" },
    { id: "engagement", name: "Engagement (mayor)" },
    { id: "likes", name: "Likes (mayor)" },
  ]

  // Datos simulados para los posts.
  const posts = [
    {
      id: 1,
      image: "/placeholder.svg?height=500&width=500",
      text: "Descubre nuestra nueva colección de verano. Diseños frescos y colores vibrantes para esta temporada. #ModaVerano #NuevaColección",
      hashtags: ["ModaVerano", "NuevaColección"],
      date: "2023-06-15",
      time: "14:30",
      likes: 245,
      comments: 32,
      shares: 18,
      engagement: 8.2,
      strengths: ["Excelente composición visual", "Buena combinación de colores", "Llamada a la acción clara"],
      improvements: ["Usar más hashtags relevantes", "Incluir personas usando el producto"],
      recommendations: [
        "Publicar contenido similar entre 14:00-16:00",
        "Experimentar con carruseles para mostrar más productos",
        "Incluir preguntas para aumentar comentarios",
      ],
      commentAnalysis: {
        sentiment: { positive: 65, neutral: 30, negative: 5 },
        trends: ["Preguntas sobre disponibilidad", "Comentarios sobre los colores", "Solicitudes de más información"],
        highlighted: [
          { text: "Me encanta la combinación de colores, ¿cuándo estará disponible?", sentiment: "positive", interactions: 12 },
          { text: "Necesito esta colección en mi vida 😍", sentiment: "positive", interactions: 8 },
          { text: "Los precios son muy altos para la calidad", sentiment: "negative", interactions: 5 },
        ],
      },
    },
    {
      id: 2,
      image: "/placeholder.svg?height=500&width=500",
      text: "Nuestro equipo trabajando en el nuevo proyecto. La creatividad fluye cuando trabajamos juntos. #BehindTheScenes #TeamWork",
      hashtags: ["BehindTheScenes", "TeamWork"],
      date: "2023-06-10",
      time: "10:15",
      likes: 187,
      comments: 24,
      shares: 9,
      engagement: 6.1,
      strengths: ["Contenido auténtico de backstage", "Muestra el lado humano de la marca", "Buena narrativa"],
      improvements: ["Mejorar la iluminación", "Incluir más detalles sobre el proyecto"],
      recommendations: [
        "Crear una serie de posts sobre el proceso creativo",
        "Etiquetar a los miembros del equipo para ampliar alcance",
        "Compartir más contenido de este tipo los lunes",
      ],
      commentAnalysis: {
        sentiment: { positive: 75, neutral: 20, negative: 5 },
        trends: ["Preguntas sobre el equipo", "Interés en el proceso creativo", "Solicitudes de más contenido similar"],
        highlighted: [
          { text: "Me encanta ver el detrás de escenas, ¡sigan compartiendo!", sentiment: "positive", interactions: 9 },
          { text: "¿Cuántas personas trabajan en el equipo creativo?", sentiment: "neutral", interactions: 6 },
          { text: "La iluminación podría ser mejor, se ve un poco oscuro", sentiment: "negative", interactions: 3 },
        ],
      },
    },
    {
      id: 3,
      image: "/placeholder.svg?height=500&width=500",
      text: "¿Cuál es tu favorito? A. Modelo clásico B. Modelo sport C. Modelo casual. Déjanos saber en los comentarios. #Encuesta #TuOpinionCuenta",
      hashtags: ["Encuesta", "TuOpinionCuenta"],
      date: "2023-06-05",
      time: "18:45",
      likes: 312,
      comments: 78,
      shares: 14,
      engagement: 11.3,
      strengths: ["Excelente estrategia para generar comentarios", "Formato de encuesta efectivo", "Buena presentación de productos"],
      improvements: ["Incluir más opciones", "Mostrar precios de cada modelo"],
      recommendations: [
        "Hacer encuestas semanales para mantener engagement",
        "Crear historias destacadas con los resultados",
        "Usar los comentarios para planificar futuro contenido",
      ],
      commentAnalysis: {
        sentiment: { positive: 80, neutral: 15, negative: 5 },
        trends: ["Preferencia por el modelo casual", "Preguntas sobre precios", "Solicitudes de más colores"],
        highlighted: [
          { text: "Me encanta el modelo casual, ¿viene en azul?", sentiment: "positive", interactions: 15 },
          { text: "Todos son geniales, pero el sport es mi favorito", sentiment: "positive", interactions: 12 },
          { text: "¿Podrían mostrar los precios? Es importante para decidir", sentiment: "neutral", interactions: 8 },
        ],
      },
    },
  ]

  // Cálculo de métricas generales
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0)
  const avgEngagement = (posts.reduce((sum, post) => sum + post.engagement, 0) / posts.length).toFixed(1)
  const bestPost = posts.reduce((best, post) => (post.engagement > best.engagement ? post : best), posts[0])

  // Cálculo de hashtags más usados en todos los posts
  const hashtagCounts = {}
  posts.forEach((post) => {
    post.hashtags.forEach((tag) => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
    })
  })
  const topHashtags = Object.entries(hashtagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="mt-4">
        <InstagramHeader accountData={accountData}/>
        <TabsInstagram/>
        </div>
      <GeneralAnalysis
        posts={posts}
        totalLikes={statsData.total_likes}
        totalComments={statsData.total_comments}
        totalShares={totalShares}
        avgEngagement={statsData.avg_engagement_rate}
        topHashtags={topHashtags}
        bestPost={bestPost}
      />
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
