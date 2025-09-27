import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Users,
  Shield,
  Building2,
  Layers,
  Hammer,
  UserCog,
  UserCheck,
  Users2,
  Timer,
  Target,
  ListChecks,
  FileCode2,
  Image as ImageIcon,
  Upload,
  Mail,
  Database,
  Lock,
  UserPlus,
  UploadCloud,
  MessageSquare,
  Plus,
  Search,
  User,
} from "lucide-react";
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
  canSee?: (slug: string) => boolean; // ← controle por permissões
};

type Item = { label: string; to: string; slug: string; Icon: React.ComponentType<any> };

export default function SidebarSectionAdministracao({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => {
    const result = canSee ? canSee(slug) : true;
    console.log('🔧 [SidebarAdmin] Testando slug:', slug, 'Resultado:', result);
    return result;
  };
  
  // Estado local para controlar o submenu Comunicados independentemente
  const [isComunicadosOpen, setIsComunicadosOpen] = useState(false);

  // Sistema de perfis removido - usando sistema direto
  const items: Item[] = [
    { label: "Usuários", to: "/admin/usuarios-direct", slug: "admin_usuarios", Icon: Users },
    { label: "Empresas", to: "/admin/empresas", slug: "admin_empresas", Icon: Building2 },
    { label: "CCAs", to: "/admin/ccas", slug: "admin_ccas", Icon: Layers },
    { label: "Engenheiros", to: "/admin/engenheiros", slug: "admin_engenheiros", Icon: Hammer },
    { label: "Supervisores", to: "/admin/supervisores", slug: "admin_supervisores", Icon: UserCog },
    { label: "Encarregados", to: "/admin/encarregados", slug: "admin_encarregados", Icon: UserCheck },
    { label: "Funcionários", to: "/admin/funcionarios", slug: "admin_funcionarios", Icon: Users2 },
    { label: "Registro HHT", to: "/admin/registro-hht", slug: "admin_registro_hht", Icon: Timer },
    { label: "Metas & Indicadores", to: "/admin/metas-indicadores", slug: "admin_metas_indicadores", Icon: Target },
    { label: "Checklists", to: "/admin/checklists", slug: "admin_checklists", Icon: ListChecks },
    { label: "Templates", to: "/admin/templates", slug: "admin_templates", Icon: FileCode2 },
    { label: "Logo do Sistema", to: "/admin/logo-sistema", slug: "admin_logo_sistema", Icon: ImageIcon },
    { label: "Logo", to: "/admin/logo", slug: "admin_logo", Icon: ImageIcon },

    { label: "Upload de Tutoriais", to: "/admin/upload-tutoriais", slug: "admin_upload_tutoriais", Icon: Upload },
    { label: "Configuração de E-mails", to: "/admin/configuracao-emails", slug: "admin_configuracao_emails", Icon: Mail },
    { label: "Exportação de Dados", to: "/admin/exportacao-dados", slug: "admin_exportacao_dados", Icon: Database },

    { label: "Importação de Funcionários", to: "/admin/importacao-funcionarios", slug: "admin_importacao_funcionarios", Icon: UploadCloud },
    {
      label: "Importação Execução Treinamentos",
      to: "/admin/importacao-execucao-treinamentos",
      slug: "admin_importacao_execucao_treinamentos",
      Icon: UploadCloud,
    },
    { label: "Importação de HSA", to: "/admin/importacao-hsa", slug: "admin_importacao_hsa", Icon: UploadCloud },

    // Removidos os itens do sistema antigo:
    // { label: "Usuários (Auth)", to: "/admin/usuarios-auth", slug: "admin_usuarios_auth", Icon: Lock },
    { label: "Criar Usuário", to: "/admin/criar-usuario-direct", slug: "admin_criar_usuario", Icon: UserPlus },
    { label: "Modelos de Inspeção", to: "/admin/modelos-inspecao", slug: "admin_modelos_inspecao", Icon: ListChecks },
    // Se existir “adm_manutencao” como rota:
    // { label: "Manutenção", to: "/admin/manutencao", slug: "adm_manutencao", Icon: Wrench }
  ].filter((i) => can(i.slug));

  if (items.length === 0 && !can("admin_comunicados")) return null;

  const isOpen = openMenu === "admin";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("admin")} className="text-white hover:bg-slate-600">
              <Settings className="h-4 w-4" />
              <span className="break-words">Configurações</span>
              {isOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map(({ slug, to, label, Icon }) => (
                <SidebarMenuSubItem key={slug}>
                  <SidebarMenuSubButton
                    asChild
                    className={
                      pathname === to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                    }
                  >
                    <Link to={to} onClick={onLinkClick} className="flex items-center gap-2">
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">{label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
              
              {/* Submenu Comunicados */}
              {can("admin_comunicados") && (
                <SidebarMenuSubItem>
                  <Collapsible open={isComunicadosOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton 
                        onClick={() => setIsComunicadosOpen(!isComunicadosOpen)}
                        className="text-white hover:bg-slate-600"
                      >
                        <MessageSquare className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs leading-tight break-words min-w-0">Comunicados</span>
                        {isComunicadosOpen ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />}
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 space-y-1">
                        <SidebarMenuSubButton
                          asChild
                          className={
                            pathname === "/admin/comunicados/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                          }
                        >
                          <Link to="/admin/comunicados/cadastro" onClick={onLinkClick} className="flex items-center gap-2">
                            <Plus className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs leading-tight break-words min-w-0">Cadastro</span>
                          </Link>
                        </SidebarMenuSubButton>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            pathname === "/admin/comunicados/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                          }
                        >
                          <Link to="/admin/comunicados/consulta" onClick={onLinkClick} className="flex items-center gap-2">
                            <Search className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
                          </Link>
                        </SidebarMenuSubButton>
                        <SidebarMenuSubButton
                          asChild
                          className={
                            pathname === "/comunicados/meus-comunicados" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                          }
                        >
                          <Link to="/comunicados/meus-comunicados" onClick={onLinkClick} className="flex items-center gap-2">
                            <User className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs leading-tight break-words min-w-0">Meus Comunicados</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
