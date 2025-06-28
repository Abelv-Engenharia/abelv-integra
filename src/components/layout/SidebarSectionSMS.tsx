
import React from "react";
import {
  Calendar,
  ShieldAlert,
  Clipboard,
  BarChart3,
  List,
  ShieldCheck,
  ClipboardList,
  FileSearch,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useProfile } from "@/hooks/useProfile";
import { getAllMenusSidebar } from "@/services/perfisService";

// Função utilitária para verificar acesso (contem na lista)
function podeVerMenu(menu: string, menusSidebar?: string[]) {
  if (!menusSidebar || !Array.isArray(menusSidebar)) return false;
  return menusSidebar.includes(menu);
}

type Props = {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
};

export default function SidebarSectionSMS({ openMenu, toggleMenu }: Props) {
  const { userPermissoes, userRole } = useProfile();

  // Garantir fallback para admins
  const isAdmin =
    (userRole && typeof userRole === "string" && userRole.toLowerCase().startsWith("admin")) ||
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gestão de SMS</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Desvios */}
          {["desvios_dashboard", "desvios_cadastro", "desvios_consulta", "desvios_nao_conformidade"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "desvios"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("desvios")}>
                    <ShieldAlert className="h-4 w-4" />
                    <span>Desvios</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("desvios_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/dashboard">
                            <span className="text-xs leading-tight">Dashboard de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("desvios_cadastro", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/cadastro">
                            <span className="text-xs leading-tight">Cadastro de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("desvios_consulta", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/consulta">
                            <span className="text-xs leading-tight">Consulta de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("desvios_nao_conformidade", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/nao-conformidade">
                            <span className="text-xs leading-tight">Emissão de Não Conformidade</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* Treinamentos */}
          {["treinamentos_dashboard", "treinamentos_normativo", "treinamentos_consulta", "treinamentos_execucao", "treinamentos_cracha"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "treinamentos"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("treinamentos")}>
                    <Calendar className="h-4 w-4" />
                    <span>Treinamentos</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("treinamentos_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/dashboard">
                            <span className="text-xs leading-tight">Dashboard de Treinamentos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("treinamentos_normativo", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/normativo">
                            <span className="text-xs leading-tight">Treinamento Normativo</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("treinamentos_consulta", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/consulta">
                            <span className="text-xs leading-tight">Consulta de Treinamento</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("treinamentos_execucao", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/execucao">
                            <span className="text-xs leading-tight">Execução de Treinamentos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("treinamentos_cracha", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/cracha">
                            <span className="text-xs leading-tight">Emissão de Crachá</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* Hora da Segurança */}
          {["hora_seguranca_cadastro", "hora_seguranca_cadastro_inspecao", "hora_seguranca_cadastro_nao_programada", 
            "hora_seguranca_dashboard", "hora_seguranca_agenda", "hora_seguranca_acompanhamento"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "hora-seguranca"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("hora-seguranca")}>
                    <ShieldAlert className="h-4 w-4" />
                    <span>Hora da Segurança</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("hora_seguranca_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/hora-seguranca/dashboard">
                            <span className="text-xs leading-tight">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("hora_seguranca_agenda", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/hora-seguranca/agenda-hsa">
                            <span className="text-xs leading-tight">Agenda HSA</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("hora_seguranca_cadastro_inspecao", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/hora-seguranca/cadastro-inspecao">
                            <span className="text-xs leading-tight">Cadastro de Inspeção</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("hora_seguranca_acompanhamento", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/hora-seguranca/acompanhamento">
                            <span className="text-xs leading-tight">Acompanhamento</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("hora_seguranca_cadastro_nao_programada", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/hora-seguranca/cadastro-inspecao-nao-planejada">
                            <span className="text-xs leading-tight">Cadastro de Inspeção Não Planejada</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* Inspeção SMS - NOVO */}
          {["inspecao_sms_dashboard", "inspecao_sms_cadastro", "inspecao_sms_consulta"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "inspecao-sms"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("inspecao-sms")}>
                    <FileSearch className="h-4 w-4" />
                    <span>Inspeção SMS</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("inspecao_sms_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/inspecao-sms/dashboard">
                            <span className="text-xs leading-tight">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("inspecao_sms_cadastro", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/inspecao-sms/cadastro">
                            <span className="text-xs leading-tight">Cadastrar Inspeção</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("inspecao_sms_consulta", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/inspecao-sms/consulta">
                            <span className="text-xs leading-tight">Consultar Inspeções</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* Ocorrências */}
          {["ocorrencias_dashboard", "ocorrencias_cadastro", "ocorrencias_consulta"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "ocorrencias"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("ocorrencias")}>
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-sm leading-tight">Ocorrências</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("ocorrencias_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/dashboard">
                            <span className="text-xs leading-tight">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("ocorrencias_cadastro", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/cadastro">
                            <span className="text-xs leading-tight">Cadastro</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("ocorrencias_consulta", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/consulta">
                            <span className="text-xs leading-tight">Consulta</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* Medidas Disciplinares */}
          {["medidas_disciplinares_dashboard", "medidas_disciplinares_cadastro", "medidas_disciplinares_consulta"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "medidas-disciplinares"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("medidas-disciplinares")}>
                    <Clipboard className="h-4 w-4" />
                    <span className="text-sm leading-tight">Medidas Disciplinares</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("medidas_disciplinares_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/dashboard">
                            <span className="text-xs leading-tight">Dashboard de Medidas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("medidas_disciplinares_cadastro", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/cadastro">
                            <span className="text-xs leading-tight">Cadastro de Aplicação</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("medidas_disciplinares_consulta", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/consulta">
                            <span className="text-xs leading-tight">Consulta de Medidas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* IDSMS - só renderiza se tiver permissão */}
          {["idsms_dashboard", "idsms_indicadores", "idsms_iid", "idsms_hsa", "idsms_ht", "idsms_ipom", 
            "idsms_inspecao_alta_lideranca", "idsms_inspecao_gestao_sms", "idsms_indice_reativo"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "idsms"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("idsms")}>
                    <BarChart3 className="h-4 w-4" />
                    <span>IDSMS</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    {podeVerMenu("idsms_dashboard", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/dashboard">
                            <span className="text-xs leading-tight">Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_indicadores", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/indicadores">
                            <List className="h-4 w-4 mr-2" />
                            <span className="text-xs leading-tight">Lista de Indicadores</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_iid", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/iid">
                            <span className="text-xs leading-tight">IID</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_hsa", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/hsa">
                            <span className="text-xs leading-tight">HSA</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_ht", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/ht">
                            <span className="text-xs leading-tight">HT</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_ipom", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/ipom">
                            <span className="text-xs leading-tight">IPOM</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_inspecao_alta_lideranca", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/inspecao-alta-lideranca">
                            <span className="text-xs leading-tight">Inspeção Alta Liderança</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_inspecao_gestao_sms", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/inspecao-gestao-sms">
                            <span className="text-xs leading-tight">Inspeção Gestão SMS</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("idsms_indice_reativo", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/indice-reativo">
                            <span className="text-xs leading-tight">Índice Reativo</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}

          {/* GRO - só renderiza se tiver permissão */}
          {["gro_perigos", "gro_avaliacao", "gro_pgr"].some(menu =>
            podeVerMenu(menu, menusSidebar)
          ) && (
            <SidebarMenuItem>
              <Collapsible open={openMenu === "gro"}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton onClick={() => toggleMenu("gro")}>
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-sm leading-tight">GRO</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/gro/dashboard">
                          <span className="text-xs leading-tight">Dashboard do GRO</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {podeVerMenu("gro_perigos", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gro/perigos">
                            <span className="text-xs leading-tight">Cadastro/Perigos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("gro_avaliacao", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gro/avaliacao">
                            <span className="text-xs leading-tight">Avaliação de Riscos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {podeVerMenu("gro_pgr", menusSidebar) && (
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/gro/pgr">
                            <span className="text-xs leading-tight">PGR – Plano de Ação</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/gro/revisao">
                          <span className="text-xs leading-tight">Monitoramento & Revisão</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/gro/relatorios">
                          <span className="text-xs leading-tight">Relatórios & IRO</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
