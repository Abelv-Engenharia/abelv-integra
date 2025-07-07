
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CadastroDocumentos = () => {
  const { toast } = useToast();
  const [documentos, setDocumentos] = useState([
    { id: 1, nome: "ASO", obrigatorio: true, validadeDias: 365 },
    { id: 2, nome: "Integração", obrigatorio: true, validadeDias: 730 },
    { id: 3, nome: "Certificação NR-35", obrigatorio: false, validadeDias: 365 }
  ]);

  const [novoDocumento, setNovoDocumento] = useState({
    nome: "",
    obrigatorio: true,
    validadeDias: 365,
    descricao: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = documentos.length + 1;
    setDocumentos([...documentos, { id, ...novoDocumento }]);
    setNovoDocumento({ nome: "", obrigatorio: true, validadeDias: 365, descricao: "" });
    toast({
      title: "Documento cadastrado",
      description: "O tipo de documento foi cadastrado com sucesso.",
    });
  };

  const handleChange = (field: string, value: any) => {
    setNovoDocumento(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Documentos</h1>
          <p className="text-muted-foreground">
            Configure os tipos de documentos obrigatórios
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novo Tipo de Documento</CardTitle>
            <CardDescription>
              Cadastre um novo tipo de documento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Documento *</Label>
                <Input
                  id="nome"
                  value={novoDocumento.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Ex: ASO, Integração, Certificação..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validadeDias">Validade (dias)</Label>
                <Input
                  id="validadeDias"
                  type="number"
                  value={novoDocumento.validadeDias}
                  onChange={(e) => handleChange("validadeDias", parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="obrigatorio"
                  checked={novoDocumento.obrigatorio}
                  onCheckedChange={(checked) => handleChange("obrigatorio", checked)}
                />
                <Label htmlFor="obrigatorio">Documento obrigatório</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoDocumento.descricao}
                  onChange={(e) => handleChange("descricao", e.target.value)}
                  placeholder="Descrição do documento..."
                />
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Documento
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Cadastrados</CardTitle>
            <CardDescription>
              Lista de tipos de documentos configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{doc.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Validade: {doc.validadeDias} dias
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.obrigatorio && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    )}
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
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

export default CadastroDocumentos;
