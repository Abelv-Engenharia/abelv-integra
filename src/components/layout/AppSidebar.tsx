
import React, { useState } from "react";
import { Home, Settings, User, Upload } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
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
import SidebarSectionQualidade from "./SidebarSectionQualidade";
import SidebarSearch from "./SidebarSearch";
import { useProfile } from "@/hooks/useProfile";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  console.log(`Verificando acesso ao menu "${menu}":`, {
    menusSidebar,
    hasAccess: menusSidebar && Array.isArray(menusSidebar) && menusSidebar.includes(menu)
  });
  
  if (!menusSidebar || !Array.isArray(menusSidebar)) {
    console.log('menusSidebar não é um array válido:', menusSidebar);
    return false;
  }
  
  return menusSidebar.includes(menu);
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();

  console.log('AppSidebar - userPermissoes completas:', userPermissoes);

  // Extrair menus permitidos do perfil do usuário com debug
  let menusSidebar: string[] = [];
  
  if (userPermissoes && typeof userPermissoes === "object") {
    const permissoesObj = userPermissoes as any;
    console.log('Permissões como objeto:', permissoesObj);
    
    if (Array.isArray(permissoesObj.menus_sidebar)) {
      menusSidebar = permissoesObj.menus_sidebar;
      console.log('Menus da sidebar extraídos:', menusSidebar);
    } else {
      console.log('menus_sidebar não é um array ou não existe:', permissoesObj.menus_sidebar);
    }
  } else {
    console.log('userPermissoes não é um objeto válido:', userPermissoes);
  }

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
    if (currentPath.startsWith("/qualidade")) return "qualidade";
    if (currentPath.startsWith("/gro")) return "gro";
    if (currentPath.startsWith("/tutoriais")) return "admin";
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

        {/* Render IDSMS apenas se tiver acesso específico */}
        {podeVerMenu("idsms_dashboard", menusSidebar) && (
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible open={openMenu === "idsms"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    onClick={() => toggleMenu("idsms")} 
                    className="text-white hover:bg-slate-600"
                  >
                    <span className="break-words">IDSMS</span>
                    {openMenu === "idsms" ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("idsms_dashboard", menusSidebar) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          className={currentPath === "/idsms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/idsms/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {podeVerMenu("idsms_relatorios", menusSidebar) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          className={currentPath === "/idsms/relatorios" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/idsms/relatorios" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Relatórios</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {/* Render ADM MATRICIAL em ordem alfabética */}
        {["adm_dashboard", "adm_configuracoes", "adm_usuarios", "adm_perfis", "adm_empresas", "adm_ccas", "adm_engenheiros", "adm_supervisores", "adm_funcionarios", "adm_hht", "adm_metas_indicadores", "adm_modelos_inspecao", "adm_templates", "adm_logo"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionADM openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render ORÇAMENTOS em ordem alfabética */}
        {["orcamentos_dashboard", "orcamentos_projetos", "orcamentos_custos", "orcamentos_analises", "orcamentos_aprovacoes", "orcamentos_historico"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionOrcamentos openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render PRODUÇÃO em ordem alfabética */}
        {["producao_dashboard", "producao_planejamento", "producao_ordens_producao", "producao_controle_qualidade", "producao_manutencao", "producao_recursos", "producao_indicadores"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionProducao openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render QUALIDADE em ordem alfabética */}
        {["qualidade_dashboard", "qualidade_controle", "qualidade_auditorias", "qualidade_indicadores", "qualidade_equipe", "qualidade_configuracoes"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionQualidade openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render SUPRIMENTOS em ordem alfabética */}
        {["suprimentos_dashboard", "suprimentos_fornecedores", "suprimentos_materiais", "suprimentos_compras", "suprimentos_estoque", "suprimentos_pedidos", "suprimentos_contratos"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionSuprimentos openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Tarefas */}
        {["tarefas_dashboard", "tarefas_minhas_tarefas", "tarefas_cadastro"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionTarefas openMenu={openMenu} toggleMenu={toggleMenu} />
        )}

        {/* Render Relatórios */}
        {["relatorios_dashboard", "relatorios_idsms"].some(menu => podeVerMenu(menu, menusSidebar)) && (
          <SidebarSectionRelatorios openMenu={openMenu} toggleMenu={toggleMenu} />
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
