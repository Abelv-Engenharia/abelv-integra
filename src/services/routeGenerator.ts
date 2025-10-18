import { RouteConfig } from '@/types/githubImport';

export class RouteGenerator {
  generateRouteCode(config: RouteConfig): string {
    const componentName = config.component.split('/').pop()?.replace('.tsx', '') || 'Component';
    
    return `<Route path="${config.path}" element={<${componentName} />} />`;
  }

  generateImportCode(config: RouteConfig): string {
    const componentName = config.component.split('/').pop()?.replace('.tsx', '') || 'Component';
    
    return `import ${componentName} from '@/${config.component.replace('.tsx', '')}';`;
  }

  generateMenuItemCode(config: RouteConfig): string {
    return `{
  title: "${config.title}",
  href: "${config.path}",
  icon: ${config.icon || 'FileText'},
  description: "Página importada"
}`;
  }

  detectPageFiles(files: string[]): RouteConfig[] {
    const pageFiles = files.filter(f => 
      f.startsWith('src/pages/') && 
      (f.endsWith('.tsx') || f.endsWith('.jsx'))
    );

    return pageFiles.map(filePath => {
      const fileName = filePath.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || '';
      const routePath = this.generateRoutePath(filePath);

      return {
        path: routePath,
        component: filePath,
        title: this.formatTitle(fileName),
        icon: 'FileText',
        addToMenu: false,
      };
    });
  }

  private generateRoutePath(filePath: string): string {
    // Remove src/pages/ and file extension
    let path = filePath
      .replace(/^src\/pages\//, '')
      .replace(/\.(tsx|jsx)$/, '');

    // Convert Index to root
    if (path.toLowerCase().endsWith('index')) {
      path = path.replace(/index$/i, '');
    }

    // Convert to lowercase and add leading slash
    path = '/' + path.toLowerCase().replace(/\\/g, '/');

    // Remove trailing slash
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return path;
  }

  private formatTitle(fileName: string): string {
    // Convert PascalCase or camelCase to Title Case
    return fileName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  extractPermissionsFromFile(content: string): string[] {
    const permissions: Set<string> = new Set();
    
    // hasPermission('permission_name')
    const hasPermRegex = /hasPermission\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = hasPermRegex.exec(content)) !== null) {
      permissions.add(match[1]);
    }

    // canAccessMenu('menu_name')
    const canAccessRegex = /canAccessMenu\(['"]([^'"]+)['"]\)/g;
    while ((match = canAccessRegex.exec(content)) !== null) {
      permissions.add(match[1]);
    }

    return Array.from(permissions);
  }
}
