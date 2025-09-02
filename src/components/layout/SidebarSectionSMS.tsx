import React from "react";
import { Activity, FileText, Shield, AlertTriangle, GraduationCap, Clock, TrendingUp, BarChart3, Flame } from "lucide-react";
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
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarSectionSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick?: () => void;
}

export default function SidebarSectionSMS({ openMenu, toggleMenu, onLinkClick }: SidebarSectionSMSProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAdmin, canAccessMenu } = usePermissions();

  return (
    <>
      {/* Seção IDSMS */}
      {(isAdmin || canAccessMenu("idsms_dashboard") || canAccessMenu("idsms_relatorios")) && (
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
                  {(isAdmin || canAccessMenu("idsms_dashboard")) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/idsms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/idsms/dashboard" className="flex items-center gap-2" onClick={onLinkClick}>
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
      {(isAdmin || canAccessMenu("desvios_dashboard") || canAccessMenu("desvios_cadastro") || canAccessMenu("desvios_consulta")) && (
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
                  {(isAdmin || canAccessMenu("desvios_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("desvios_cadastro")) && (
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
                  {(isAdmin || canAccessMenu("desvios_consulta")) && (
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
                  {(isAdmin || canAccessMenu("desvios_nao_conformidade")) && (
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
      {(isAdmin || canAccessMenu("treinamentos_dashboard") || canAccessMenu("treinamentos_normativo") || canAccessMenu("treinamentos_execucao")) && (
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
                  {(isAdmin || canAccessMenu("treinamentos_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("treinamentos_normativo")) && (
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
                  {(isAdmin || canAccessMenu("treinamentos_consulta")) && (
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
                  {(isAdmin || canAccessMenu("treinamentos_execucao")) && (
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
                  {(isAdmin || canAccessMenu("treinamentos_cracha")) && (
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
      {(isAdmin || canAccessMenu("hora_seguranca_dashboard") || canAccessMenu("hora_seguranca_agenda") || canAccessMenu("hora_seguranca_cadastro")) && (
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
                  {(isAdmin || canAccessMenu("hora_seguranca_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("hora_seguranca_agenda")) && (
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
                  {(isAdmin || canAccessMenu("hora_seguranca_cadastro_inspecao")) && (
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
                  {(isAdmin || canAccessMenu("hora_seguranca_acompanhamento")) && (
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
                  {(isAdmin || canAccessMenu("hora_seguranca_cadastro_nao_programada")) && (
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
      {(isAdmin || canAccessMenu("inspecao_sms_dashboard") || canAccessMenu("inspecao_sms_cadastro") || canAccessMenu("inspecao_sms_consulta")) && (
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
                  {(isAdmin || canAccessMenu("inspecao_sms_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("inspecao_sms_cadastro")) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/cadastrar" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/cadastrar" className="flex items-center gap-2">
                          <span className="text-xs leading-tight break-words min-w-0">Cadastrar</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {(isAdmin || canAccessMenu("inspecao_sms_consulta")) && (
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
      {(isAdmin || canAccessMenu("ocorrencias_dashboard") || canAccessMenu("ocorrencias_cadastro") || canAccessMenu("ocorrencias_consulta")) && (
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
                  {(isAdmin || canAccessMenu("ocorrencias_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("ocorrencias_cadastro")) && (
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
                  {(isAdmin || canAccessMenu("ocorrencias_consulta")) && (
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
      {(isAdmin || canAccessMenu("medidas_disciplinares_dashboard") || canAccessMenu("medidas_disciplinares_cadastro") || canAccessMenu("medidas_disciplinares_consulta")) && (
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
                  {(isAdmin || canAccessMenu("medidas_disciplinares_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("medidas_disciplinares_cadastro")) && (
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
                  {(isAdmin || canAccessMenu("medidas_disciplinares_consulta")) && (
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
      {(isAdmin || canAccessMenu("gro_dashboard") || canAccessMenu("gro_avaliacao_riscos")) && (
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
                  {(isAdmin || canAccessMenu("gro_dashboard")) && (
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
                  {(isAdmin || canAccessMenu("gro_avaliacao_riscos")) && (
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

      {/* Seção Prevenção de Incêndio */}
      {(isAdmin || canAccessMenu("prevencao_incendio_dashboard") || canAccessMenu("prevencao_incendio_cadastro_extintores") || canAccessMenu("prevencao_incendio_inspecao_extintores")) && (
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible open={openMenu === "prevencao-incendio"}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  onClick={() => toggleMenu("prevencao-incendio")}
                  className="text-white hover:bg-slate-600"
                >
                  <Flame className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">Prevenção de Incêndio</span>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <SidebarMenuSub>
                  {(isAdmin || canAccessMenu("prevencao_incendio_dashboard")) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/prevencao-incendio/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/prevencao-incendio/dashboard" className="flex items-center gap-2" onClick={onLinkClick}>
                          <TrendingUp className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {(isAdmin || canAccessMenu("prevencao_incendio_cadastro_extintores")) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/prevencao-incendio/cadastro-extintores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/prevencao-incendio/cadastro-extintores" className="flex items-center gap-2" onClick={onLinkClick}>
                          <span className="text-xs leading-tight break-words min-w-0">Cadastro de Extintores</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                  {(isAdmin || canAccessMenu("prevencao_incendio_inspecao_extintores")) && (
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/prevencao-incendio/inspecao-extintores" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/prevencao-incendio/inspecao-extintores" className="flex items-center gap-2" onClick={onLinkClick}>
                          <span className="text-xs leading-tight break-words min-w-0">Inspeção de Extintores</span>
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