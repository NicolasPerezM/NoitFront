"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  FileChartColumn,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Share2,
  GitCompareArrows,
  BotMessageSquare,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessIdeas } from "@/lib/api/getBusinessIdeas";
import { queryClient } from "@/lib/api/queryClient";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

import logoLight from "@/assets/logos/logoLight.png";
import logoDark from "@/assets/logos/logoDark.png";

const staticData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Ajustes",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { 
    data: projects = [], 
    isLoading: loading, 
    error 
  } = useQuery(
    {
      queryKey: ['businessIdeas'],
      queryFn: async () => {
        const data = await getBusinessIdeas()
        return data.projects || []
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
    queryClient
  );

  // Convertir los proyectos de la API al formato que espera NavMain
  const navMainItems = React.useMemo(() => {
    // Si está cargando, devolver array vacío o elementos de carga
    if (loading) {
      return [];
    }

    // Si hay error, devolver array vacío o mensaje de error
    if (error) {
      return [
        {
          title: "Error al cargar proyectos",
          url: "#",
          icon: FileChartColumn,
        },
      ];
    }

    // Si no hay proyectos, devolver array vacío
    if (!projects || projects.length === 0) {
      return [];
    }

    // Convertir proyectos a formato NavMain
    return projects.map((project) => ({
      title: project.title,
      url: `/chat/${project.id}`,
      icon: FileChartColumn,
    }));
  }, [projects, loading, error]);

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="mt-4 mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <img
                  src={logoLight.src}
                  alt="Logo Light"
                  className="block dark:hidden"
                />
                <img
                  src={logoDark.src}
                  alt="Logo Dark"
                  className="hidden dark:block"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="flex flex-col h-full justify-between">
          <NavMain items={navMainItems} />
          {/*<NavProjects projects={data.projects} />*/}
          <Button variant="outline" size="lg" className="w-auto mx-4">
            Nueva Idea de Negocio
            <BotMessageSquare className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={staticData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}