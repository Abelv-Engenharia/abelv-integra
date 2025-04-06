
import {
  Calendar,
  Clipboard,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
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
import { Link } from "react-router-dom";

export function AppSidebar() {
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
                <SidebarMenuButton>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Desvios</span>
                </SidebarMenuButton>
                
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
              </SidebarMenuItem>

              {/* Treinamentos */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Calendar className="h-4 w-4" />
                  <span>Treinamentos</span>
                </SidebarMenuButton>
                
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
              </SidebarMenuItem>

              {/* Hora da Segurança */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Hora da Segurança</span>
                </SidebarMenuButton>
                
                <SidebarMenuSub>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/hora-seguranca/dashboard">
                        <span>Dashboard de Segurança</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/hora-seguranca/inspecoes">
                        <span>Cadastro de Inspeções</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/hora-seguranca/inspecao-nao-programada">
                        <span>Registro de Inspeção Não Programada</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to="/hora-seguranca/acompanhamento">
                        <span>Acompanhamento de Execução</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              {/* Ocorrências */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Shield className="h-4 w-4" />
                  <span>Ocorrências</span>
                </SidebarMenuButton>
                
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
              </SidebarMenuItem>

              {/* Medidas Disciplinares */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clipboard className="h-4 w-4" />
                  <span>Medidas Disciplinares</span>
                </SidebarMenuButton>
                
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
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tarefas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/tarefas/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/tarefas/minhas-tarefas">
                    <ClipboardList className="h-4 w-4" />
                    <span>Minhas Tarefas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/tarefas/cadastro">
                    <Clipboard className="h-4 w-4" />
                    <span>Cadastro de Tarefas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestão da Rotina</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-rotina/dssms">
                    <ShieldCheck className="h-4 w-4" />
                    <span>DSSMS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-rotina/rms">
                    <Shield className="h-4 w-4" />
                    <span>RMS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-rotina/ift">
                    <ClipboardList className="h-4 w-4" />
                    <span>IFT</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-rotina/ficha-epi">
                    <ClipboardList className="h-4 w-4" />
                    <span>Ficha de EPI</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/relatorios">
                    <FileText className="h-4 w-4" />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/usuarios">
                    <Users className="h-4 w-4" />
                    <span>Administrar Usuários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/perfis">
                    <Shield className="h-4 w-4" />
                    <span>Perfis de Acesso</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/funcionarios">
                    <Users className="h-4 w-4" />
                    <span>Cadastro de Funcionários</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/hht">
                    <Calendar className="h-4 w-4" />
                    <span>Registro de HHT</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/admin/templates">
                    <Settings className="h-4 w-4" />
                    <span>Templates de Importação</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
