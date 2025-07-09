
import React, { useState } from "react";
import { Home, Settings, User } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import SidebarSectionGestaoSMS from "./SidebarSectionGestaoSMS";
import SidebarSectionTarefas from "./SidebarSectionTarefas";
import SidebarSectionRelatorios from "./SidebarSectionRelatorios";
import SidebarSectionAdministracao from "./SidebarSectionAdministracao";
import SidebarSectionADM from "./SidebarSectionADM";
import SidebarSectionSuprimentos from "./SidebarSectionSuprimentos";
import SidebarSectionProducao from "./SidebarSectionProducao";
import SidebarSectionOrcamentos from "./SidebarSectionOrcamentos";
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
  const {
    userPermissoes,
    userRole
  } = useProfile();

  // Garantir fallback para admins
  const isAdmin = userRole && typeof userRole === "string" && userRole.toLowerCase().startsWith("admin") ||
  // fallback extra: talvez userPermissoes tenha perfil admin
  userPermissoes && typeof userPermissoes === "object" && typeof (userPermissoes as any).nome === "string" && (userPermissoes as any).nome.toLowerCase().startsWith("admin");
  const menusSidebar = isAdmin ? getAllMenusSidebar() : userPermissoes && typeof userPermissoes === "object" && Array.isArray((userPermissoes as any).menus_sidebar) ? (userPermissoes as any).menus_sidebar : [];

  // Defina o menu principal aberto inicialmente
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    if (currentPath.startsWith("/desvios") || currentPath.startsWith("/treinamentos") || currentPath.startsWith("/hora-seguranca") || currentPath.startsWith("/inspecao-sms") || currentPath.startsWith("/ocorrencias") || currentPath.startsWith("/medidas-disciplinares")) return "gestao-sms";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/idsms")) return "idsms";
    if (currentPath.startsWith("/admin")) return "admin";
    if (currentPath.startsWith("/adm")) return "adm";
    if (currentPath.startsWith("/suprimentos")) return "suprimentos";
    if (currentPath.startsWith("/producao")) return "producao";
    if (currentPath.startsWith("/orcamentos")) return "orcamentos";
    if (currentPath.startsWith("/gro")) return "gro";
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

        {/* Render Gestão de SMS se tiver acesso a pelo menos 1 menu dos agrupados */}
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

        {/* Render ADM */}
        {["adm_dashboard", "adm_configuracoes", "adm_usuarios", "adm_perfis", "adm_empresas", "adm_ccas", "adm_engenheiros", "adm_supervisores", "adm_funcionarios", "adm_hht", "adm_metas_indicadores", "adm_modelos_inspecao", "adm_templates", "adm_logo"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionADM openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Suprimentos */}
        {["suprimentos_dashboard", "suprimentos_fornecedores", "suprimentos_materiais", "suprimentos_compras", "suprimentos_estoque", "suprimentos_pedidos", "suprimentos_contratos"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionSuprimentos openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Produção */}
        {["producao_dashboard", "producao_planejamento", "producao_ordens_producao", "producao_controle_qualidade", "producao_manutencao", "producao_recursos", "producao_indicadores"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionProducao openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Orçamentos */}
        {["orcamentos_dashboard", "orcamentos_projetos", "orcamentos_custos", "orcamentos_analises", "orcamentos_aprovacoes", "orcamentos_historico"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionOrcamentos openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Administração (mantendo compatibilidade) */}
        {["admin_usuarios", "admin_perfis", "admin_empresas", "admin_ccas", "admin_engenheiros", "admin_supervisores", "admin_funcionarios", "admin_hht", "admin_metas_indicadores", "admin_templates", "admin_logo", "admin_modelos_inspecao"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionAdministracao openMenu={openMenu} toggleMenu={toggleMenu} />
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
                  <span className="break-words">Conta</span>
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
                        <span className="text-xs leading-tight break-words min-w-0">Configurações</span>
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
