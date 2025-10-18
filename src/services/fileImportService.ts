import { FileNode, ImportConflict, ImportLog } from '@/types/githubImport';

export class FileImportService {
  private logs: ImportLog[] = [];

  getLogs(): ImportLog[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }

  private addLog(type: ImportLog['type'], message: string, file?: string): void {
    this.logs.push({
      timestamp: new Date(),
      type,
      message,
      file,
    });
  }

  detectConflicts(
    filesToImport: FileNode[],
    existingFiles: string[]
  ): ImportConflict[] {
    const conflicts: ImportConflict[] = [];

    for (const file of filesToImport) {
      if (file.type === 'file' && existingFiles.includes(file.path)) {
        conflicts.push({
          path: file.path,
          resolution: 'skip',
          newName: this.generateConflictName(file.path),
        });
      }
    }

    return conflicts;
  }

  private generateConflictName(path: string): string {
    const timestamp = Date.now();
    const parts = path.split('.');
    const ext = parts.pop();
    const name = parts.join('.');
    return `${name}_imported.${timestamp}.${ext}`;
  }

  async importFiles(
    files: FileNode[],
    conflicts: ImportConflict[],
    getFileContent: (path: string) => Promise<string | null>
  ): Promise<{ success: number; failed: number; skipped: number }> {
    let success = 0;
    let failed = 0;
    let skipped = 0;

    this.clearLogs();

    for (const file of files) {
      if (file.type !== 'file' || !file.selected) continue;

      const conflict = conflicts.find(c => c.path === file.path);
      
      if (conflict && conflict.resolution === 'skip') {
        skipped++;
        this.addLog('warning', `Arquivo ignorado devido a conflito`, file.path);
        continue;
      }

      try {
        const content = await getFileContent(file.path);
        if (!content) {
          failed++;
          this.addLog('error', `Falha ao obter conteúdo`, file.path);
          continue;
        }

        const targetPath = conflict && conflict.resolution === 'rename'
          ? conflict.newName!
          : file.path;

        // Aqui seria a lógica real de criação de arquivo
        // Como não temos acesso ao sistema de arquivos, apenas logamos
        this.addLog('info', `Pronto para criar: ${targetPath}`, file.path);
        success++;
      } catch (error) {
        failed++;
        this.addLog('error', `Erro: ${error}`, file.path);
      }
    }

    this.addLog('success', `Importação concluída: ${success} sucesso, ${failed} falhas, ${skipped} ignorados`);
    
    return { success, failed, skipped };
  }

  extractEnvVariables(content: string): string[] {
    const envVars: Set<string> = new Set();
    
    // process.env.VAR_NAME
    const processEnvRegex = /process\.env\.([A-Z_]+)/g;
    let match;
    while ((match = processEnvRegex.exec(content)) !== null) {
      envVars.add(match[1]);
    }

    // import.meta.env.VITE_VAR_NAME
    const viteEnvRegex = /import\.meta\.env\.([A-Z_]+)/g;
    while ((match = viteEnvRegex.exec(content)) !== null) {
      envVars.add(match[1]);
    }

    return Array.from(envVars);
  }

  extractSupabaseTables(content: string): string[] {
    const tables: Set<string> = new Set();
    
    // supabase.from('table_name')
    const fromRegex = /supabase\.from\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = fromRegex.exec(content)) !== null) {
      tables.add(match[1]);
    }

    return Array.from(tables);
  }

  extractShadcnComponents(content: string): string[] {
    const components: Set<string> = new Set();
    
    // import { Component } from '@/components/ui/component'
    const uiImportRegex = /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
    let match;
    while ((match = uiImportRegex.exec(content)) !== null) {
      components.add(match[1]);
    }

    return Array.from(components);
  }
}
