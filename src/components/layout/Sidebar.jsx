import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page({children}) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))] bg-theme-white dark:bg-theme-darkest text-theme-darkest dark:text-theme-light font-montreal text-paragraph">
      <SidebarProvider className="flex flex-col border">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="w-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}

