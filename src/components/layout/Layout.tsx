
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useRouteProtection } from "@/hooks/useRouteProtection";

const Layout = () => {
  // Proteção de rotas em nível de layout
  useRouteProtection();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto animate-fade-in">
            <div className="w-full max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
