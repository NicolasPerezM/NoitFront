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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Face It",
      url: "/instagramAccountAnalysis",
      icon: FileChartColumn,
    },
    {
      title: "Lifetime ecommerce",
      url: "#",
      icon: FileChartColumn,
    },
  ],
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
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          <NavMain items={data.navMain} />
          {/*<NavProjects projects={data.projects} />*/}
          <Button variant="outline" size="lg" className="w-auto mx-4">
            Nuevo Chat
            <BotMessageSquare className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      {
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      }
    </Sidebar>
  );
}
