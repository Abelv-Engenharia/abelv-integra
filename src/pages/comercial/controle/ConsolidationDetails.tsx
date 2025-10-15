import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { usePropostasComerciais, PropostaComercial } from "@/hooks/comercial/usePropostasComerciais";

const ConsolidationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { propostas, isLoading, updateProposta } = usePropostasComerciais();

  const [formData, setFormData] = useState({
    data_assinatura_contrato_real: "",
    data_termino_contrato_prevista: "",
    data_entrega_orcamento_executivo_prevista: "",
    data_entrega_orcamento_executivo_real: "",
  });

  const [proposta, setProposta] = useState<PropostaComercial | null>(null);

  useEffect(() => {
    if (!isLoading && propostas.length > 0) {
      const propostaEncontrada = propostas.find((item) => item.id === id);
      
      if (propostaEncontrada) {
        setProposta(propostaEncontrada);
        
        // Carregar dados existentes se houver
        setFormData({
          data_assinatura_contrato_real: propostaEncontrada.data_assinatura_contrato_real || "",
          data_termino_contrato_prevista: propostaEncontrada.data_termino_contrato_prevista || "",
          data_entrega_orcamento_executivo_prevista: propostaEncontrada.data_entrega_orcamento_executivo_prevista || "",
          data_entrega_orcamento_executivo_real: propostaEncontrada.data_entrega_orcamento_executivo_real || "",
        });
      }
    }
  }, [id, propostas, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!formData.data_assinatura_contrato_real || 
        !formData.data_termino_contrato_prevista || 
        !formData.data_entrega_orcamento_executivo_prevista || 
        !formData.data_entrega_orcamento_executivo_real) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos devem ser preenchidos para propostas contempladas.",
        variant: "destructive",
      });
      return;
    }

    if (!proposta) return;

    try {
      await updateProposta(proposta.id, formData);
      
      toast({
        title: "Sucesso!",
        description: "Detalhes da consolidação salvos com sucesso.",
      });

      navigate("/comercial/controle/registros");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os detalhes da consolidação.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Carregando proposta...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Proposta não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (proposta.status !== "Contemplado") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Esta funcionalidade está disponível apenas para propostas com status "Contemplado".
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate("/comercial/controle/registros")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/comercial/controle/registros")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalhes da Consolidação</h1>
          <p className="text-muted-foreground">PC: {proposta.pc} - {proposta.cliente}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações de Consolidação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data_assinatura_contrato_real">
                  Data de Assinatura do Contrato (Real) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_assinatura_contrato_real"
                  type="date"
                  value={formData.data_assinatura_contrato_real}
                  onChange={(e) =>
                    handleInputChange("data_assinatura_contrato_real", e.target.value)
                  }
                  className={!formData.data_assinatura_contrato_real ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_termino_contrato_prevista">
                  Data de Término do Contrato (Prevista) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_termino_contrato_prevista"
                  type="date"
                  value={formData.data_termino_contrato_prevista}
                  onChange={(e) =>
                    handleInputChange("data_termino_contrato_prevista", e.target.value)
                  }
                  className={!formData.data_termino_contrato_prevista ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_entrega_orcamento_executivo_prevista">
                  Data de Entrega do Orçamento Executivo (Prevista) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_entrega_orcamento_executivo_prevista"
                  type="date"
                  value={formData.data_entrega_orcamento_executivo_prevista}
                  onChange={(e) =>
                    handleInputChange("data_entrega_orcamento_executivo_prevista", e.target.value)
                  }
                  className={!formData.data_entrega_orcamento_executivo_prevista ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_entrega_orcamento_executivo_real">
                  Data de Entrega do Orçamento Executivo (Real) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="data_entrega_orcamento_executivo_real"
                  type="date"
                  value={formData.data_entrega_orcamento_executivo_real}
                  onChange={(e) =>
                    handleInputChange("data_entrega_orcamento_executivo_real", e.target.value)
                  }
                  className={!formData.data_entrega_orcamento_executivo_real ? "border-destructive" : ""}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/comercial/controle/registros")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidationDetails;
