
import React, { useState } from "react";
import { Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import SidebarSectionSMS from "./SidebarSectionSMS";
import SidebarSectionTarefas from "./SidebarSectionTarefas";
import SidebarSectionRelatorios from "./SidebarSectionRelatorios";
import SidebarSectionAdministracao from "./SidebarSectionAdministracao";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Defina o menu principal aberto inicialmente
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    if (currentPath.startsWith("/hora-seguranca")) return "hora-seguranca";
    if (currentPath.startsWith("/desvios")) return "desvios";
    if (currentPath.startsWith("/treinamentos")) return "treinamentos";
    if (currentPath.startsWith("/medidas-disciplinares")) return "medidas-disciplinares";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/idsms")) return "idsms";
    if (currentPath.startsWith("/admin")) return "admin";
    if (currentPath.startsWith("/gro")) return "gro";
    return null;
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSectionSMS openMenu={openMenu} toggleMenu={toggleMenu} />
        <SidebarSectionTarefas openMenu={openMenu} toggleMenu={toggleMenu} />
        <SidebarSectionRelatorios openMenu={openMenu} toggleMenu={toggleMenu} />
        <SidebarSectionAdministracao openMenu={openMenu} toggleMenu={toggleMenu} />
      </SidebarContent>
    </Sidebar>
  );
}
