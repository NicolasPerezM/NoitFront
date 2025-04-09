"use client";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Instagram,
  Users,
  Image,
  Video,
  BookOpen,
  ExternalLink,
  Award,
} from "lucide-react";
import InstagramHeader from "../InstagramHeader";
import useFetchData from "../../../../hooks/useFetch"

// Componentes personalizados de tarjeta
const CustomCard = ({ children, className }) => {
  return (
    <div
      className={`bg-[#232323] rounded-lg border-none shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

const CustomCardContent = ({ children, className }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

// Datos del perfil
const profileData = {
  UserInfo: {
    username: "infinitekparis_col",
    fullName: "Infinitek Paris",
    biography:
      "Realza la belleza natural de tu piel✨\n🇺🇸 @infinitekparis_us \n🇪🇨 @infinitekparis_ecuador \n🇲🇽 @infinitekparis_mx \nSHOP ONLINE",
    followersCount: 751560,
    followsCount: 1341,
    verified: null,
    businessCategory: "Beauty, cosmetic & personal care",
    externalUrl: "http://bit.ly/34ZD6PY",
    profilePicUrl:
      "https://instagram.frtm1-1.fna.fbcdn.net/v/t51.2885-19/440658824_409876695174179_7371239943169240955_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_ht=instagram.frtm1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=k5yWNZHkMsMQ7kNvgH_Zwy5&_nc_gid=65d8457d701f40869bca8da61727393c&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AYBnQ8_dknYcW9njMatW43HVpZynXBCVdOBKQEb9u_wnGw&oe=67A82E00&_nc_sid=8b3546",
    totalPosts: 2983,
    igtvVideos: 84,
    highlightReels: 14,
    instagramUrl: null,
  },
  PostTypeCounts: {
    Image: 2,
    Sidecar: 6,
    Video: 4,
  },
};

// Preparar datos para gráficos
const postTypeData = [
  { name: "Imágenes", value: profileData.PostTypeCounts.Image },
  { name: "Carruseles", value: profileData.PostTypeCounts.Sidecar },
  { name: "Videos", value: profileData.PostTypeCounts.Video },
];

const contentDistributionData = [
  { name: "Posts", value: profileData.UserInfo.totalPosts },
  { name: "IGTV", value: profileData.UserInfo.igtvVideos },
  { name: "Historias Destacadas", value: profileData.UserInfo.highlightReels },
];

const engagementData = [
  { name: "Seguidores", value: profileData.UserInfo.followersCount },
  { name: "Seguidos", value: profileData.UserInfo.followsCount },
];

// Colores del tema
const COLORS = {
  darkest: "#111111",
  dark: "#232323",
  gray: "#888888",
  light: "#dddddd",
  primary: "#E81840",
  white: "#fcdee4",
  complementary: "#18e8c0",
  analogous: "#e8c018",
  analogousTwo: "#e85818",
  split: "#18e858",
  splitTwo: "#18a8e8",
};

// Colores para los gráficos
const pieColors = [COLORS.primary, COLORS.complementary, COLORS.analogous];
const barColors = [COLORS.primary, COLORS.splitTwo, COLORS.analogousTwo];

export default function Dashboard() {
    const {
        data: headerData,
        loading: headerLoading,
        error: headerError,
      } = useFetchData("/data/Processed_data_infinitekparis_col.json");

      if (!headerData) return <div>No hay datos de header disponibles</div>

      const accountData = headerData.UserInfo

  return (
    <div className="min-h-screen p-4 mt-4">
      {/* Header */}

      {/* Main Content */}
      <main className="mt-4">
        {/* Bio Section */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CustomCard>
            <CustomCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888]">Seguidores</p>
                  <h3 className="text-2xl font-bold">
                    {profileData.UserInfo.followersCount.toLocaleString()}
                  </h3>
                </div>
                <Users size={24} className="text-[#E81840]" />
              </div>
            </CustomCardContent>
          </CustomCard>

          <CustomCard>
            <CustomCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888]">Publicaciones</p>
                  <h3 className="text-2xl font-bold">
                    {profileData.UserInfo.totalPosts.toLocaleString()}
                  </h3>
                </div>
                <Image size={24} className="text-[#18e8c0]" />
              </div>
            </CustomCardContent>
          </CustomCard>

          <CustomCard>
            <CustomCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888]">Videos IGTV</p>
                  <h3 className="text-2xl font-bold">
                    {profileData.UserInfo.igtvVideos.toLocaleString()}
                  </h3>
                </div>
                <Video size={24} className="text-[#e8c018]" />
              </div>
            </CustomCardContent>
          </CustomCard>

          <CustomCard>
            <CustomCardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#888888]">Historias Destacadas</p>
                  <h3 className="text-2xl font-bold">
                    {profileData.UserInfo.highlightReels.toLocaleString()}
                  </h3>
                </div>
                <BookOpen size={24} className="text-[#e85818]" />
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Types Chart */}
          <CustomCard>
            <CustomCardContent>
              <h3 className="text-xl font-semibold mb-4">
                Tipos de Publicaciones Recientes
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={postTypeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#232323",
                        borderColor: "#888888",
                      }}
                      labelStyle={{ color: "#fcdee4" }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Cantidad">
                      {postTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[index % barColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CustomCardContent>
          </CustomCard>

          {/* Content Distribution Chart */}
          <CustomCard>
            <CustomCardContent>
              <h3 className="text-xl font-semibold mb-4">
                Distribución de Contenido
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contentDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {contentDistributionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#232323",
                        borderColor: "#888888",
                      }}
                      labelStyle={{ color: "#fcdee4" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>

        {/* Engagement Metrics */}
        <div className="mt-8">
          <CustomCard>
            <CustomCardContent>
              <h3 className="text-xl font-semibold mb-4">
                Métricas de Engagement
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <XAxis type="number" stroke="#888888" />
                    <YAxis dataKey="name" type="category" stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#232323",
                        borderColor: "#888888",
                      }}
                      labelStyle={{ color: "#fcdee4" }}
                      formatter={(value) => [
                        value.toLocaleString(),
                        "Cantidad",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Cantidad"
                      fill={COLORS.primary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>

        {/* Performance Indicators */}
        <div className="mt-8">
          <CustomCard>
            <CustomCardContent>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="mr-2" size={20} />
                Indicadores de Rendimiento
              </h3>

              <div className="space-y-4">
                {/* Follower Ratio */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Ratio Seguidores/Seguidos</span>
                    <span className="font-semibold">
                      {(
                        profileData.UserInfo.followersCount /
                        profileData.UserInfo.followsCount
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-[#111111] rounded-full h-2.5">
                    <div
                      className="bg-[#E81840] h-2.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                {/* Content Diversity */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Diversidad de Contenido</span>
                    <span className="font-semibold">
                      {Object.keys(profileData.PostTypeCounts).length} tipos
                    </span>
                  </div>
                  <div className="w-full bg-[#111111] rounded-full h-2.5">
                    <div
                      className="bg-[#18e8c0] h-2.5 rounded-full"
                      style={{
                        width: `${
                          (Object.keys(profileData.PostTypeCounts).length / 3) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Content Volume */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Volumen de Contenido</span>
                    <span className="font-semibold">
                      {profileData.UserInfo.totalPosts} publicaciones
                    </span>
                  </div>
                  <div className="w-full bg-[#111111] rounded-full h-2.5">
                    <div
                      className="bg-[#e8c018] h-2.5 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#232323] p-6 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-[#888888]">
            Dashboard de Análisis para {profileData.UserInfo.fullName}
          </p>
          <p className="text-xs mt-2">
            Datos actualizados al {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
}
