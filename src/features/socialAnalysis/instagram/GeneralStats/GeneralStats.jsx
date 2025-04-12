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
    <div> 
      <h1>en proceso</h1>
    </div>
  );
}
