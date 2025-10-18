import { useState } from 'react';
import { RouteConfig } from '@/types/githubImport';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface RouteRegistrationProps {
  routes: RouteConfig[];
  onRegister: (route: RouteConfig) => void;
}

export function RouteRegistration({ routes, onRegister }: RouteRegistrationProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteConfig | null>(null);
  const [editedRoute, setEditedRoute] = useState<RouteConfig | null>(null);

  const handleSelectRoute = (route: RouteConfig) => {
    setSelectedRoute(route);
    setEditedRoute({ ...route });
  };

  const handleRegister = () => {
    if (editedRoute) {
      onRegister(editedRoute);
      setSelectedRoute(null);
      setEditedRoute(null);
    }
  };

  if (routes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma página detectada para registro de rota</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Páginas importadas</Label>
        <div className="border rounded-lg divide-y max-h-96 overflow-auto">
          {routes.map((route, index) => (
            <button
              key={index}
              onClick={() => handleSelectRoute(route)}
              className="w-full text-left p-3 hover:bg-accent transition-colors"
            >
              <p className="font-medium text-sm">{route.title}</p>
              <p className="text-xs text-muted-foreground">{route.component}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {editedRoute ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="route-path">Path da rota</Label>
              <Input
                id="route-path"
                value={editedRoute.path}
                onChange={(e) => setEditedRoute({ ...editedRoute, path: e.target.value })}
                placeholder="/minha-rota"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-title">Título do menu</Label>
              <Input
                id="route-title"
                value={editedRoute.title}
                onChange={(e) => setEditedRoute({ ...editedRoute, title: e.target.value })}
                placeholder="Título"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-permission">Permissão necessária</Label>
              <Input
                id="route-permission"
                value={editedRoute.permission || ''}
                onChange={(e) => setEditedRoute({ ...editedRoute, permission: e.target.value })}
                placeholder="nome_permissao"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-to-menu"
                checked={editedRoute.addToMenu}
                onCheckedChange={(checked) => 
                  setEditedRoute({ ...editedRoute, addToMenu: checked as boolean })
                }
              />
              <Label htmlFor="add-to-menu" className="cursor-pointer">
                Adicionar ao menu lateral
              </Label>
            </div>

            <Card className="p-3 bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4" />
                <span className="text-sm font-medium">Preview do código</span>
              </div>
              <Textarea
                value={`<Route path="${editedRoute.path}" element={<${editedRoute.component.split('/').pop()?.replace('.tsx', '')} />} />`}
                readOnly
                className="font-mono text-xs"
                rows={3}
              />
            </Card>

            <Button onClick={handleRegister} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Registrar rota
            </Button>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Selecione uma página para configurar</p>
          </div>
        )}
      </div>
    </div>
  );
}
