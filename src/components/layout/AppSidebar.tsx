
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
import { getAllMenusSidebar } from "@/services/perfisService";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes, userRole } = useProfile();

  // Garantir fallback para admins
  const isAdmin =
    (userRole && typeof userRole === "string" && userRole.toLowerCase().startsWith("admin")) ||
    // fallback extra: talvez userPermissoes tenha perfil admin
    (userPermissoes &&
      typeof userPermissoes === "object" &&
      typeof (userPermissoes as any).nome === "string" &&
      (userPermissoes as any).nome.toLowerCase().startsWith("admin"));

  const menusSidebar = isAdmin
    ? getAllMenusSidebar()
    : (
        userPermissoes &&
        typeof userPermissoes === "object" &&
        Array.isArray((userPermissoes as any).menus_sidebar)
        ? (userPermissoes as any).menus_sidebar
        : []
      );

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
        {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade", 
          "treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha",
          "hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", 
          "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento",
          "medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta",
          "ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"].some(menu =>
          podeVerMenu(menu, menusSidebar)
        ) && (
          <SidebarSectionSMS openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Tarefas */}
        {["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"].some(menu =>
          podeVerMenu(menu, menusSidebar)
        ) && (
          <SidebarSectionTarefas openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Relatórios */}
        {["relatorios", "relatorios_idsms"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionRelatorios openMenu={openMenu} toggleMenu={toggleMenu} />
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
          <SidebarSectionAdministracao openMenu={openMenu} toggleMenu={toggleMenu} />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
