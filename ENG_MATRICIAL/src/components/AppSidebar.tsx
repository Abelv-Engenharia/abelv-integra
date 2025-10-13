import { FileText, Home, Settings, BarChart3, Users, Building2, FolderOpen, Clock, CheckCircle, Play, Archive, Zap, Cog, ClipboardCheck, RotateCcw, AlertTriangle, Calculator, Workflow, Calendar } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const fluxoOSItems = [
  { title: "Abertura de OS", url: "/os-abertas", icon: FolderOpen },
  { title: "OS Em planejamento", url: "/os-em-planejamento", icon: Clock },
  { title: "OS Aguardando aceite", url: "/os-aguardando-aceite", icon: CheckCircle },
  { title: "OS Em execução", url: "/os-em-execucao", icon: Play },
  { title: "OS Em fechamento", url: "/os-em-fechamento", icon: Calculator },
  { title: "Aguardando aceite fechamento", url: "/os-aguardando-aceite-fechamento", icon: ClipboardCheck },
  { title: "OS Concluídas", url: "/os-concluidas", icon: Archive },
];

const replanejamentoItems = [
  { title: "Replanejamento", url: "/os-replanejamento", icon: RotateCcw },
  { title: "Aceite replanejamento", url: "/os-aguardando-aceite-replanejamento", icon: AlertTriangle },
];


const relatoriosItems = [
  { title: "Relatório Anual", url: "/relatorios-anual", icon: Calendar },
  { title: "Relatórios EM Elétrica", url: "/relatorios-em-eletrica", icon: Zap },
  { title: "Relatórios EM Mecânica", url: "/relatorios-em-mecanica", icon: Cog },
  { title: "Relatórios EM Departamento", url: "/relatorios-em-departamento", icon: BarChart3 },
];

const adminItems = [
  { title: "Usuários", url: "/admin/usuarios", icon: Users },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth duration-200 ${
      isActive
        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <Sidebar
      className="border-r border-sidebar-border bg-sidebar backdrop-blur-sm"
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Início */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    end={true} 
                    className={({ isActive: linkIsActive }) => getNavCls({ isActive: linkIsActive })}
                  >
                    <Home className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">Início</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Fluxo Principal de OS */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-semibold mb-2 flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            {!isCollapsed && "FLUXO DE OS"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {fluxoOSItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkIsActive }) => getNavCls({ isActive: linkIsActive })}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Replanejamento */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-semibold mb-2 flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {!isCollapsed && "REPLANEJAMENTO"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {replanejamentoItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkIsActive }) => getNavCls({ isActive: linkIsActive })}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* Relatórios */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {!isCollapsed && "RELATÓRIOS"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {relatoriosItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkIsActive }) => getNavCls({ isActive: linkIsActive })}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administração */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-semibold mb-2 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {!isCollapsed && "ADMIN"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkIsActive }) => getNavCls({ isActive: linkIsActive })}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}