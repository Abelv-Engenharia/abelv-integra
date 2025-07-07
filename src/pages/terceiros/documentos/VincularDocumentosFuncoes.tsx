
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VincularDocumentosFuncoes = () => {
  const { toast } = useToast();
  const [novaFuncao, setNovaFuncao] = useState("");
  const [documentosSelecionados, setDocumentosSelecionados] = useState<number[]>([]);

  const funcoes = [
    { id: 1, nome: "Técnico em Segurança", documentos: ["ASO", "Integração", "Certificação NR-35"] },
    { id: 2, nome: "Operador de Máquinas", documentos: ["ASO", "Integração", "Curso de Segurança"] },
    { id: 3, nome: "Auxiliar Administrativo", documentos: ["ASO", "Integração"] }
  ];

  const documentos = [
    { id: 1, nome: "ASO" },
    { id: 2, nome: "Integração" },
    { id: 3, nome: "Certificação NR-35" },
    { id: 4, nome: "Curso de Segurança" },
    { id: 5, nome: "Certificação NR-33" },
    { id: 6, nome: "Certificação NR-10" }
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
      title: "Função configurada",
      description: "A função foi configurada com os documentos obrigatórios.",
    });
    setNovaFuncao("");
    setDocumentosSelecionados([]);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vincular Documentos por Função</h1>
          <p className="text-muted-foreground">
            Defina quais documentos são obrigatórios para cada função
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nova Configuração de Função</CardTitle>
            <CardDescription>
              Configure os documentos obrigatórios para uma função
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="funcao">Nome da Função *</Label>
                <Input
                  id="funcao"
                  value={novaFuncao}
                  onChange={(e) => setNovaFuncao(e.target.value)}
                  placeholder="Ex: Técnico em Segurança, Operador..."
                  required
                />
              </div>

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
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={!novaFuncao || documentosSelecionados.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Configurar Função
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funções Configuradas</CardTitle>
            <CardDescription>
              Lista de funções e seus documentos obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funcoes.map((funcao) => (
                <div key={funcao.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{funcao.nome}</h4>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {funcao.documentos.map((doc, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VincularDocumentosFuncoes;
