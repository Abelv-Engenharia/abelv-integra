import { DependencyDiff } from '@/types/githubImport';

export class DependencyAnalyzer {
  analyzeDependencies(
    sourcePackageJson: any,
    targetPackageJson: any
  ): DependencyDiff {
    const sourceDeps = {
      ...sourcePackageJson.dependencies,
      ...sourcePackageJson.devDependencies,
    };

    const targetDeps = {
      ...targetPackageJson.dependencies,
      ...targetPackageJson.devDependencies,
    };

    const missing: Record<string, string> = {};
    const outdated: Record<string, { current: string; available: string }> = {};
    const extra: Record<string, string> = {};

    // Find missing and outdated
    for (const [pkg, version] of Object.entries(sourceDeps)) {
      if (!targetDeps[pkg]) {
        missing[pkg] = version as string;
      } else if (targetDeps[pkg] !== version) {
        outdated[pkg] = {
          current: targetDeps[pkg] as string,
          available: version as string,
        };
      }
    }

    // Find extra (in target but not in source)
    for (const [pkg, version] of Object.entries(targetDeps)) {
      if (!sourceDeps[pkg]) {
        extra[pkg] = version as string;
      }
    }

    return { missing, outdated, extra };
  }

  generateInstallCommands(dependencies: Record<string, string>): string[] {
    return Object.entries(dependencies).map(
      ([pkg, version]) => `${pkg}@${version}`
    );
  }

  detectImportsInFile(content: string): string[] {
    const imports: string[] = [];
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      // Only external packages (not relative imports)
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        const packageName = importPath.startsWith('@')
          ? importPath.split('/').slice(0, 2).join('/')
          : importPath.split('/')[0];
        imports.push(packageName);
      }
    }

    return [...new Set(imports)];
  }
}
