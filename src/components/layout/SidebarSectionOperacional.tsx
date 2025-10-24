import React from "react";
import { Home, ClipboardList, Settings, Droplets, Network, Link2, Upload, Wrench, Zap, FileText, Building, Users, Database, Calculator, Cable, Lightbulb, Cpu, HardDrive, PaintBucket, ChevronDown, ChevronRight, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SidebarSectionOperacionalProps {
  openMenu: string | null;
  toggleMenu: (menuName: string) => void;
  onLinkClick: () => void;
  canSee: (slug: string) => boolean;
}

export default function SidebarSectionOperacional({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee,
}: SidebarSectionOperacionalProps) {
  return (
    <Collapsible open={openMenu === "operacional"} onOpenChange={() => toggleMenu("operacional")}>
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton className={openMenu === "operacional" ? "bg-accent" : ""}>
            <Wrench className="h-4 w-4" />
            <span>Operacional</span>
            {openMenu === "operacional" ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {/* Dashboard */}
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          {/* Cadastro Geral */}
          <SidebarMenuSubItem>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70">
              Cadastro Geral
            </div>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/areas-projeto">
                <Building className="h-4 w-4" />
                <span>Áreas do Projeto</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/ccas">
                <Building className="h-4 w-4" />
                <span>CCAs</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          {/* Mecânica/Tubulação */}
          <SidebarMenuSubItem>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70">
              Mecânica/Tubulação
            </div>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/registros">
                <ClipboardList className="h-4 w-4" />
                <span>Registro de Campo - MEC</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/lista-registros">
                <Database className="h-4 w-4" />
                <span>Lista de Registros</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/relatorios-mecanica">
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/encarregados">
                <Users className="h-4 w-4" />
                <span>Encarregados</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/fluidos">
                <Droplets className="h-4 w-4" />
                <span>Fluidos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/linhas">
                <Network className="h-4 w-4" />
                <span>Linhas</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/juntas">
                <Link2 className="h-4 w-4" />
                <span>Juntas</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/atividades">
                <ClipboardList className="h-4 w-4" />
                <span>Atividades</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/equipamentos-mecanicos">
                <Settings className="h-4 w-4" />
                <span>Equipamentos Mecânicos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/valvulas">
                <Circle className="h-4 w-4" />
                <span>Válvulas</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/parametros">
                <Calculator className="h-4 w-4" />
                <span>Parâmetros SPEC</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/importacao-csv">
                <Upload className="h-4 w-4" />
                <span>Importação CSV</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>

          {/* Elétrica/Instrumentação */}
          <SidebarMenuSubItem>
            <div className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/70">
              Elétrica/Instrumentação
            </div>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-registros">
                <ClipboardList className="h-4 w-4" />
                <span>Registro de Campo - EIA</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-lista-registros">
                <Database className="h-4 w-4" />
                <span>Lista de Registros</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-relatorios">
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-encarregados">
                <Users className="h-4 w-4" />
                <span>Encarregados</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-atividades">
                <ClipboardList className="h-4 w-4" />
                <span>Atividades</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-disciplinas">
                <Database className="h-4 w-4" />
                <span>Disciplinas</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-desenhos">
                <PaintBucket className="h-4 w-4" />
                <span>Desenhos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-tipos-infraestrutura">
                <Building className="h-4 w-4" />
                <span>Tipos de Infraestrutura</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-infraestrutura">
                <HardDrive className="h-4 w-4" />
                <span>Infraestrutura</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-cabos">
                <Cable className="h-4 w-4" />
                <span>Cabos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-instrumentos">
                <Cpu className="h-4 w-4" />
                <span>Instrumentos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-equipamentos">
                <Zap className="h-4 w-4" />
                <span>Equipamentos Elétricos</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild onClick={onLinkClick}>
              <Link to="/operacional/eletrica-luminarias">
                <Lightbulb className="h-4 w-4" />
                <span>Luminárias</span>
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}
