import React, { useState } from "react";
import { Home, Settings, User, Hexagon, Cog } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import SidebarSectionGestaoSMS from "./SidebarSectionGestaoSMS";
import SidebarSectionTarefas from "./SidebarSectionTarefas";
import SidebarSectionRelatorios from "./SidebarSectionRelatorios";
import SidebarSectionAdministracao from "./SidebarSectionAdministracao";
import SidebarSearch from "./SidebarSearch";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// helper simples para ler a whitelist do perfil
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();
  const { isMobile, setOpenMobile } = useSidebar();

  // pega os slugs do perfil
  const menusSidebar =
    userPermissoes && typeof userPermissoes === "object" && Array.isArray((userPermissoes as any).menus_sidebar)
      ? (userPermissoes as any).menus_sidebar
      : [];

  // predicado de visibilidade que será repassado às seções
  const canSee = (slug: string) => podeVerMenu(slug, menusSidebar);

  // qual grupo começa aberto
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    if (
      currentPath.startsWith("/idsms") ||
      currentPath.startsWith("/gro") ||
      currentPath.startsWith("/prevencao-incendio") ||
      currentPath.startsWith("/desvios") ||
      currentPath.startsWith("/treinamentos") ||
      currentPath.startsWith("/hora-seguranca") ||
      currentPath.startsWith("/inspecao-sms") ||
      currentPath.startsWith("/ocorrencias") ||
      currentPath.startsWith("/medidas-disciplinares")
    )
      return "gestao-sms";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/tutoriais")) return "configuracoes";
    return null;
  });

  const toggleMenu = (menuName: string) => setOpenMenu(openMenu === menuName ? null : menuName);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-gray-700">
      <SidebarHeader className="bg-slate-800 border-b border-gray-700">
        {/* Logo ABELV INTEGRA */}
        <div className="bg-white rounded-lg p-3 mx-4 mt-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <Hexagon className="w-full h-full text-blue-500" fill="currentColor" />
            </div>
            <div>
              <div className="text-black font-bold text-sm">ABELV</div>
              <div className="text-black text-xs">INTEGRA</div>
            </div>
          </div>
        </div>
        
        {/* Título da empresa */}
        <div className="text-white font-semibold text-sm px-4 pb-3">
          ABELV ENGENHARIA
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-800">
        {/* Seção Navegação */}
        <div className="px-4 py-2">
          <h3 className="text-gray-400 text-xs font-medium mb-3">Navegação</h3>
          
          {/* Dashboard */}
          <SidebarMenu>
            {canSee("dashboard") && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    currentPath === "/dashboard" || currentPath === "/"
                      ? "bg-slate-600 text-white font-medium"
                      : "text-white hover:bg-slate-600"
                  }
                >
                  <Link to="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
                    <Home className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </div>

        {/* Seção Configurações */}
        <div className="px-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible open={openMenu === "configuracoes"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    onClick={() => toggleMenu("configuracoes")} 
                    className="text-white hover:bg-slate-600 w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Cog className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">Configurações</span>
                    </div>
                    {openMenu === "configuracoes" ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6">
                  {/* API's Subseção */}
                  <div className="py-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Settings className="h-3 w-3" />
                      <span>API's</span>
                    </div>
                    <SidebarMenu className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-white hover:bg-slate-600 text-xs pl-2">
                          Sienge - Planejamento
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-white hover:bg-slate-600 text-xs pl-2">
                          Sienge - Credenciamento
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-white hover:bg-slate-600 text-xs pl-2">
                          Nydus - Colaboradores
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-white hover:bg-slate-600 text-xs pl-2">
                          Log de execução
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-white hover:bg-slate-600 text-xs pl-2">
                          Agendamentos
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* Busca (já filtrando pela whitelist via prop) */}
        <SidebarSearch menusSidebar={menusSidebar} />

        {/* Seção: Gestão SMS */}
        {[
          "idsms_dashboard",
          "idsms_relatorios",
          "gro_dashboard",
          "gro_avaliacao_riscos",
          "prevencao_incendio_dashboard",
          "prevencao_incendio_cadastro_extintores",
          "prevencao_incendio_inspecao_extintores",
          "desvios_dashboard",
          "desvios_cadastro",
          "desvios_consulta",
          "desvios_nao_conformidade",
          "treinamentos_dashboard",
          "treinamentos_normativo",
          "treinamentos_consulta",
          "treinamentos_execucao",
          "treinamentos_cracha",
          "hora_seguranca_cadastro",
          "hora_seguranca_cadastro_nao_programada",
          "hora_seguranca_dashboard",
          "hora_seguranca_agenda",
          "hora_seguranca_acompanhamento",
          "inspecao_sms_dashboard",
          "inspecao_sms_cadastro",
          "inspecao_sms_consulta",
          "medidas_disciplinares_dashboard",
          "medidas_disciplinares_cadastro",
          "medidas_disciplinares_consulta",
          "ocorrencias_dashboard",
          "ocorrencias_cadastro",
          "ocorrencias_consulta",
          "sms_dashboard",
        ].some(canSee) && (
          <SidebarSectionGestaoSMS
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Tarefas */}
        {["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"].some(canSee) && (
          <SidebarSectionTarefas
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Relatórios */}
        {["relatorios_dashboard", "relatorios_idsms"].some(canSee) && (
          <SidebarSectionRelatorios
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Administração */}
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
          "admin_logo",
          "admin_modelos_inspecao",
          "admin_importacao_funcionarios",
          "admin_importacao_execucao_treinamentos",
          "admin_upload_tutoriais",
          "admin_configuracao_emails",
          "admin_exportacao_dados",
          "admin_usuarios_auth",
          "admin_checklists",
          "admin_criar_usuario",
          "admin_importacao_hsa",
        ].some(canSee) && (
          <SidebarSectionAdministracao
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}
      </SidebarContent>

      <SidebarFooter className="bg-slate-800 border-t border-gray-700">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-500 text-white text-xs">E</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm truncate">elvio.gameiro@abelv.co...</div>
            <div className="text-gray-400 text-xs">Engenheiro</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
