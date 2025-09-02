import React, { useMemo, useState } from "react";
import { Home, Settings, User } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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

// === Regra de permissão baseada em menus_sidebar (whitelist) ===
function useCanSee(menusSidebar: string[]) {
  return useMemo(() => {
    const set = new Set(menusSidebar ?? []);
    return (slug: string) => set.has(slug);
  }, [menusSidebar]);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();
  const { isMobile, setOpenMobile } = useSidebar();

  // Extrai e normaliza a lista de slugs permitidos
  const menusSidebar: string[] = useMemo(() => {
    const raw = userPermissoes && typeof userPermissoes === "object"
      ? (userPermissoes as any).menus_sidebar
      : [];
    return Array.isArray(raw) ? Array.from(new Set<string>(raw)) : [];
  }, [userPermissoes]);

  const canSee = useCanSee(menusSidebar);

  // Grupo aberto inicialmente
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
    ) return "gestao-sms";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/tutoriais")) return "admin";
    if (currentPath.startsWith("/account")) return "account";
    return null;
  });

  const toggleMenu = (menuName: string) => setOpenMenu(openMenu === menuName ? null : menuName);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  // Conjuntos de slugs por seção (só para checar se a seção deve aparecer)
  const smsSlugs = [
    "idsms_dashboard", "idsms_relatorios",
    "gro_dashboard", "gro_avaliacao_riscos",
    "prevencao_incendio_dashboard", "prevencao_incendio_cadastro_extintores", "prevencao_incendio_inspecao_extintores",
    "desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade",
    "treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha",
    "hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada",
    "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento",
    "inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta",
    "medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta",
    "ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta",
  ];
  const tarefasSlugs   = ["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"];
  const relatoriosSlugs= ["relatorios_dashboard", "relatorios_idsms"];
  const adminSlugs     = [
    "admin_usuarios", "admin_perfis", "admin_empresas", "admin_ccas",
    "admin_engenheiros", "admin_supervisores", "admin_funcionarios",
    "admin_hht", "admin_metas_indicadores", "admin_templates", "admin_logo",
    "admin_modelos_inspecao",
  ];

  const hasAny = (slugs: string[]) => slugs.some(canSee);

  return (
    <Sidebar>
      <SidebarContent className="bg-sky-900">
        {/* Dashboard simples */}
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

        {/* Busca (agora já filtrando pelos slugs permitidos) */}
        <SidebarSearch menusSidebar={menusSidebar} />

        {/* Seções – só aparecem se houver ao menos 1 slug permitido */}
        {hasAny(smsSlugs) && (
          <SidebarSectionGestaoSMS
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            // se você for ajustar as seções para filtrar os filhos lá dentro, pode também passar canSee por props
            // canSee={canSee}
          />
        )}

        {hasAny(tarefasSlugs) && (
          <SidebarSectionTarefas
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            // canSee={canSee}
          />
        )}

        {hasAny(relatoriosSlugs) && (
          <SidebarSectionRelatorios
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            // canSee={canSee}
          />
        )}

        {hasAny(adminSlugs) && (
          <SidebarSectionAdministracao
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            // canSee={canSee}
          />
        )}

        {/* Conta */}
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
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
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
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
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
