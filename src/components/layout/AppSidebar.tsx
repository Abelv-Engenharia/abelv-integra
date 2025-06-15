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
import { useProfile } from "@/hooks/useProfile";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();
  const menusSidebar = userPermissoes?.menus_sidebar || [];

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

  // Para cada seção, só renderizar se houver pelo menos 1 menu permitido na seção
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {podeVerMenu("dashboard", menusSidebar) && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        {/* Render SMS se tiver acesso a pelo menos 1 menu dele */}
        {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade"].some(menu =>
          podeVerMenu(menu, menusSidebar)
        ) && (
          <SidebarSectionSMS openMenu={openMenu} toggleMenu={toggleMenu} menusSidebar={menusSidebar} />
        )}

        {/* Render Tarefas */}
        {["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"].some(menu =>
          podeVerMenu(menu, menusSidebar)
        ) && (
          <SidebarSectionTarefas openMenu={openMenu} toggleMenu={toggleMenu} menusSidebar={menusSidebar} />
        )}

        {/* Render Relatórios */}
        {["relatorios", "relatorios_idsms"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionRelatorios openMenu={openMenu} toggleMenu={toggleMenu} menusSidebar={menusSidebar} />
        )}

        {/* Render Administração */}
        {[
          "admin_usuarios",
          "admin_perfis",
          "admin_empresas",
          "admin_ccas",
          "admin_engenheiros",
          "admin_supervisores",
          "admin_funcionarios",
          "admin_hht",
          "admin_metas_indicadores",
          "admin_templates",
          "admin_logo"
        ].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionAdministracao openMenu={openMenu} toggleMenu={toggleMenu} menusSidebar={menusSidebar} />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
