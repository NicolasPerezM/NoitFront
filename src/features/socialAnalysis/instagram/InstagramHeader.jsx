import { Verified, Users, Image, TrendingUp } from "lucide-react"


{/*es necesario modificar para consumir los datos*/}

export default function InstagramHeader({ accountData }) {
  // Valores por defecto en caso de que accountData no tenga la estructura esperada
  const username = accountData?.username || "infinitekparis"
  const followers = accountData?.followers || "10.5K"
  const posts = accountData?.posts || "156"
  const engagement = accountData?.engagement || "4.2%"
  const profileImage = accountData?.profileImage || "/data/3dc49cee2e13559e70a1edab1858771e.jpeg"

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-100">
            <img
              src={profileImage || "/data/3dc49cee2e13559e70a1edab1858771e.jpeg"}
              alt={username}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = "/data/placeholder.svg"
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
            <Verified className="h-5 w-5 text-blue-500" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-2xl font-sora font-bold">@{username}</h1>
            <Verified className="h-5 w-5 text-blue-500" />
          </div>

          <p className="text-gray-600 mb-4 max-w-2xl">
            Skincare y cosmética natural para una piel radiante. Descubre nuestros productos para una rutina de belleza
            completa.
          </p>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-xl">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Users className="h-4 w-4" />
                <span>Seguidores</span>
              </div>
              <div className="font-bold text-lg font-sora">{followers}</div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Image className="h-4 w-4" />
                <span>Posts</span>
              </div>
              <div className="font-bold font-sora text-lg">{posts}</div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>Engagement</span>
              </div>
              <div className="font-bold text-lg font-sora">{engagement}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

