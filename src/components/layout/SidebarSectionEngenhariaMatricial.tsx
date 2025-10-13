import { Building2, FolderOpen, Clock, CheckCircle, Play, Archive, Calculator, ClipboardCheck, RotateCcw, AlertTriangle, Calendar, Zap, Cog, BarChart3, Users, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";

interface Props {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
  onLinkClick: () => void;
}

const fluxoOSItems = [
  { title: "Abertura de OS", url: "/engenharia-matricial/os-abertas", icon: FolderOpen },
  { title: "OS Em planejamento", url: "/engenharia-matricial/os-em-planejamento", icon: Clock },
  { title: "OS Aguardando aceite", url: "/engenharia-matricial/os-aguardando-aceite", icon: CheckCircle },
  { title: "OS Em execução", url: "/engenharia-matricial/os-em-execucao", icon: Play },
  { title: "OS Em fechamento", url: "/engenharia-matricial/os-em-fechamento", icon: Calculator },
  { title: "Aguardando aceite fechamento", url: "/engenharia-matricial/os-aguardando-aceite-fechamento", icon: ClipboardCheck },
  { title: "OS Concluídas", url: "/engenharia-matricial/os-concluidas", icon: Archive },
];

const replanejamentoItems = [
  { title: "Replanejamento", url: "/engenharia-matricial/os-replanejamento", icon: RotateCcw },
  { title: "Aceite replanejamento", url: "/engenharia-matricial/os-aguardando-aceite-replanejamento", icon: AlertTriangle },
];

const relatoriosItems = [
  { title: "Relatório Anual", url: "/engenharia-matricial/relatorios-anual", icon: Calendar },
  { title: "Relatórios EM Elétrica", url: "/engenharia-matricial/relatorios-em-eletrica", icon: Zap },
  { title: "Relatórios EM Mecânica", url: "/engenharia-matricial/relatorios-em-mecanica", icon: Cog },
  { title: "Relatórios EM Departamento", url: "/engenharia-matricial/relatorios-em-departamento", icon: BarChart3 },
];

const adminItems = [
  { title: "Usuários", url: "/engenharia-matricial/admin/usuarios", icon: Users },
];

export default function SidebarSectionEngenhariaMatricial({ openMenu, toggleMenu, onLinkClick }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isInEngenhariaMatricial = currentPath.startsWith("/engenharia-matricial");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible
          open={openMenu === "engenharia-matricial" || isInEngenhariaMatricial}
          onOpenChange={() => toggleMenu("engenharia-matricial")}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton onClick={() => toggleMenu("engenharia-matricial")} className="text-white hover:bg-slate-600">
              <Building2 className="h-4 w-4" />
              <span>Engenharia Matricial</span>
              <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {/* Fluxo de OS */}
              <SidebarMenuSubItem>
                <Collapsible
                  open={openMenu === "em-fluxo-os"}
                  onOpenChange={() => toggleMenu("em-fluxo-os")}
                  className="group/subcollapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu("em-fluxo-os");
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <FolderOpen className="h-4 w-4" />
                      <span>Fluxo de OS</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180" />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-4">
                      {fluxoOSItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={currentPath === item.url}
                            className="text-white hover:bg-slate-700"
                          >
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Replanejamento */}
              <SidebarMenuSubItem>
                <Collapsible
                  open={openMenu === "em-replanejamento"}
                  onOpenChange={() => toggleMenu("em-replanejamento")}
                  className="group/subcollapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu("em-replanejamento");
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Replanejamento</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180" />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-4">
                      {replanejamentoItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={currentPath === item.url}
                            className="text-white hover:bg-slate-700"
                          >
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Relatórios */}
              <SidebarMenuSubItem>
                <Collapsible
                  open={openMenu === "em-relatorios"}
                  onOpenChange={() => toggleMenu("em-relatorios")}
                  className="group/subcollapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu("em-relatorios");
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Relatórios</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180" />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-4">
                      {relatoriosItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={currentPath === item.url}
                            className="text-white hover:bg-slate-700"
                          >
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuSubItem>

              {/* Admin */}
              <SidebarMenuSubItem>
                <Collapsible
                  open={openMenu === "em-admin"}
                  onOpenChange={() => toggleMenu("em-admin")}
                  className="group/subcollapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuSubButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu("em-admin");
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Admin</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/subcollapsible:rotate-180" />
                    </SidebarMenuSubButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pl-4">
                      {adminItems.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={currentPath === item.url}
                            className="text-white hover:bg-slate-700"
                          >
                            <NavLink to={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
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
}
