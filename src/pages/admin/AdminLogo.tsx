
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

const AdminLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar a logo salva ao iniciar
  useEffect(() => {
    const savedLogo = localStorage.getItem("system-logo");
    if (savedLogo) {
      setLogoUrl(savedLogo);
      setPreviewUrl(savedLogo);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro ao carregar imagem",
          description: "A imagem deve ter no máximo 2MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Erro ao carregar arquivo",
          description: "O arquivo deve ser uma imagem.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      setIsLoading(true);
      
      // Simulando uma operação assíncrona
      setTimeout(() => {
        localStorage.setItem("system-logo", previewUrl);
        setLogoUrl(previewUrl);
        
        toast({
          title: "Logo salva com sucesso",
          description: "A nova logo foi configurada para o sistema.",
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    setLogoUrl(null);
    localStorage.removeItem("system-logo");
    
    toast({
      title: "Logo removida",
      description: "A logo foi removida do sistema.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuração de Logo</h1>
        <p className="text-muted-foreground">
          Configure a logo que será exibida no sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo do Sistema</CardTitle>
          <CardDescription>
            Faça upload de uma imagem para ser utilizada como logo no sistema. 
            Recomendamos usar uma imagem de até 200x60 pixels no formato PNG com transparência.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="logo">Logo</Label>
            <Input 
              id="logo" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="border rounded-md p-4">
            <p className="mb-2 text-sm text-muted-foreground">Visualização da logo:</p>
            <div className="h-20 flex items-center justify-center bg-slate-50 rounded">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Logo preview" 
                    className="max-h-16 max-w-full object-contain" 
                  />
                  <button 
                    onClick={() => setPreviewUrl(null)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma logo selecionada</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRemoveLogo} disabled={!logoUrl && !previewUrl}>
            Remover Logo
          </Button>
          <Button onClick={handleSave} disabled={!previewUrl || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogo;
