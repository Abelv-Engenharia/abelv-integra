import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { GitBranch, Loader2, ExternalLink } from 'lucide-react';
import { GitHubRepo } from '@/types/githubImport';
import { useToast } from '@/hooks/use-toast';

interface GitHubRepoInputProps {
  onConnect: (repo: GitHubRepo & { token?: string }) => void;
  loading?: boolean;
}

export function GitHubRepoInput({ onConnect, loading }: GitHubRepoInputProps) {
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [isPrivate, setIsPrivate] = useState(false);
  const [token, setToken] = useState('');
  const { toast } = useToast();

  const handleConnect = () => {
    if (!url.trim()) {
      toast({
        title: 'Url inválida',
        description: 'Informe a URL do repositório',
        variant: 'destructive',
      });
      return;
    }

    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\.]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/
    ];

    let owner = '';
    let repo = '';

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        owner = match[1];
        repo = match[2];
        break;
      }
    }

    if (!owner || !repo) {
      toast({
        title: 'Url inválida',
        description: 'URL do GitHub não reconhecida',
        variant: 'destructive',
      });
      return;
    }

    onConnect({ url, branch, owner, repo, token: isPrivate ? token : undefined });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="repo-url">Url do repositório</Label>
        <Input
          id="repo-url"
          placeholder="https://github.com/usuario/repositorio.git"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Select value={branch} onValueChange={setBranch} disabled={loading}>
          <SelectTrigger id="branch">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="master">Master</SelectItem>
            <SelectItem value="develop">Develop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="private-repo" 
          checked={isPrivate} 
          onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
          disabled={loading}
        />
        <Label htmlFor="private-repo" className="cursor-pointer">
          Repositório privado?
        </Label>
      </div>

      {isPrivate && (
        <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
          <Label htmlFor="github-token">Personal Access Token</Label>
          <Input
            id="github-token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={loading}
          />
          <a 
            href="https://github.com/settings/tokens/new?scopes=repo&description=Importador%20Github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Como criar um Personal Access Token
          </a>
          <p className="text-xs text-muted-foreground">
            Permissões necessárias: <strong>repo</strong> (leitura)
          </p>
        </div>
      )}

      <Button
        onClick={handleConnect} 
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            <GitBranch className="mr-2 h-4 w-4" />
            Conectar
          </>
        )}
      </Button>
    </div>
  );
}
