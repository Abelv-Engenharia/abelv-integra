import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Users,
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
  canSee?: (slug: string) => boolean;
};

type Item = { label: string; to: string; slug: string; Icon: React.ComponentType<any> };

// Sidebar para administração com submenus expansíveis
export default function SidebarSectionAdministracao({ openMenu, toggleMenu, onLinkClick, canSee }: Props) {
  const { pathname } = useLocation();
  const can = (slug: string) => {
    const result = canSee ? canSee(slug) : true;
    console.log('🔧 [SidebarAdmin] Testando slug:', slug, 'Resultado:', result);
    return result;
  };
  
  const [isComunicadosOpen, setIsComunicadosOpen] = useState(false);
  const [isImportacaoDadosOpen, setIsImportacaoDadosOpen] = useState(false);

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
    { label: "Logo", to: "/admin/logo", slug: "admin_logo", Icon: ImageIcon },
    { label: "Upload de Tutoriais", to: "/admin/upload-tutoriais", slug: "upload_tutoriais", Icon: Upload },
    { label: "Configuração de E-mails", to: "/admin/configuracao-emails", slug: "configuracao_emails", Icon: Mail },
    { label: "Exportação de Dados", to: "/admin/exportacao-dados", slug: "admin_exportacao_dados", Icon: Database },
    { label: "Criar Usuário", to: "/admin/criar-usuario-direct", slug: "admin_criar_usuario", Icon: UserPlus },
  ].filter((i) => can(i.slug));

  const importacaoItems: Item[] = [
    { label: "Importação de Funcionários", to: "/admin/importacao-funcionarios", slug: "admin_importacao_funcionarios", Icon: UploadCloud },
    {
      label: "Importação Execução Treinamentos",
      to: "/admin/importacao-execucao-treinamentos",
      slug: "admin_importacao_execucao_treinamentos",
      Icon: UploadCloud,
    },
    { label: "Importação de HSA", to: "/admin/importacao-hsa", slug: "admin_importacao_hsa", Icon: UploadCloud },
    { label: "Importação de Desvios", to: "/admin/importacao-desvios", slug: "admin_importacao_desvios", Icon: UploadCloud },
  ].filter((i) => can(i.slug));

  if (items.length === 0 && !can("admin_comunicados") && importacaoItems.length === 0) return null;

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
              
              {importacaoItems.length > 0 && (
                <SidebarMenuSubItem>
                  <Collapsible open={isImportacaoDadosOpen}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton 
                        onClick={() => setIsImportacaoDadosOpen(!isImportacaoDadosOpen)}
                        className="text-white hover:bg-slate-600"
                      >
                        <Database className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs leading-tight break-words min-w-0">Importação de Dados</span>
                        {isImportacaoDadosOpen ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />}
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 space-y-1">
                        {importacaoItems.map(({ slug, to, label, Icon }) => (
                          <SidebarMenuSubButton
                            key={slug}
                            asChild
                            className={`h-auto py-2 [&>span:last-child]:!whitespace-normal [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip ${
                              pathname === to ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"
                            }`}
                          >
                            <Link to={to} onClick={onLinkClick} className="flex items-center gap-2">
                              <Icon className="h-3 w-3 flex-shrink-0" />
                              <span className="text-xs leading-normal break-words whitespace-normal max-w-[140px]">{label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

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
