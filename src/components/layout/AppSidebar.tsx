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
import logoAbelvIntegra from "@/assets/logo-abelv-integra.png";

// helper simples para ler a whitelist do perfil
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();
  const { isMobile, setOpenMobile, state } = useSidebar();

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
    return null;
  });

  const toggleMenu = (menuName: string) => setOpenMenu(openMenu === menuName ? null : menuName);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
        {/* Logo e Texto ABELV ENGENHARIA */}
      <div className="flex flex-col items-center rounded-md p-2">
          <div className="w-full p-2">
            <img src={logoAbelvIntegra} alt="ABELV Integra" className="w-full h-auto object-contain rounded-md" />
          </div>
          {state !== 'collapsed' && (
            <div className="w-full text-center">
              <h2 className="text-lg font-bold text-sidebar-foreground">ABELV ENGENHARIA</h2>
            </div>
          )}
        </div>

      
      <SidebarContent className="bg-sky-900">
        {/* Busca (já filtrando pela whitelist via prop) */}
        <SidebarSearch menusSidebar={menusSidebar} />

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
          "admin_comunicados", // Adicionar permissão para comunicados
        ].some(canSee) && (
          <SidebarSectionAdministracao
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
}
