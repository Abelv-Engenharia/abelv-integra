
import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Clipboard,
  ClipboardList,
  FileText,
  Home,
  Image,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  Building,
  UserCheck,
  UserCog,
  Target,
  List,
  MapPin,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define the main menu sections to track which one is open
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    if (currentPath.startsWith("/desvios")) return "desvios";
    if (currentPath.startsWith("/treinamentos")) return "treinamentos";
    if (currentPath.startsWith("/ocorrencias")) return "ocorrencias";
    if (currentPath.startsWith("/medidas-disciplinares")) return "medidas-disciplinares";
    if (currentPath.startsWith("/tarefas")) return "tarefas";
    if (currentPath.startsWith("/relatorios")) return "relatorios";
    if (currentPath.startsWith("/idsms")) return "idsms";
    if (currentPath.startsWith("/admin")) return "admin";
    return null;
  });

  // Toggle menu open/close state
  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestão de SMS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Desvios */}
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
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/dashboard">
                            <span>Dashboard de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/cadastro">
                            <span>Cadastro de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/consulta">
                            <span>Consulta de Desvios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/desvios/nao-conformidade">
                            <span>Emissão de Não Conformidade</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Treinamentos */}
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
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/dashboard">
                            <span>Dashboard de Treinamentos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/normativo">
                            <span>Treinamento Normativo</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/consulta">
                            <span>Consulta de Treinamento</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/execucao">
                            <span>Execução de Treinamentos</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/treinamentos/cracha">
                            <span>Emissão de Crachá</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Ocorrências */}
              <SidebarMenuItem>
                <Collapsible open={openMenu === "ocorrencias"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => toggleMenu("ocorrencias")}>
                      <Shield className="h-4 w-4" />
                      <span>Ocorrências</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/dashboard">
                            <span>Dashboard de Ocorrências</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/cadastro">
                            <span>Cadastro de Ocorrências</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/ocorrencias/consulta">
                            <span>Consulta de Ocorrências</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Medidas Disciplinares */}
              <SidebarMenuItem>
                <Collapsible open={openMenu === "medidas-disciplinares"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => toggleMenu("medidas-disciplinares")}>
                      <Clipboard className="h-4 w-4" />
                      <span>Medidas Disciplinares</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/dashboard">
                            <span>Dashboard de Medidas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/cadastro">
                            <span>Cadastro de Aplicação</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/medidas-disciplinares/consulta">
                            <span>Consulta de Medidas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* IDSMS */}
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
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/dashboard">
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/indicadores">
                            <List className="h-4 w-4 mr-2" />
                            <span>Lista de Indicadores</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/iid">
                            <span>IID</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/hsa">
                            <span>HSA</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/ht">
                            <span>HT</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/ipom">
                            <span>IPOM</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/inspecao-alta-lideranca">
                            <span>Inspeção Alta Liderança</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/inspecao-gestao-sms">
                            <span>Inspeção Gestão SMS</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/idsms/indice-reativo">
                            <span>Índice Reativo</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tarefas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible open={openMenu === "tarefas"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => toggleMenu("tarefas")}>
                      <ClipboardList className="h-4 w-4" />
                      <span>Tarefas</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/tarefas/dashboard">
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/tarefas/minhas-tarefas">
                            <span>Minhas Tarefas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/tarefas/cadastro">
                            <span>Cadastro de Tarefas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible open={openMenu === "relatorios"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => toggleMenu("relatorios")}>
                      <FileText className="h-4 w-4" />
                      <span>Relatórios</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/relatorios">
                            <span>Relatórios</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible open={openMenu === "admin"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => toggleMenu("admin")}>
                      <Settings className="h-4 w-4" />
                      <span>Administração</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/usuarios">
                            <span>Administrar Usuários</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/perfis">
                            <span>Perfis de Acesso</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/empresas">
                            <Building className="h-4 w-4 mr-2" />
                            <span>Cadastro de Empresas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/ccas">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>Cadastro de CCAs</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/engenheiros">
                            <UserCog className="h-4 w-4 mr-2" />
                            <span>Cadastro de Engenheiros</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/supervisores">
                            <UserCheck className="h-4 w-4 mr-2" />
                            <span>Cadastro de Supervisores</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/funcionarios">
                            <span>Cadastro de Funcionários</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/hht">
                            <span>Registro de HHT</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/metas-indicadores">
                            <Target className="h-4 w-4 mr-2" />
                            <span>Metas de Indicadores</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/templates">
                            <span>Templates de Importação</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/admin/logo">
                            <Image className="h-4 w-4 mr-2" />
                            <span>Configurar Logo</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
