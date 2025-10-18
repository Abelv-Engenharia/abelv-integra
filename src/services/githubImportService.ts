import { FileNode, GitHubRepo } from '@/types/githubImport';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubImportService {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }

  parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\.]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2] };
      }
    }
    return null;
  }

  async validateRepo(repo: GitHubRepo): Promise<boolean> {
    try {
      const url = `${GITHUB_API_BASE}/repos/${repo.owner}/${repo.repo}`;
      const response = await fetch(url, { headers: this.getHeaders() });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getBranches(owner: string, repo: string): Promise<string[]> {
    try {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches`;
      const response = await fetch(url, { headers: this.getHeaders() });
      if (!response.ok) return [];
      const branches = await response.json();
      return branches.map((b: any) => b.name);
    } catch {
      return [];
    }
  }

  async getDirectoryContents(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<FileNode[]> {
    try {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await fetch(url, { headers: this.getHeaders() });
      if (!response.ok) return [];
      
      const contents = await response.json();
      return contents.map((item: any) => ({
        path: item.path,
        name: item.name,
        type: item.type === 'dir' ? 'directory' : 'file',
        selected: false,
        size: item.size,
        sha: item.sha,
      }));
    } catch {
      return [];
    }
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch: string
  ): Promise<string | null> {
    try {
      const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await fetch(url, { headers: this.getHeaders() });
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.encoding === 'base64') {
        return atob(data.content.replace(/\n/g, ''));
      }
      return data.content;
    } catch {
      return null;
    }
  }

  async getPackageJson(
    owner: string,
    repo: string,
    branch: string
  ): Promise<any | null> {
    const content = await this.getFileContent(owner, repo, 'package.json', branch);
    if (!content) return null;
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  async getRepoStructure(
    owner: string,
    repo: string,
    branch: string,
    targetPaths: string[] = ['src/pages', 'src/components', 'src/hooks', 'src/services']
  ): Promise<FileNode[]> {
    const nodes: FileNode[] = [];

    for (const targetPath of targetPaths) {
      const contents = await this.getDirectoryContents(owner, repo, targetPath, branch);
      if (contents.length > 0) {
        const folderNode: FileNode = {
          path: targetPath,
          name: targetPath.split('/').pop() || targetPath,
          type: 'directory',
          selected: false,
          children: contents,
        };
        nodes.push(folderNode);
      }
    }

    return nodes;
  }

  async expandDirectory(
    owner: string,
    repo: string,
    branch: string,
    node: FileNode
  ): Promise<FileNode[]> {
    if (node.type !== 'directory') return [];
    return await this.getDirectoryContents(owner, repo, node.path, branch);
  }
}
