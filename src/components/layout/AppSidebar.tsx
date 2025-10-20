import React, { useState, useEffect } from "react";
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
import SidebarSectionAdministracao from "./SidebarSectionAdministracao";
import SidebarSectionSeguranca from "./SidebarSectionSeguranca";
import SidebarSectionApoioGeral from "./SidebarSectionApoioGeral";
import { SidebarSectionSuprimentos } from "./SidebarSectionSuprimentos";
import SidebarSectionEngenhariaMatricial from "./SidebarSectionEngenhariaMatricial";
import SidebarSearch from "./SidebarSearch";
import { usePermissionsDirect } from "@/hooks/usePermissionsDirect";
import logoAbelvIntegra from "@/assets/logo-abelv-integra.png";
import SidebarSectionComercial from "./SidebarSectionComercial";
import SidebarSectionGestaoPessoas from "./SidebarSectionGestaoPessoas";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasPermission, loading } = usePermissionsDirect();
  const { isMobile, setOpenMobile, state } = useSidebar();

  // predicado de visibilidade que será repassado às seções
  const canSee = (slug: string) => hasPermission(slug);

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
      currentPath.startsWith("/medidas-disciplinares") ||
      currentPath.startsWith("/relatorios")
    )
      return "gestao-sms";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (
      currentPath === "/admin/admin-sistema" ||
      currentPath === "/admin/perfis" ||
      currentPath === "/admin/usuarios-perfis" ||
      currentPath === "/admin/usuarios-ccas" ||
      currentPath === "/admin/usuarios-direct"
    )
      return "seguranca";
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/tutoriais")) return "admin";
    if (currentPath.startsWith("/suprimentos/estoque")) return "suprimentos";
    if (currentPath.startsWith("/engenharia-matricial")) return "engenharia-matricial";
    if (currentPath.startsWith("/comercial")) return "comercial";
    if (currentPath.startsWith("/gestao-pessoas")) return "gestao-pessoas";
    if (currentPath.startsWith("/account")) return "account";
    return null;
  });

  const toggleMenu = (menuName: string) => setOpenMenu(openMenu === menuName ? null : menuName);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  // Mantém o menu correto aberto quando a rota muda
  useEffect(() => {
    if (currentPath.startsWith("/comercial")) {
      setOpenMenu("comercial");
    } else if (
      currentPath.startsWith("/idsms") ||
      currentPath.startsWith("/gro") ||
      currentPath.startsWith("/prevencao-incendio") ||
      currentPath.startsWith("/desvios") ||
      currentPath.startsWith("/treinamentos") ||
      currentPath.startsWith("/hora-seguranca") ||
      currentPath.startsWith("/inspecao-sms") ||
      currentPath.startsWith("/ocorrencias") ||
      currentPath.startsWith("/medidas-disciplinares") ||
      currentPath.startsWith("/documentacao-sms") ||
      currentPath.startsWith("/relatorios")
    ) {
      setOpenMenu("gestao-sms");
    } else if (currentPath.startsWith("/tarefas")) {
      setOpenMenu("tarefas");
    } else if (currentPath.startsWith("/relatorios")) {
      setOpenMenu("relatorios");
    } else if (
      currentPath === "/admin/admin-sistema" ||
      currentPath === "/admin/perfis" ||
      currentPath === "/admin/usuarios-perfis" ||
      currentPath === "/admin/usuarios-ccas" ||
      currentPath === "/admin/usuarios-direct"
    ) {
      setOpenMenu("seguranca");
    } else if (currentPath.startsWith("/admin") || currentPath.startsWith("/tutoriais")) {
      setOpenMenu("admin");
    } else if (currentPath.startsWith("/suprimentos/estoque")) {
      setOpenMenu("suprimentos");
    } else if (currentPath.startsWith("/engenharia-matricial")) {
      setOpenMenu("engenharia-matricial");
    } else if (currentPath.startsWith("/gestao-pessoas")) {
      setOpenMenu("gestao-pessoas");
    }
  }, [currentPath]);

  return (
    <Sidebar className="print:hidden">
      {/* Logo e Texto ABELV ENGENHARIA */}
      <div className="flex flex-col items-center rounded-md p-2">
        <div className="w-full p-2">
          <img src={logoAbelvIntegra} alt="ABELV Integra" className="w-full h-auto object-contain rounded-md" />
        </div>
        {state !== "collapsed" && (
          <div className="w-full text-center">
            <h2 className="text-lg font-bold text-sidebar-foreground">ABELV ENGENHARIA</h2>
          </div>
        )}
      </div>

      <SidebarContent className="bg-sky-900">
        {/* Busca (sem menusSidebar prop, pois SidebarSearch deve ter sua própria lógica) */}
        <SidebarSearch />

        {/* Seção: Gestão SMS (renderiza se houver pelo menos 1 slug permitido dessa área) */}
        {[
          "idsms_dashboard",
          "idsms_relatorios",
          "gro_dashboard",
          "gro_avaliacao_riscos",
          "prevencao_incendio_dashboard",
          "prevencao_incendio_cadastro_extintores",
          "prevencao_incendio_consulta_extintores",
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
          "hora_seguranca_cadastro_inspecao",
          "hora_seguranca_cadastro_nao_programada",
          "hora_seguranca_dashboard",
          "hora_seguranca_agenda",
          "hora_seguranca_acompanhamento",
          "hora_seguranca_cadastro_hsa",
          "hora_seguranca_nao_programada_hsa",
          "hora_seguranca_painel_execucao_hsa",
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
          "relatorios_dashboard",
          "relatorios_idsms",
          "relatorios_hsa",
          "relatorios_ocorrencias",
          "relatorios_desvios",
          "relatorios_treinamentos",
          "documentacao_dashboard",
          "documentacao_modelos",
          "documentacao_os",
          "documentacao_altura",
          "documentacao_eletricidade",
          "documentacao_confinado",
          "documentacao_lista",
          "documentacao_certificados",
          "documentacao_turmas",
          "documentacao_riscos",
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

        {/* Seção: Segurança */}
        {["admin_sistema", "admin_perfis", "admin_usuarios_perfis", "admin_usuarios_ccas", "admin_usuarios"].some(
          canSee,
        ) && (
          <SidebarSectionSeguranca
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Apoio Geral */}
        {["admin_empresas", "admin_empresas_sienge", "admin_ccas", "admin_unidades_medidas", "admin_tipos_documentos"].some(canSee) && (
          <SidebarSectionApoioGeral
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Administração */}
        {[
          "admin_engenheiros",
          "admin_supervisores",
          "admin_encarregados",
          "admin_funcionarios",
          "admin_registro_hht",
          "admin_metas_indicadores",
          "admin_templates",
          "admin_logo",
          "admin_importacao_funcionarios",
          "admin_importacao_execucao_treinamentos",
          "upload_tutoriais",
          "configuracao_emails",
          "admin_exportacao_dados",
          "admin_checklists",
          "admin_importacao_hsa",
          "admin_importacao_desvios",
          "admin_comunicados",
        ].some(canSee) && (
          <SidebarSectionAdministracao
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
            canSee={canSee}
          />
        )}

        {/* Seção: Suprimentos - Estoque */}
        {canSee("estoque_acesso") && (
          <SidebarSectionSuprimentos
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
          />
        )}

        {/* Seção: Engenharia Matricial */}
        {[
          "engmat_os_abertura",
          "engmat_os_planejamento",
          "engmat_os_medicao",
          "engmat_os_finalizacao",
          "engmat_os_historico",
          "engmat_replanejamento_visao_geral",
          "engmat_replanejamento_unificado",
          "engmat_relatorio_os_abertas",
          "engmat_relatorio_os_encerradas",
          "engmat_relatorio_os_planejamento",
          "engmat_relatorio_hht",
          "engmat_relatorio_engenheiro",
          "engmat_relatorio_unificado",
          "engmat_relatorio_acompanhamento_prod"
        ].some(canSee) && (
          <SidebarSectionEngenhariaMatricial
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
          />
        )}

        {/* Seção: Comercial */}
        {[
          "comercial_repositorio_empresarial",
          "comercial_repositorio_habilitacao",
          "comercial_repositorio_juridico",
          "comercial_repositorio_tecnico",
          "comercial_repositorio_editais",
          "comercial_repositorio_geral",
          "comercial_controle_dashboard",
          "comercial_controle_cadastro",
          "comercial_controle_registros",
          "comercial_controle_metas",
          "comercial_controle_performance",
          "comercial_controle_relatorios",
          "comercial_controle_segmentos",
          "comercial_controle_vendedores"
        ].some(canSee) && (
          <SidebarSectionComercial
            openMenu={openMenu}
            toggleMenu={toggleMenu}
            onLinkClick={handleLinkClick}
          />
        )}

        {/* Seção: Gestão de Pessoas */}
        <SidebarSectionGestaoPessoas
          openMenu={openMenu}
          toggleMenu={toggleMenu}
          onLinkClick={handleLinkClick}
        />
      </SidebarContent>
    </Sidebar>
  );
}
