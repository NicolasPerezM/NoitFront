"use client"
import React, { useState } from "react"
import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react"

/**
 * PostCard – Renderiza la información de un post junto con el análisis detallado.
 * Gestiona internamente la pestaña activa ("analysis" o "comments") para cada post.
 */
export default function PostCard({ post }) {
  const [activeTab, setActiveTab] = useState("analysis")

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Sección de imagen y datos básicos */}
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

        {/* Sección de análisis con pestañas */}
        <div className="md:w-2/3 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Análisis del Post</h3>
            <div className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-medium">{post.engagement}% Engagement</span>
            </div>
          </div>
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "analysis"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              Análisis del Post
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "comments"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("comments")}
            >
              Análisis de Comentarios
            </button>
          </div>
          {activeTab === "analysis" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fadeIn">
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
            <div className="animate-fadeIn">
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
  )
}
