import { useState } from "react"
import { Home, ClipboardList, Settings, Droplets, Network, Link2, Upload, Wrench, Zap, FileText, Building, Users, Database, Calculator, Cable, Lightbulb, Cpu, HardDrive, PaintBucket, ChevronDown, ChevronRight, Circle } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { 
    title: "Cadastro Geral", 
    icon: Database,
    subItems: [
      { title: "Áreas do Projeto", url: "/areas-projeto", icon: Building },
      { title: "CCAs", url: "/ccas", icon: Building },
    ]
  },
  { 
    title: "Mecânica/Tubulação", 
    icon: Wrench,
    subItems: [
      { title: "Registro de Campo - MEC", url: "/registros", icon: ClipboardList },
      { title: "Lista de Registros", url: "/lista-registros", icon: Database },
      { title: "Relatórios", url: "/relatorios-mecanica", icon: FileText },
      { title: "Encarregados", url: "/encarregados", icon: Users },
      { title: "Fluidos", url: "/fluidos", icon: Droplets },
      { title: "Linhas", url: "/linhas", icon: Network },
      { title: "Juntas", url: "/juntas", icon: Link2 },
      { title: "Atividades", url: "/atividades", icon: ClipboardList },
      { title: "Equipamentos Mecânicos", url: "/equipamentos-mecanicos", icon: Settings },
      { title: "Válvulas", url: "/valvulas", icon: Circle },
      { title: "Parâmetros SPEC", url: "/parametros", icon: Calculator },
      { title: "Importação CSV", url: "/importacao-csv", icon: Upload },
    ]
  },
  { 
    title: "Elétrica/Instrumentação", 
    icon: Zap,
    subItems: [
      { title: "Registro de Campo - EIA", url: "/eletrica-registros", icon: ClipboardList },
      { title: "Lista de Registros", url: "/eletrica-lista-registros", icon: Database },
      { title: "Relatórios", url: "/eletrica-relatorios", icon: FileText },
      
      { title: "Encarregados", url: "/eletrica-encarregados", icon: Users },
      { title: "Atividades", url: "/eletrica-atividades", icon: ClipboardList },
      { title: "Disciplinas", url: "/eletrica-disciplinas", icon: Database },
      { title: "Desenhos", url: "/eletrica-desenhos", icon: PaintBucket },
      { title: "Tipos de Infraestrutura", url: "/eletrica-tipos-infraestrutura", icon: Building },
      { title: "Infraestrutura", url: "/eletrica-infraestrutura", icon: HardDrive },
      { title: "Cabos", url: "/eletrica-cabos", icon: Cable },
      { title: "Instrumentos", url: "/eletrica-instrumentos", icon: Cpu },
      { title: "Equipamentos Elétricos", url: "/eletrica-equipamentos", icon: Zap },
      { title: "Luminárias", url: "/eletrica-luminarias", icon: Lightbulb },
    ]
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  // State for controlling which groups are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Dashboard": true,
    "Cadastro Geral": true,
    "Mecânica/Tubulação": currentPath.startsWith("/registros") || currentPath.startsWith("/lista-registros") || currentPath.startsWith("/relatorios-mecanica") || currentPath.startsWith("/importacao-csv") || currentPath.startsWith("/atividades") || currentPath.startsWith("/ccas") || currentPath.startsWith("/encarregados") || currentPath.startsWith("/fluidos") || currentPath.startsWith("/juntas") || currentPath.startsWith("/linhas") || currentPath.startsWith("/parametros") || currentPath.startsWith("/equipamentos-mecanicos") || currentPath.startsWith("/valvulas"),
    "Elétrica/Instrumentação": currentPath.startsWith("/eletrica"),
  })

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }))
  }

  const isActive = (path: string) => currentPath === path
  const isGroupActive = (subItems: any[]) => subItems.some(item => isActive(item.url))

  return (
    <Sidebar className="bg-sidebar-dark text-sidebar-foreground border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible open={openGroups[item.title]} onOpenChange={() => toggleGroup(item.title)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={isGroupActive(item.subItems) ? "bg-orange-100 text-orange-700 font-medium" : "hover:bg-sidebar-accent"}
                        >
                          <item.icon className="h-4 w-4" />
                          {state === "expanded" && (
                            <>
                              <span className="flex-1 text-left">{item.title}</span>
                              {openGroups[item.title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {state === "expanded" && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={isActive(subItem.url)}
                                  className={isActive(subItem.url) ? "bg-orange-200 text-orange-800 font-semibold shadow-sm" : "hover:bg-sidebar-accent"}
                                >
                                  <Link to={subItem.url}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      className={isActive(item.url) ? "bg-orange-200 text-orange-800 font-semibold shadow-sm" : "hover:bg-sidebar-accent"}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {state === "expanded" && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}