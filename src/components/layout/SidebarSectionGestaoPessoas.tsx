import { ChevronDown, ChevronRight, ClipboardList, FileText, CheckSquare, CheckCircle, BarChart3, Plane, FileUp, Database, FilePlus } from "lucide-react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarSectionGestaoPessoasProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick: () => void;
  canSee?: (slug: string) => boolean;
}

export default function SidebarSectionGestaoPessoas({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee = () => true,
}: SidebarSectionGestaoPessoasProps) {
  const isOpen = openMenu === "gestao-pessoas";

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleMenu("gestao-pessoas")}>
      <SidebarMenu>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Gestão de Pessoas</span>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenu className="ml-4 border-l border-sidebar-border">
              {/* Solicitações */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/kpi-solicitacoes" onClick={onLinkClick}>
                    <BarChart3 className="h-4 w-4" />
                    <span>Kpi Solicitações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/solicitacao-servicos" onClick={onLinkClick}>
                    <FileText className="h-4 w-4" />
                    <span>Solicitação de Serviços</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/controle-solicitacoes" onClick={onLinkClick}>
                    <CheckSquare className="h-4 w-4" />
                    <span>Controle Solicitações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/aprovacao-solicitacoes" onClick={onLinkClick}>
                    <CheckCircle className="h-4 w-4" />
                    <span>Aprovação Solicitações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/relatorios-solicitacoes" onClick={onLinkClick}>
                    <FileText className="h-4 w-4" />
                    <span>Relatórios Solicitações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Gestão de Viagens */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/gestao-viagens-dashboard" onClick={onLinkClick}>
                    <Plane className="h-4 w-4" />
                    <span>Dashboard Viagens</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/cadastro-fatura" onClick={onLinkClick}>
                    <FilePlus className="h-4 w-4" />
                    <span>Cadastro Fatura</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/importar-fatura" onClick={onLinkClick}>
                    <FileUp className="h-4 w-4" />
                    <span>Importar Fatura</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/consulta-faturas" onClick={onLinkClick}>
                    <Database className="h-4 w-4" />
                    <span>Consulta Faturas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/gestao-pessoas/relatorio-viagens" onClick={onLinkClick}>
                    <FileText className="h-4 w-4" />
                    <span>Relatório Viagens</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </SidebarMenu>
    </Collapsible>
  );
}
