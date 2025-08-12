
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useProfile } from "@/hooks/useProfile";

// Função utilitária para verificar acesso
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

interface SidebarSectionGestaoSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionGestaoSMS({ openMenu, toggleMenu }: SidebarSectionGestaoSMSProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userPermissoes } = useProfile();

  // Extrair menus permitidos do perfil do usuário
  const menusSidebar = userPermissoes && typeof userPermissoes === "object" && Array.isArray((userPermissoes as any).menus_sidebar) 
    ? (userPermissoes as any).menus_sidebar 
    : [];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={openMenu === "gestao-sms"}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("gestao-sms")} 
              className="text-white hover:bg-slate-600"
            >
              <span className="break-words">GESTÃO SMS</span>
              {openMenu === "gestao-sms" ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              {/* Desvios */}
              {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Desvios</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("desvios_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/desvios/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/desvios/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("desvios_cadastro", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/desvios/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/desvios/cadastro">Cadastro</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("desvios_consulta", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/desvios/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/desvios/consulta">Consulta</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("desvios_nao_conformidade", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/desvios/nao-conformidade" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/desvios/nao-conformidade">Não Conformidade</Link>
                        </SidebarMenuSubButton>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

              {/* Treinamentos */}
              {["treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Treinamentos</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("treinamentos_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/treinamentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/treinamentos/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("treinamentos_normativo", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/treinamentos/normativo" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/treinamentos/normativo">Normativo</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("treinamentos_consulta", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/treinamentos/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/treinamentos/consulta">Consulta</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("treinamentos_execucao", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/treinamentos/execucao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/treinamentos/execucao">Execução</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("treinamentos_cracha", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/treinamentos/cracha" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/treinamentos/cracha">Crachá</Link>
                        </SidebarMenuSubButton>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

              {/* Hora de Segurança */}
              {["hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Hora de Segurança</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("hora_seguranca_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/hora-seguranca/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/hora-seguranca/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("hora_seguranca_cadastro", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/hora-seguranca/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/hora-seguranca/cadastro">Cadastro</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("hora_seguranca_agenda", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/hora-seguranca/agenda" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/hora-seguranca/agenda">Agenda</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("hora_seguranca_acompanhamento", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/hora-seguranca/acompanhamento" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/hora-seguranca/acompanhamento">Acompanhamento</Link>
                        </SidebarMenuSubButton>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

              {/* Inspeção SMS - apenas se tiver acesso específico */}
              {["inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Inspeção SMS</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("inspecao_sms_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/inspecao-sms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/inspecao-sms/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("inspecao_sms_cadastro", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/inspecao-sms/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/inspecao-sms/cadastro">Cadastro</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("inspecao_sms_consulta", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/inspecao-sms/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/inspecao-sms/consulta">Consulta</Link>
                        </SidebarMenuSubButton>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

              {/* Ocorrências */}
              {["ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Ocorrências</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("ocorrencias_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/ocorrencias/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/ocorrencias/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("ocorrencias_cadastro", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/ocorrencias/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/ocorrencias/cadastro">Cadastro</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("ocorrencias_consulta", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/ocorrencias/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/ocorrencias/consulta">Consulta</Link>
                        </SidebarMenuSubButton>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuSubItem>
              )}

              {/* Medidas Disciplinares */}
              {["medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta"].some(menu => podeVerMenu(menu, menusSidebar)) && (
                <SidebarMenuSubItem>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuSubButton className="text-white hover:bg-slate-600">
                        <span className="text-xs leading-tight break-words min-w-0">Medidas Disciplinares</span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4">
                      {podeVerMenu("medidas_disciplinares_dashboard", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/medidas-disciplinares/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/medidas-disciplinares/dashboard">Dashboard</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("medidas_disciplinares_cadastro", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/medidas-disciplinares/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/medidas-disciplinares/cadastro">Cadastro</Link>
                        </SidebarMenuSubButton>
                      )}
                      {podeVerMenu("medidas_disciplinares_consulta", menusSidebar) && (
                        <SidebarMenuSubButton asChild className={currentPath === "/medidas-disciplinares/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}>
                          <Link to="/medidas-disciplinares/consulta">Consulta</Link>
                        </SidebarMenuSubButton>
                      )}
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
