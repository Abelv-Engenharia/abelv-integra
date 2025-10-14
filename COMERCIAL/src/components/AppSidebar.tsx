import { useState } from "react";
import { FolderOpen, BarChart3, ChevronDown, FileText, Search, Target, PieChart, LayoutDashboard, Building2, UserCheck, DollarSign, FileCheck, BookOpen, FileSpreadsheet, Folder, Users, Package, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const repositorioSubItems = [
  { title: "Consulta de Documentos", url: "/repositorio/documentos", icon: LayoutDashboard },
  { title: "Empresarial", url: "/repositorio/categoria/1", icon: Building2 },
  { title: "Habilitação", url: "/repositorio/categoria/2", icon: UserCheck },
  { title: "Financeiro", url: "/repositorio/categoria/3", icon: DollarSign },
  { title: "Certidões", url: "/repositorio/categoria/4", icon: FileCheck },
  { title: "Politicas e Código de Conduta", url: "/repositorio/categoria/5", icon: BookOpen },
];

const comercialSubItems = [
  { title: "Dashboard", url: "/comercial/dashboard", icon: PieChart },
  { title: "Cadastro de Proposta", url: "/comercial/cadastro", icon: FileText },
  { title: "Consulta de Propostas Emitidas", url: "/comercial/registros", icon: Search },
  { title: "Metas Anuais", url: "/comercial/metas", icon: Target },
  { title: "Performance de Vendas", url: "/comercial", icon: BarChart3 },
  { title: "Relatórios", url: "/comercial/relatorios", icon: FileSpreadsheet },
];

const alteracaoCadastrosSubItems = [
  { title: "Segmentos", url: "/comercial/cadastros/segmentos", icon: Folder },
  { title: "Vendedores", url: "/comercial/cadastros/vendedores", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [isRepositorioOpen, setIsRepositorioOpen] = useState(
    currentPath.startsWith("/repositorio")
  );
  const [isComercialOpen, setIsComercialOpen] = useState(
    currentPath.startsWith("/comercial")
  );
  const [isAlteracaoCadastrosOpen, setIsAlteracaoCadastrosOpen] = useState(
    currentPath.startsWith("/comercial/cadastros")
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    currentPath.startsWith("/comercial/cadastros")
  );

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 ${
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    } whitespace-normal`;

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar backdrop-blur-sm"
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <Collapsible
                open={isRepositorioOpen}
                onOpenChange={setIsRepositorioOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-normal min-h-[44px] [&>span:last-child]:whitespace-normal [&>span:last-child]:break-words">
                      <FolderOpen className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm flex-1 leading-tight">Repositório de Documentos</span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isCollapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {repositorioSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="[&>span:last-child]:whitespace-normal [&>span:last-child]:break-words">
                              <NavLink
                                to={subItem.url}
                                end
                                className={({ isActive }) =>
                                  `flex items-center gap-3 rounded-lg px-3 py-2 pl-8 transition-smooth duration-200 whitespace-normal min-h-[44px] ${
                                    isActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  }`
                                }
                              >
                                <subItem.icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm leading-tight">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
              
              <Collapsible
                open={isComercialOpen}
                onOpenChange={setIsComercialOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-normal min-h-[44px] [&>span:last-child]:whitespace-normal [&>span:last-child]:break-words">
                      <BarChart3 className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm flex-1 leading-tight">Controle Comercial</span>
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isCollapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {comercialSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="[&>span:last-child]:whitespace-normal [&>span:last-child]:break-words">
                              <NavLink
                                to={subItem.url}
                                end
                                className={({ isActive }) =>
                                  `flex items-center gap-3 rounded-lg px-3 py-2 pl-8 transition-smooth duration-200 whitespace-normal min-h-[44px] ${
                                    isActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  }`
                                }
                              >
                                <subItem.icon className="h-4 w-4 shrink-0" />
                                <span className="text-sm leading-tight">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                        
                        {/* Submenu aninhado: Alteração de Cadastros */}
                        <SidebarMenuSubItem>
                          <Collapsible
                            open={isAlteracaoCadastrosOpen}
                            onOpenChange={setIsAlteracaoCadastrosOpen}
                            className="group/nested"
                          >
                            <CollapsibleTrigger asChild>
                              <SidebarMenuSubButton className="flex items-center gap-3 rounded-lg px-3 py-2 pl-8 transition-smooth duration-200 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground whitespace-normal min-h-[44px]">
                                <Settings className="h-4 w-4 shrink-0" />
                                <span className="text-sm leading-tight flex-1">Alteração de Cadastros</span>
                                <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]/nested:rotate-180" />
                              </SidebarMenuSubButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub className="ml-4">
                                {alteracaoCadastrosSubItems.map((item) => (
                                  <SidebarMenuSubItem key={item.title}>
                                    <SidebarMenuSubButton asChild>
                                      <NavLink
                                        to={item.url}
                                        end
                                        className={({ isActive }) =>
                                          `flex items-center gap-3 rounded-lg px-3 py-2 pl-8 transition-smooth duration-200 whitespace-normal min-h-[44px] ${
                                            isActive
                                              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                          }`
                                        }
                                      >
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span className="text-sm leading-tight">{item.title}</span>
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
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}