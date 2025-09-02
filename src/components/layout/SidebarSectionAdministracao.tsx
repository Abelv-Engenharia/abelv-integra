import React from "react";
import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick?: () => void;
  canSee?: (slug: string) => boolean; // <- novo
};

type Item = { label: string; to: string; slug: string };

export default function SidebarSectionAdministracao({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => (canSee ? canSee(slug) : true);

  const items: Item[] = [
    { label: "Usuários", to: "/admin/usuarios", slug: "admin_usuarios" },
    { label: "Perfis", to: "/admin/perfis", slug: "admin_perfis" },
    { label: "Empresas", to: "/admin/empresas", slug: "admin_empresas" },
    { label: "CCAs", to: "/admin/ccas", slug: "admin_ccas" },
    { label: "Engenheiros", to: "/admin/engenheiros", slug: "admin_engenheiros" },
    { label: "Supervisores", to: "/admin/supervisores", slug: "admin_supervisores" },
    { label: "Funcionários", to: "/admin/funcionarios", slug: "admin_funcionarios" },
    { label: "HHT", to: "/admin/hht", slug: "admin_hht" },
    { label: "Metas & Indicadores", to: "/admin/metas-indicadores", slug: "admin_metas_indicadores" },
    { label: "Templates", to: "/admin/templates", slug: "admin_templates" },
    { label: "Logo", to: "/admin/logo", slug: "admin_logo" },
    { label: "Modelos de Inspeção", to: "/admin/modelos-inspecao", slug: "admin_modelos_inspecao" },

    // Extras que vi no seu JSON (se existirem no app):
    { label: "Importação Funcionários", to: "/admin/importacao-funcionarios", slug: "admin_importacao_funcionarios" },
    {
      label: "Importação Execução Treinamentos",
      to: "/admin/importacao-execucao-treinamentos",
      slug: "admin_importacao_execucao_treinamentos",
    },
    { label: "Upload Tutoriais", to: "/admin/upload-tutoriais", slug: "admin_upload_tutoriais" },
    { label: "Configuração de E-mails", to: "/admin/configuracao-emails", slug: "admin_configuracao_emails" },
    { label: "Exportação de Dados", to: "/admin/exportacao-dados", slug: "admin_exportacao_dados" },
    { label: "Usuários (Auth)", to: "/admin/usuarios-auth", slug: "admin_usuarios_auth" },
    { label: "Checklists", to: "/admin/checklists", slug: "admin_checklists" },
    { label: "Criar Usuário", to: "/admin/criar-usuario", slug: "admin_criar_usuario" },
    { label: "Importação HSA", to: "/admin/importacao-hsa", slug: "admin_importacao_hsa" },
  ].filter((i) => can(i.slug));

  if (items.length === 0) return null;

  const isOpen = openMenu === "admin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("admin")} className="text-white hover:bg-slate-600">
              <Settings className="h-4 w-4" />
              <span className="break-words">Administração</span>
              {isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((it) => (
                <SidebarMenuSubItem key={it.slug}>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      pathname === it.to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                    }
                  >
                    <Link to={it.to} onClick={onLinkClick}>
                      {it.label}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
