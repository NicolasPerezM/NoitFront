"use client"

import { useState } from "react"
import {
  ChevronDown,
  RefreshCw,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Award,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Filter,
  BarChart2,
  Hash,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react"

export default function PostAnalyzer() {
  const [selectedAccount, setSelectedAccount] = useState("mi_cuenta")
  const [sortBy, setSortBy] = useState("date")

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
        sentiment: {
          positive: 65,
          neutral: 30,
          negative: 5,
        },
        trends: ["Preguntas sobre disponibilidad", "Comentarios sobre los colores", "Solicitudes de más información"],
        highlighted: [
          {
            text: "Me encanta la combinación de colores, ¿cuándo estará disponible?",
            sentiment: "positive",
            interactions: 12,
          },
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
        sentiment: {
          positive: 75,
          neutral: 20,
          negative: 5,
        },
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
      strengths: [
        "Excelente estrategia para generar comentarios",
        "Formato de encuesta efectivo",
        "Buena presentación de productos",
      ],
      improvements: ["Incluir más opciones", "Mostrar precios de cada modelo"],
      recommendations: [
        "Hacer encuestas semanales para mantener engagement",
        "Crear historias destacadas con los resultados",
        "Usar los comentarios para planificar futuro contenido",
      ],
      commentAnalysis: {
        sentiment: {
          positive: 80,
          neutral: 15,
          negative: 5,
        },
        trends: ["Preferencia por el modelo casual", "Preguntas sobre precios", "Solicitudes de más colores"],
        highlighted: [
          { text: "Me encanta el modelo casual, ¿viene en azul?", sentiment: "positive", interactions: 15 },
          { text: "Todos son geniales, pero el sport es mi favorito", sentiment: "positive", interactions: 12 },
          { text: "¿Podrían mostrar los precios? Es importante para decidir", sentiment: "neutral", interactions: 8 },
        ],
      },
    },
  ]

  // Calculate overall metrics
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0)
  const avgEngagement = (posts.reduce((sum, post) => sum + post.engagement, 0) / posts.length).toFixed(1)

  // Find best performing post
  const bestPost = posts.reduce((best, post) => (post.engagement > best.engagement ? post : best), posts[0])

  // Track active tab for each post
  const [activeTabs, setActiveTabs] = useState({})

  const setActiveTab = (postId, tab) => {
    setActiveTabs((prev) => ({
      ...prev,
      [postId]: tab,
    }))
  }

  const getActiveTab = (postId) => {
    return activeTabs[postId] || "analysis"
  }

  // Most used hashtags
  const hashtagCounts = {}
  posts.forEach((post) => {
    post.hashtags.forEach((tag) => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1
    })
  })

  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }))

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Post Analyzer</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de cada publicación</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Account Selector */}
          <div className="relative">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full sm:w-48 p-2 pl-3 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 p-2 pl-8 pr-10 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
        </div>
      </div>

      {/* General Analysis - Now at the top */}
      <div className="bg-dark-blue rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-theme-primary">Análisis General</h2>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-theme-blue p-4 rounded-lg">
            <div className="text-sm  mb-1">Total Likes</div>
            <div className="text-2xl font-bold text-theme-gray">{totalLikes}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm  mb-1">Total Comentarios</div>
            <div className="text-2xl font-bold text-gray-800">{totalComments}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total Compartidos</div>
            <div className="text-2xl font-bold text-gray-800">{totalShares}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Engagement Promedio</div>
            <div className="text-2xl font-bold text-gray-800">{avgEngagement}%</div>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Engagement Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              Engagement por Post
            </h3>
            <div className="h-48 relative">
              {/* Simple bar chart visualization */}
              <div className="absolute inset-0 flex items-end justify-around px-4">
                {posts.map((post, index) => (
                  <div key={index} className="flex flex-col items-center w-1/4">
                    <div
                      className="w-12 bg-primary rounded-t-md transition-all duration-500 ease-in-out"
                      style={{ height: `${post.engagement * 3}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 text-center">Post {index + 1}</div>
                    <div className="text-xs font-medium">{post.engagement}%</div>
                  </div>
                ))}
              </div>
              {/* Y-axis labels */}
              <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                <span>15%</span>
                <span>10%</span>
                <span>5%</span>
                <span>0%</span>
              </div>
            </div>
          </div>

          {/* Hashtag Usage Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Hash className="h-5 w-5 mr-2 text-primary" />
              Hashtags Más Utilizados
            </h3>
            <div className="h-48 relative">
              <div className="absolute inset-0 flex flex-col justify-around py-2">
                {topHashtags.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-xs text-gray-600">#{item.tag}</div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(item.count / posts.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-xs font-medium text-gray-700 text-right ml-2">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trends and Optimization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trends */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Tendencias Encontradas
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Los posts con formato de pregunta generan <span className="font-medium">3x más comentarios</span>{" "}
                    que los posts informativos.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    El mejor horario para publicar es entre <span className="font-medium">14:00-16:00</span>, con un
                    engagement promedio 25% mayor.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Posts que muestran el lado humano de la marca tienen un{" "}
                    <span className="font-medium">engagement 20% mayor</span> que los posts de solo producto.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    El post con mejor rendimiento fue{" "}
                    <span className="font-medium">"{bestPost.text.substring(0, 30)}..."</span> con {bestPost.engagement}
                    % de engagement.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              Sugerencias de Optimización
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Implementar una estrategia de <span className="font-medium">encuestas semanales</span> para aumentar
                    la participación de la audiencia.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Crear una serie de posts sobre <span className="font-medium">el proceso creativo</span> y el equipo
                    detrás de la marca.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Aumentar el uso de <span className="font-medium">hashtags relevantes</span> (5-7 por post) para
                    mejorar el alcance orgánico.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Programar publicaciones entre <span className="font-medium">14:00-16:00</span> para maximizar el
                    engagement.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                  <span>
                    Experimentar con <span className="font-medium">formatos de carrusel</span> para mostrar múltiples
                    ángulos de los productos.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Analysis with Tabs */}
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Post Image and Content */}
              <div className="md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={`Post ${post.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-gray-800">{post.text}</p>

                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag) => (
                      <span key={tag} className="text-primary text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{post.time}</span>
                  </div>

                  <div className="flex items-center space-x-4 pt-2">
                    <div className="flex items-center text-rose-500">
                      <Heart className="h-5 w-5 mr-1 fill-current" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center text-blue-500">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center text-green-500">
                      <Share2 className="h-5 w-5 mr-1" />
                      <span>{post.shares}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Analysis with Tabs */}
              <div className="md:w-2/3 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Análisis del Post</h3>
                  <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-medium">{post.engagement}% Engagement</span>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      getActiveTab(post.id) === "analysis"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(post.id, "analysis")}
                  >
                    Análisis del Post
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      getActiveTab(post.id) === "comments"
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(post.id, "comments")}
                  >
                    Análisis de Comentarios
                  </button>
                </div>

                {/* Tab Content */}
                {getActiveTab(post.id) === "analysis" ? (
                  // Post Analysis Tab
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fadeIn">
                    {/* Strengths */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center text-green-700 mb-2">
                        <Award className="h-5 w-5 mr-2" />
                        <h4 className="font-medium">Puntos Fuertes</h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1 pl-7 list-disc">
                        {post.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <div className="flex items-center text-amber-700 mb-2">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <h4 className="font-medium">Áreas de Mejora</h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1 pl-7 list-disc">
                        {post.improvements.map((improvement, index) => (
                          <li key={index}>{improvement}</li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center text-blue-700 mb-2">
                        <Lightbulb className="h-5 w-5 mr-2" />
                        <h4 className="font-medium">Recomendaciones AI</h4>
                      </div>
                      <ul className="text-sm text-gray-700 space-y-1 pl-7 list-disc">
                        {post.recommendations.map((recommendation, index) => (
                          <li key={index}>{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Comment Analysis Tab
                  <div className="animate-fadeIn">
                    {/* Sentiment Analysis */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Sentimiento de los Comentarios</h4>
                      <div className="flex items-center h-8 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${post.commentAnalysis.sentiment.positive}%` }}
                        >
                          {post.commentAnalysis.sentiment.positive}%
                        </div>
                        <div
                          className="h-full bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${post.commentAnalysis.sentiment.neutral}%` }}
                        >
                          {post.commentAnalysis.sentiment.neutral}%
                        </div>
                        <div
                          className="h-full bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: `${post.commentAnalysis.sentiment.negative}%` }}
                        >
                          {post.commentAnalysis.sentiment.negative}%
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span>Positivo</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                          <span>Neutral</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                          <span>Negativo</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment Trends */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Tendencias en Comentarios</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
                          {post.commentAnalysis.trends.map((trend, index) => (
                            <li key={index}>{trend}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Highlighted Comments */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Comentarios Destacados</h4>
                      <div className="space-y-3">
                        {post.commentAnalysis.highlighted.map((comment, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-l-4 ${
                              comment.sentiment === "positive"
                                ? "border-green-500 bg-green-50"
                                : comment.sentiment === "negative"
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-400 bg-gray-50"
                            }`}
                          >
                            <p className="text-sm text-gray-700">{comment.text}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center text-xs text-gray-500">
                                {comment.sentiment === "positive" ? (
                                  <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
                                ) : comment.sentiment === "negative" ? (
                                  <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
                                ) : (
                                  <MessageSquare className="h-3 w-3 mr-1 text-gray-500" />
                                )}
                                <span>{comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Heart className="h-3 w-3 mr-1" />
                                <span>{comment.interactions} interacciones</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



/*export default function PostAnalyzer() {

    const {data, loading, error} = useFetch('/data/infinitekparis_col_posts.json')
    return (
        <div><h1 className="text-3xl text-black">PostAnalyzer</h1>
            <ul>
            {error && <p>Error: {error.message}</p>}
            {loading && <p>Cargando...</p>}
            {data?.map((post) => (
                <li key={post.id}>{post.likesCount}</li>
            ))}
            </ul>
        </div>
    )
    
        
}*/