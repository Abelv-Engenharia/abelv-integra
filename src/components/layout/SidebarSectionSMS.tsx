
import React from "react";
import { Activity, FileText, Shield, AlertTriangle, GraduationCap, Clock, TrendingUp, BarChart3 } from "lucide-react";
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
import { useProfile } from "@/hooks/useProfile";
import { getAllMenusSidebar } from "@/services/perfisService";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

interface SidebarSectionSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionSMS({ openMenu, toggleMenu }: SidebarSectionSMSProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes, userRole } = useProfile();

  // Debug logs
  console.log("SidebarSectionSMS - userRole:", userRole);
  console.log("SidebarSectionSMS - userPermissoes:", userPermissoes);

  // Garantir fallback para admins
  const isAdmin =
    (userRole && typeof userRole === "string" && userRole.toLowerCase().startsWith("admin")) ||
    // fallback extra: talvez userPermissoes tenha perfil admin
    (userPermissoes &&
      typeof userPermissoes === "object" &&
      typeof (userPermissoes as any).nome === "string" &&
      (userPermissoes as any).nome.toLowerCase().startsWith("admin"));

  const menusSidebar = isAdmin
    ? getAllMenusSidebar()
    : (
        userPermissoes &&
        typeof userPermissoes === "object" &&
        Array.isArray((userPermissoes as any).menus_sidebar)
        ? (userPermissoes as any).menus_sidebar
        : []
      );

  console.log("SidebarSectionSMS - isAdmin:", isAdmin);
  console.log("SidebarSectionSMS - menusSidebar:", menusSidebar);

  return (
    <>
      {/* Seção IDSMS */}
      {["idsms_dashboard", "idsms_relatorios"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "idsms"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("idsms")}
                  className="text-white hover:bg-slate-600"
                >
                  <BarChart3 className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">IDSMS</span>
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
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/indicadores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/indicadores" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Indicadores</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/ht" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/ht" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">HT</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/hsa" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/hsa" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">HSA</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/iid" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/iid" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">IID</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/ipom" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/ipom" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">IPOM</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/indice-reativo" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/indice-reativo" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Índice Reativo</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/inspecao-alta-lideranca" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/inspecao-alta-lideranca" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Inspeção Alta Liderança</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild className={currentPath === "/idsms/inspecao-gestao-sms" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                      <Link to="/idsms/inspecao-gestao-sms" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Inspeção Gestão SMS</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      )}

      {/* Seção Desvios */}
      {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade", "desvios_insights"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "desvios"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("desvios")}
                  className="text-white hover:bg-slate-600"
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Desvios</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("desvios_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("desvios_cadastro", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/cadastro" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastro</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("desvios_consulta", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/consulta" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("desvios_nao_conformidade", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/nao-conformidade" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/nao-conformidade" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Não Conformidades</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      asChild
                      className={currentPath === "/desvios/insights" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                    >
                      <Link to="/desvios/insights" className="flex items-center gap-2">
                        <span className="text-xs leading-tight break-words min-w-0">Insights de Desvios</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      )}

      {/* Seção Treinamentos */}
      {["treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "treinamentos"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("treinamentos")}
                  className="text-white hover:bg-slate-600"
                >
                  <GraduationCap className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Treinamentos</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("treinamentos_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("treinamentos_normativo", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/normativo" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/normativo" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Normativo</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("treinamentos_consulta", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/consulta" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("treinamentos_execucao", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/execucao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/execucao" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Execução</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("treinamentos_cracha", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/cracha" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/cracha" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Crachá</span>
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

      {/* Seção Hora de Segurança */}
      {["hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", 
        "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "hora-seguranca"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("hora-seguranca")}
                  className="text-white hover:bg-slate-600"
                >
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Hora de Segurança</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("hora_seguranca_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("hora_seguranca_agenda", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/agenda-hsa" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/agenda-hsa" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Agenda HSA</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("hora_seguranca_cadastro_inspecao", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/cadastro-inspecao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/cadastro-inspecao" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastro Inspeção</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("hora_seguranca_acompanhamento", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/acompanhamento" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/acompanhamento" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Acompanhamento</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("hora_seguranca_cadastro_nao_programada", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/cadastro-inspecao-nao-planejada" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/cadastro-inspecao-nao-planejada" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Inspeção Não Programada</span>
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

      {/* Seção Inspeção SMS */}
      {["inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "inspecao-sms"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("inspecao-sms")}
                  className="text-white hover:bg-slate-600"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Inspeção SMS</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("inspecao_sms_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("inspecao_sms_cadastro", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/cadastro" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastrar</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("inspecao_sms_consulta", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/consulta" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Consultar</span>
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

      {/* Seção Ocorrências */}
      {["ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "ocorrencias"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("ocorrencias")}
                  className="text-white hover:bg-slate-600"
                >
                  <Activity className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Ocorrências</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("ocorrencias_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("ocorrencias_cadastro", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/cadastro" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastro</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("ocorrencias_consulta", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/consulta" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
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

      {/* Seção Medidas Disciplinares */}
      {["medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "medidas-disciplinares"}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("medidas-disciplinares")}
                  className="text-white hover:bg-slate-600"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Medidas Disciplinares</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("medidas_disciplinares_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("medidas_disciplinares_cadastro", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/cadastro" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastro</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("medidas_disciplinares_consulta", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/consulta" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
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

      {/* Seção GRO */}
      {["gro_dashboard", "gro_avaliacao_riscos"].some(menu =>
        podeVerMenu(menu, menusSidebar)
      ) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "gro"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("gro")}
                  className="text-white hover:bg-slate-600"
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">GRO</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {podeVerMenu("gro_dashboard", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/gro/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/gro/dashboard" className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {podeVerMenu("gro_avaliacao_riscos", menusSidebar) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/gro/avaliacao-riscos" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/gro/avaliacao-riscos" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Avaliação de Riscos</span>
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
    </>
  );
}
