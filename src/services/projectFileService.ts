import { RouteConfig, MenuDestination } from '@/types/githubImport';

export class ProjectFileService {
  // Determina o destino de um arquivo baseado em seu caminho de origem
  determineDestination(sourcePath: string): string {
    // Remove prefixos comuns do repo de origem
    let cleanPath = sourcePath.replace(/^(src\/)?/, '');
    
    // Se já começa com src/, mantém
    if (sourcePath.startsWith('src/')) {
      return sourcePath;
    }
    
    // Determina o destino baseado no tipo de arquivo
    if (cleanPath.includes('pages/') || cleanPath.endsWith('.page.tsx')) {
      return `src/pages/${cleanPath.replace('pages/', '')}`;
    }
    
    if (cleanPath.includes('components/')) {
      return `src/components/${cleanPath.replace('components/', '')}`;
    }
    
    if (cleanPath.includes('hooks/')) {
      return `src/hooks/${cleanPath.replace('hooks/', '')}`;
    }
    
    if (cleanPath.includes('services/')) {
      return `src/services/${cleanPath.replace('services/', '')}`;
    }
    
    if (cleanPath.includes('types/')) {
      return `src/types/${cleanPath.replace('types/', '')}`;
    }
    
    if (cleanPath.includes('utils/')) {
      return `src/utils/${cleanPath.replace('utils/', '')}`;
    }
    
    // Padrão: coloca em src/
    return `src/${cleanPath}`;
  }

  // Retorna o nome do arquivo de seção da sidebar baseado na seção escolhida
  getSidebarSectionFile(section: string): string | null {
    const sectionMap: Record<string, string> = {
      'admin': 'src/components/layout/SidebarSectionAdministracao.tsx',
      'gestao-sms': 'src/components/layout/SidebarSectionGestaoSMS.tsx',
      'tarefas': 'src/components/layout/SidebarSectionTarefas.tsx',
      'seguranca': 'src/components/layout/SidebarSectionSeguranca.tsx',
      'apoio-geral': 'src/components/layout/SidebarSectionApoioGeral.tsx',
      'suprimentos': 'src/components/layout/SidebarSectionSuprimentos.tsx',
      'engenharia-matricial': 'src/components/layout/SidebarSectionEngenhariaMatricial.tsx',
      'comercial': 'src/components/layout/SidebarSectionComercial.tsx',
    };
    
    return sectionMap[section] || null;
  }

  // Gera código para adicionar rotas ao App.tsx
  generateRouteCode(routes: RouteConfig[]): string {
    return routes.map(route => {
      const componentName = route.component.split('/').pop()?.replace('.tsx', '') || 'Component';
      return `                <Route path="${route.path}" element={<${componentName} />} />`;
    }).join('\n');
  }

  // Gera código de imports para componentes
  generateImportCode(routes: RouteConfig[]): string {
    return routes.map(route => {
      const componentName = route.component.split('/').pop()?.replace('.tsx', '') || 'Component';
      // Remove src/ do início se existir
      const importPath = route.component.replace(/^src\//, '').replace('.tsx', '');
      return `import ${componentName} from "./${importPath}";`;
    }).join('\n');
  }

  // Gera código para itens de menu da sidebar
  generateSidebarMenuItems(routes: RouteConfig[]): string {
    return routes
      .filter(route => route.addToMenu)
      .map(route => {
        const icon = route.icon || 'FileText';
        return `          {
            title: "${route.title}",
            path: "${route.path}",
            icon: ${icon},
            permission: ${route.permission ? `"${route.permission}"` : 'undefined'},
          }`;
      })
      .join(',\n');
  }

  // Gera atualizações completas para o App.tsx
  generateAppTsxUpdates(routes: RouteConfig[]): { imports: string; routes: string } {
    return {
      imports: this.generateImportCode(routes),
      routes: this.generateRouteCode(routes)
    };
  }

  // Gera atualizações completas para o sidebar
  generateSidebarUpdate(
    menuDestination: MenuDestination,
    routes: RouteConfig[]
  ): {
    componentCode?: string;
    componentPath?: string;
    sidebarImport?: string;
    sidebarUsage?: string;
  } {
    if (menuDestination.type === 'new') {
      const sectionName = menuDestination.newSectionName || 'NovaSecao';
      const icon = menuDestination.newSectionIcon || 'FolderGit2';
      const componentPath = `src/components/layout/SidebarSection${sectionName.replace(/[^a-zA-Z0-9]/g, '')}.tsx`;
      const componentName = `SidebarSection${sectionName.replace(/[^a-zA-Z0-9]/g, '')}`;
      
      return {
        componentCode: this.generateSidebarSectionTemplate(sectionName, icon, routes),
        componentPath,
        sidebarImport: `import ${componentName} from './${componentPath.replace('src/components/layout/', '')}';`,
        sidebarUsage: `<${componentName}
  openMenu={openMenu}
  toggleMenu={toggleMenu}
  onLinkClick={handleLinkClick}
  canSee={canSee}
/>`
      };
    } else {
      const sectionFile = this.getSidebarSectionFile(menuDestination.existingSection || '');
      return {
        sidebarImport: `// Adicionar itens no arquivo: ${sectionFile}`,
        sidebarUsage: this.generateSidebarMenuItems(routes.filter(r => r.addToMenu))
      };
    }
  }

  // Gera template de uma nova seção de sidebar
  generateSidebarSectionTemplate(sectionName: string, icon: string, routes: RouteConfig[]): string {
    const menuItems = routes
      .filter(r => r.addToMenu)
      .map(r => ({
        title: r.title,
        path: r.path,
        icon: r.icon || 'FileText',
        permission: r.permission,
      }));

    return `import React from 'react';
import { ${icon}, ${menuItems.map(m => m.icon).filter((v, i, a) => a.indexOf(v) === i).join(', ')} } from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarSection${sectionName.replace(/[^a-zA-Z0-9]/g, '')}Props {
  openMenu: string | null;
  toggleMenu: (menu: string) => void;
  onLinkClick: () => void;
  canSee?: (permission: string) => boolean;
}

export default function SidebarSection${sectionName.replace(/[^a-zA-Z0-9]/g, '')}({
  openMenu,
  toggleMenu,
  onLinkClick,
  canSee = () => true,
}: SidebarSection${sectionName.replace(/[^a-zA-Z0-9]/g, '')}Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useSidebar();

  const menuItems = [
${menuItems.map(item => `    {
      title: '${item.title}',
      path: '${item.path}',
      icon: ${item.icon},
      ${item.permission ? `permission: '${item.permission}',` : ''}
    }`).join(',\n')}
  ];

  const visibleItems = menuItems.filter(item => !item.permission || canSee(item.permission));

  if (visibleItems.length === 0) return null;

  return (
    <Collapsible open={openMenu === '${sectionName.toLowerCase().replace(/\s+/g, '-')}'} onOpenChange={() => toggleMenu('${sectionName.toLowerCase().replace(/\s+/g, '-')}')}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
          <div className="flex items-center gap-2">
            <${icon} className="h-4 w-4" />
            {state !== 'collapsed' && <span>${sectionName}</span>}
          </div>
          {state !== 'collapsed' && (
            openMenu === '${sectionName.toLowerCase().replace(/\s+/g, '-')}' ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === item.path}
                  onClick={onLinkClick}
                >
                  <Link to={item.path}>
                    <Icon className="h-4 w-4" />
                    {state !== 'collapsed' && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}
`;
  }
}
