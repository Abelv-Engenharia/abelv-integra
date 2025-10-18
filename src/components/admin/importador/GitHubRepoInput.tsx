import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Loader2 } from 'lucide-react';
import { GitHubRepo } from '@/types/githubImport';
import { useToast } from '@/hooks/use-toast';

interface GitHubRepoInputProps {
  onConnect: (repo: GitHubRepo) => void;
  loading?: boolean;
}

export function GitHubRepoInput({ onConnect, loading }: GitHubRepoInputProps) {
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('main');
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

    onConnect({ url, branch, owner, repo });
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
