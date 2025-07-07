
import React, { useState } from "react";
import { ChevronDown, ChevronRight, ShieldAlert, GraduationCap, Clock, ClipboardCheck, AlertTriangle, Gavel } from "lucide-react";
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

interface SidebarSectionGestaoSMSProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
}

export default function SidebarSectionGestaoSMS({ openMenu, toggleMenu }: SidebarSectionGestaoSMSProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Estado local para controlar os submenus
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});

  const toggleSubMenu = (subMenuName: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [subMenuName]: !prev[subMenuName]
    }));
  };

  const isGestaoSMSOpen = openMenu === "gestao-sms";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible open={isGestaoSMSOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              onClick={() => toggleMenu("gestao-sms")}
              className="text-white hover:bg-slate-600"
            >
              <ShieldAlert className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">Gestão de SMS</span>
              {isGestaoSMSOpen ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Desvios */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("desvios")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span>Desvios</span>
                    </div>
                    {openSubMenus.desvios ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.desvios && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/cadastro">Cadastro</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/consulta">Consulta</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/desvios/nao-conformidade" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/desvios/nao-conformidade">Não Conformidade</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Treinamentos */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("treinamentos")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3 w-3 flex-shrink-0" />
                      <span>Treinamentos</span>
                    </div>
                    {openSubMenus.treinamentos ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.treinamentos && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/normativo" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/normativo">Normativo</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/consulta">Consulta</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/execucao" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/execucao">Execução</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/treinamentos/cracha" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/treinamentos/cracha">Crachá</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Hora da Segurança */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("hora-seguranca")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>Hora da Segurança</span>
                    </div>
                    {openSubMenus["hora-seguranca"] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus["hora-seguranca"] && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/inspecoes-cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/inspecoes-cadastro">Cadastro</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/agenda-hsa" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/agenda-hsa">Agenda</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/hora-seguranca/inspecoes-acompanhamento" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/hora-seguranca/inspecoes-acompanhamento">Acompanhamento</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Inspeção SMS */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("inspecao-sms")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-3 w-3 flex-shrink-0" />
                      <span>Inspeção SMS</span>
                    </div>
                    {openSubMenus["inspecao-sms"] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus["inspecao-sms"] && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/cadastrar" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/cadastrar">Cadastro</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/inspecao-sms/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/inspecao-sms/consulta">Consulta</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Ocorrências */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("ocorrencias")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span>Ocorrências</span>
                    </div>
                    {openSubMenus.ocorrencias ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus.ocorrencias && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/cadastro">Cadastro</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/ocorrencias/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/ocorrencias/consulta">Consulta</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>

              {/* Medidas Disciplinares */}
              <SidebarMenuSubItem>
                <div className="w-full">
                  <button
                    onClick={() => toggleSubMenu("medidas-disciplinares")}
                    className="flex items-center justify-between w-full px-2 py-1 text-white hover:bg-slate-600 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Gavel className="h-3 w-3 flex-shrink-0" />
                      <span>Medidas Disciplinares</span>
                    </div>
                    {openSubMenus["medidas-disciplinares"] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                  {openSubMenus["medidas-disciplinares"] && (
                    <div className="ml-4 mt-1 space-y-1">
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/dashboard" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/dashboard">Dashboard</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/cadastro" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/cadastro">Cadastro</Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton 
                        asChild
                        className={currentPath === "/medidas-disciplinares/consulta" ? "bg-slate-600 text-white font-medium" : "text-white hover:bg-slate-600"}
                      >
                        <Link to="/medidas-disciplinares/consulta">Consulta</Link>
                      </SidebarMenuSubButton>
                    </div>
                  )}
                </div>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
