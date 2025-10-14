import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { vendedorOptions } from "@/data/commercialMockData";

export default function VendedorManagement() {
  const [vendedores, setVendedores] = useState<string[]>([...vendedorOptions]);
  const [novoVendedor, setNovoVendedor] = useState("");

  const handleAdicionar = () => {
    if (!novoVendedor.trim()) {
      toast.error("Digite um nome para o vendedor");
      return;
    }

    if (vendedores.includes(novoVendedor.trim())) {
      toast.error("Este vendedor já existe");
      return;
    }

    setVendedores([...vendedores, novoVendedor.trim()]);
    setNovoVendedor("");
    toast.success("Vendedor adicionado com sucesso");
  };

  const handleRemover = (vendedor: string) => {
    setVendedores(vendedores.filter((v) => v !== vendedor));
    toast.success("Vendedor removido com sucesso");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Vendedores</h1>
        <p className="text-muted-foreground">
          Adicione ou remova vendedores da equipe
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do vendedor"
              value={novoVendedor}
              onChange={(e) => setNovoVendedor(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdicionar()}
            />
            <Button onClick={handleAdicionar}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendedores Cadastrados ({vendedores.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {vendedores.map((vendedor) => (
              <div
                key={vendedor}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
              >
                <span>{vendedor}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemover(vendedor)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
