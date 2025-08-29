
import React, { useState } from "react";
import { Home, Settings, User, Upload } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SidebarSectionGestaoSMS from "./SidebarSectionGestaoSMS";
import SidebarSectionTarefas from "./SidebarSectionTarefas";
import SidebarSectionRelatorios from "./SidebarSectionRelatorios";
import SidebarSectionSistema from "./SidebarSectionSistema";
import SidebarSearch from "./SidebarSearch";
import { usePermissions } from "@/hooks/usePermissions";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const permissions = usePermissions();
  
  // Usar o sistema de permissões atualizado
  const menusSidebar = permissions.allowedMenus;

  // Defina o menu principal aberto inicialmente
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    if (currentPath.startsWith("/desvios") || currentPath.startsWith("/treinamentos") || currentPath.startsWith("/hora-seguranca") || currentPath.startsWith("/inspecao-sms") || currentPath.startsWith("/ocorrencias") || currentPath.startsWith("/medidas-disciplinares")) return "gestao-sms";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/idsms")) return "idsms";
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/suporte") || currentPath.startsWith("/conta")) return "sistema";
    if (currentPath.startsWith("/gro")) return "gro";
    if (currentPath.startsWith("/tutoriais")) return "sistema";
    if (currentPath.startsWith("/account")) return "account";
    return null;
  });

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-sky-900">
        <SidebarMenu>
          {podeVerMenu("dashboard", menusSidebar) && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                className={currentPath === "/dashboard" || currentPath === "/" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>

        {/* Área de busca */}
        <SidebarSearch menusSidebar={menusSidebar} />

        {/* Render SMS se tiver acesso a pelo menos 1 menu dos agrupados */}
        {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade", "treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha", "hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento", "inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta", "medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta", "ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionGestaoSMS openMenu={openMenu} toggleMenu={toggleMenu} />
        )}


        {/* Render Tarefas */}
        {["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionTarefas openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Relatórios */}
        {["relatorios_dashboard", "relatorios_idsms"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionRelatorios openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Sistema (ex-Administração) */}
        {["adm_usuarios", "adm_perfis", "adm_empresas", "adm_ccas", "adm_engenheiros", "adm_supervisores", "adm_funcionarios", "adm_hht", "adm_metas_indicadores", "adm_templates", "adm_logo", "adm_modelos_inspecao", "adm_checklists", "adm_importacao_funcionarios", "adm_configuracoes", "suporte", "conta"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionSistema openMenu={openMenu} toggleMenu={toggleMenu} />
        )}


        {/* Seção de Conta - sempre visível para usuários autenticados */}
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "account"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("account")} 
                  className="text-white hover:bg-slate-600"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">CONTA</span>
                  {openMenu === "account" ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild 
                      className={currentPath === "/account/profile" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/account/profile" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Perfil</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild 
                      className={currentPath === "/account/settings" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/account/settings" className="flex items-center gap-2">
                        <Settings className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs leading-tight break-words min-w-0">Configuração da conta</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
