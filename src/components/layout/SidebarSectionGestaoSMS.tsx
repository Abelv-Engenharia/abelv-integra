
import React from "react";
import { Shield, ChevronDown, AlertTriangle, GraduationCap, Clock, FileSearch, AlertCircle, Scale } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarSectionGestaoSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

const SidebarSectionGestaoSMS = ({ openMenu, toggleMenu }: SidebarSectionGestaoSMSProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={openMenu === "gestao-sms"} onOpenChange={() => toggleMenu("gestao-sms")}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              className="text-white hover:bg-slate-600"
            >
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">Gestão de SMS</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${openMenu === "gestao-sms" ? "rotate-180" : ""}`} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Desvios */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "desvios"} onOpenChange={() => toggleMenu("desvios")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Desvios</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "desvios" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/desvios/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/desvios/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/desvios/nao-conformidade" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/desvios/nao-conformidade" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Não Conformidade</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Treinamentos */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "treinamentos"} onOpenChange={() => toggleMenu("treinamentos")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <GraduationCap className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Treinamentos</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "treinamentos" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/treinamentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/treinamentos/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Hora da Segurança */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "hora-seguranca"} onOpenChange={() => toggleMenu("hora-seguranca")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Hora da Segurança</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "hora-seguranca" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/hora-seguranca/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/hora-seguranca/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/hora-seguranca/inspecoes-cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/hora-seguranca/inspecoes-cadastro" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Cadastro Inspeções</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/hora-seguranca/inspecoes-acompanhamento" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/hora-seguranca/inspecoes-acompanhamento" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Acompanhamento</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Inspeção SMS */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "inspecao-sms"} onOpenChange={() => toggleMenu("inspecao-sms")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <FileSearch className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Inspeção SMS</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "inspecao-sms" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/inspecao-sms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/inspecao-sms/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/inspecao-sms/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/inspecao-sms/consulta" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Consulta</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Ocorrências */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "ocorrencias"} onOpenChange={() => toggleMenu("ocorrencias")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Ocorrências</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "ocorrencias" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/ocorrencias/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/ocorrencias/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Medidas Disciplinares */}
              <SidebarMenuSubItem>
                <Collapsible open={openMenu === "medidas-disciplinares"} onOpenChange={() => toggleMenu("medidas-disciplinares")}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton 
                      className="text-white hover:bg-slate-600"
                    >
                      <Scale className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs leading-tight break-words min-w-0">Medidas Disciplinares</span>
                      <ChevronDown className={`h-3 w-3 ml-auto transition-transform ${openMenu === "medidas-disciplinares" ? "rotate-180" : ""}`} />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild
                          className={currentPath === "/medidas-disciplinares/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                        >
                          <Link to="/medidas-disciplinares/dashboard" className="flex items-center gap-2">
                            <span className="text-xs leading-tight break-words min-w-0">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarSectionGestaoSMS;
