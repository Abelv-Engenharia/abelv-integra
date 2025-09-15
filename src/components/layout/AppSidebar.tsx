import React, { useState } from "react";
import { Home, Settings, User } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/tutoriais")) return "admin";
    if (currentPath.startsWith("/account")) return "account";
    return "configuracoes"; // Configurações começa aberta por padrão
  });

  const toggleMenu = (menuName: string) => setOpenMenu(openMenu === menuName ? null : menuName);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarContent className="bg-slate-800">
        {/* Logo ABELV INTEGRA */}
        <div className="p-4 bg-white rounded-lg mx-4 mt-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-md flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-sm transform rotate-45"></div>
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">ABELV</div>
              <div className="font-bold text-slate-800 text-sm">INTEGRA</div>
            </div>
          </div>
        </div>

        {/* Título ABELV ENGENHARIA */}
        <div className="px-4 mb-6">
          <h2 className="text-white font-semibold text-lg">ABELV ENGENHARIA</h2>
        </div>

        {/* Seção Navegação */}
        <div className="px-4 mb-4">
          <h3 className="text-white/70 text-sm font-medium mb-3">Navegação</h3>
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

        {/* Busca (já filtrando pela whitelist via prop) */}
        <div className="px-4 mb-4">
          <SidebarSearch menusSidebar={menusSidebar} />
        </div>

        {/* Seção Configurações */}
        <div className="px-4 mb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible open={openMenu === "configuracoes"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    onClick={() => toggleMenu("configuracoes")} 
                    className="text-white hover:bg-slate-600 justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span className="break-words">Configurações</span>
                    </div>
                    {openMenu === "configuracoes" ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenu className="ml-6">
                    <SidebarMenuItem>
                      <SidebarMenuButton className="text-white hover:bg-slate-600">
                        <div className="flex items-center gap-2">
                          <Settings className="h-3 w-3 flex-shrink-0" />
                          <span className="text-sm">API's</span>
                        </div>
                      </SidebarMenuButton>
                      <SidebarMenu className="ml-4 mt-2">
                        <SidebarMenuItem>
                          <SidebarMenuButton className="text-white/80 hover:bg-slate-600 text-sm py-1">
                            <span>Sienge - Plan...</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton className="text-white/80 hover:bg-slate-600 text-sm py-1">
                            <span>Sienge - Cred...</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton className="text-white/80 hover:bg-slate-600 text-sm py-1">
                            <span>Nydus - Colab...</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton className="text-white/80 hover:bg-slate-600 text-sm py-1">
                            <span>Log de execuç...</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton className="text-white/80 hover:bg-slate-600 text-sm py-1">
                            <span>Agendamentos</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        {/* Todas as outras seções originais mantidas, apenas movidas para após Configurações */}
        
        {/* Seção: Gestão SMS (renderiza se houver pelo menos 1 slug permitido dessa área) */}
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
          // extras que você mencionou no JSON (se usar)
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

        {/* Perfil do usuário no final */}
        <div className="mt-auto p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">silvio.gameiro@abelv.co...</div>
              <div className="text-white/70 text-xs">Engenheiro</div>
            </div>
          </div>
        </div>

        {/* Conta (sempre visível) - mantido para funcionalidade */}
        <div className="hidden">
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible open={openMenu === "account"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("account")} className="text-white hover:bg-slate-600">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="break-words">CONTA</span>
                    {openMenu === "account" ? (
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={
                          currentPath === "/account/profile"
                            ? "bg-slate-600 text-white font-medium"
                            : "text-white hover:bg-slate-600"
                        }
                      >
                        <Link to="/account/profile" className="flex items-center gap-2" onClick={handleLinkClick}>
                          <span className="text-xs leading-tight break-words min-w-0">Perfil</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={
                          currentPath === "/account/settings"
                            ? "bg-slate-600 text-white font-medium"
                            : "text-white hover:bg-slate-600"
                        }
                      >
                        <Link to="/account/settings" className="flex items-center gap-2" onClick={handleLinkClick}>
                          <Settings className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Configuração da conta</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
