export interface GitHubRepo {
  url: string;
  branch: string;
  owner: string;
  repo: string;
}

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  selected: boolean;
  content?: string;
  size?: number;
  sha?: string;
}

export interface DependencyDiff {
  missing: Record<string, string>;
  outdated: Record<string, { current: string; available: string }>;
  extra: Record<string, string>;
}

export interface ImportConflict {
  path: string;
  resolution: 'overwrite' | 'rename' | 'skip' | 'merge';
  newName?: string;
  existingContent?: string;
  newContent?: string;
}

export interface ImportLog {
  timestamp: Date;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  file?: string;
}

export interface RouteConfig {
  path: string;
  component: string;
  title: string;
  icon?: string;
  permission?: string;
  addToMenu: boolean;
  menuSection?: string;
}

export interface PostImportCheck {
  category: 'env' | 'tailwind' | 'supabase' | 'dependencies';
  status: 'pending' | 'completed' | 'error';
  items: {
    name: string;
    checked: boolean;
    required: boolean;
    details?: string;
  }[];
}

export interface MenuDestination {
  type: 'existing' | 'new';
  existingSection?: 'admin' | 'gestao-sms' | 'tarefas' | 'seguranca' | 'apoio-geral' | 'suprimentos' | 'engenharia-matricial' | 'comercial';
  newSectionName?: string;
  newSectionIcon?: string;
}

export interface ImportSummary {
  filesImported: number;
  savedFiles: { source: string; destination: string }[];
  routesCreated: RouteConfig[];
  menuDestination: MenuDestination | null;
  warnings: PostImportCheck[];
  timestamp: Date;
}

export type ImportStep = 
  | 'connection'
  | 'selection'
  | 'dependencies'
  | 'conflicts'
  | 'importing'
  | 'routes'
  | 'checklist';
