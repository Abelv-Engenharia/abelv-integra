import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import abelvLogo from "@/assets/abelv-logo.png";
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  return <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-gradient-secondary">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
                
                <div className="flex items-center gap-3">
                  
                  <div className="hidden sm:block">
                    <h1 className="text-lg font-semibold text-foreground">ABELV ENGENHARIA</h1>
                    <p className="text-xs text-muted-foreground">Base de homologação</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Criado com</span>
                  <span className="font-semibold text-primary">Lovable</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>;
}