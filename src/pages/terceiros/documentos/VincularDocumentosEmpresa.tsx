
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VincularDocumentosEmpresa = () => {
  const { toast } = useToast();
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  const [documentosSelecionados, setDocumentosSelecionados] = useState<number[]>([]);

  const empresas = [
    { id: "empresa1", nome: "Empresa Terceirizada Ltda" },
    { id: "empresa2", nome: "Prestadora de Serviços SA" },
    { id: "empresa3", nome: "Terceirizada Exemplo Ltda" }
  ];

  const documentos = [
    { id: 1, nome: "ASO", obrigatorio: true },
    { id: 2, nome: "Integração", obrigatorio: true },
    { id: 3, nome: "Certificação NR-35", obrigatorio: false },
    { id: 4, nome: "Curso de Segurança", obrigatorio: false }
  ];

  const handleDocumentoChange = (documentoId: number, checked: boolean) => {
    if (checked) {
      setDocumentosSelecionados([...documentosSelecionados, documentoId]);
    } else {
      setDocumentosSelecionados(documentosSelecionados.filter(id => id !== documentoId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Vinculação realizada",
      description: "Os documentos foram vinculados à empresa com sucesso.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vincular Documentos por Empresa</h1>
          <p className="text-muted-foreground">
            Defina quais documentos são obrigatórios para cada empresa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Documentos por Empresa</CardTitle>
          <CardDescription>
            Selecione uma empresa e defina os documentos obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {empresaSelecionada && (
              <div className="space-y-4">
                <Label>Documentos Obrigatórios</Label>
                <div className="space-y-3">
                  {documentos.map((documento) => (
                    <div key={documento.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doc-${documento.id}`}
                        checked={documentosSelecionados.includes(documento.id)}
                        onCheckedChange={(checked) => 
                          handleDocumentoChange(documento.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`doc-${documento.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {documento.nome}
                        {documento.obrigatorio && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Padrão
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" disabled={!empresaSelecionada || documentosSelecionados.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Vinculação
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Configurações Atuais</CardTitle>
          <CardDescription>
            Documentos já configurados por empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Empresa Terceirizada Ltda</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Documentos: ASO, Integração, Certificação NR-35
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium">Prestadora de Serviços SA</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Documentos: ASO, Integração
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VincularDocumentosEmpresa;
