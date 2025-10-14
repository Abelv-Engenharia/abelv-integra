import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { commercialMockData } from "@/data/commercialMockData";
import { CommercialSpreadsheet } from "@/types/commercial";

const ConsolidationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dataassinaturacontratoreal: "",
    dataterminocontratoprevista: "",
    dataentregaorcamentoexecutivoprevista: "",
    dataentregaorcamentoexecutivoreal: "",
  });

  const [proposta, setProposta] = useState<CommercialSpreadsheet | null>(null);

  useEffect(() => {
    // Carregar dados da proposta
    const propostaEncontrada = commercialMockData.find((item) => item.id === id);
    
    if (propostaEncontrada) {
      setProposta(propostaEncontrada);
      
      // Carregar dados existentes se houver
      setFormData({
        dataassinaturacontratoreal: propostaEncontrada.dataassinaturacontratoreal || "",
        dataterminocontratoprevista: propostaEncontrada.dataterminocontratoprevista || "",
        dataentregaorcamentoexecutivoprevista: propostaEncontrada.dataentregaorcamentoexecutivoprevista || "",
        dataentregaorcamentoexecutivoreal: propostaEncontrada.dataentregaorcamentoexecutivoreal || "",
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!formData.dataassinaturacontratoreal || 
        !formData.dataterminocontratoprevista || 
        !formData.dataentregaorcamentoexecutivoprevista || 
        !formData.dataentregaorcamentoexecutivoreal) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos devem ser preenchidos para propostas contempladas.",
        variant: "destructive",
      });
      return;
    }

    // Simular salvamento
    toast({
      title: "Sucesso!",
      description: "Detalhes da consolidação salvos com sucesso.",
    });

    navigate("/comercial/controle/registros");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
                <Label htmlFor="dataassinaturacontratoreal">
                  Data de assinatura do contrato (real) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataassinaturacontratoreal"
                  type="date"
                  value={formData.dataassinaturacontratoreal}
                  onChange={(e) =>
                    handleInputChange("dataassinaturacontratoreal", e.target.value)
                  }
                  className={!formData.dataassinaturacontratoreal ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataterminocontratoprevista">
                  Data de término do contrato (prevista) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataterminocontratoprevista"
                  type="date"
                  value={formData.dataterminocontratoprevista}
                  onChange={(e) =>
                    handleInputChange("dataterminocontratoprevista", e.target.value)
                  }
                  className={!formData.dataterminocontratoprevista ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataentregaorcamentoexecutivoprevista">
                  Data de entrega do orçamento executivo (prevista) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataentregaorcamentoexecutivoprevista"
                  type="date"
                  value={formData.dataentregaorcamentoexecutivoprevista}
                  onChange={(e) =>
                    handleInputChange("dataentregaorcamentoexecutivoprevista", e.target.value)
                  }
                  className={!formData.dataentregaorcamentoexecutivoprevista ? "border-destructive" : ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataentregaorcamentoexecutivoreal">
                  Data de entrega do orçamento executivo (real) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dataentregaorcamentoexecutivoreal"
                  type="date"
                  value={formData.dataentregaorcamentoexecutivoreal}
                  onChange={(e) =>
                    handleInputChange("dataentregaorcamentoexecutivoreal", e.target.value)
                  }
                  className={!formData.dataentregaorcamentoexecutivoreal ? "border-destructive" : ""}
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
