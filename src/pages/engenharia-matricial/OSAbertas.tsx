import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, PlayCircle, X } from "lucide-react";
import { useOS } from "@/contexts/engenharia-matricial/OSContext";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function OSAbertas() {
  const { osList, avancarFase, updateOSStatus } = useOS();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filtrarHoje = params.get("hoje") === "1";
  const filtrarDisc = params.get("disc");
  
  const [osRejeitando, setOsRejeitando] = useState<number | null>(null);
  const [justificativaRejeicao, setJustificativaRejeicao] = useState("");
  const [loadingRejeicao, setLoadingRejeicao] = useState(false);
  
  const hojeISO = new Date().toISOString().split('T')[0];
  
  const osAbertas = osList.filter(os => {
    if (os.status !== "aberta") return false;
    if (filtrarHoje && os.dataAbertura !== hojeISO) return false;
    if (filtrarDisc && os.disciplina !== filtrarDisc) return false;
    return true;
  });

  const handleIniciarPlanejamento = (osId: number) => {
    avancarFase(osId);
    toast.success("OS enviada para planejamento com sucesso!");
  };

  const handleIniciarRejeicao = (osId: number) => {
    setOsRejeitando(osId);
    setJustificativaRejeicao("");
  };

  const handleCancelarRejeicao = () => {
    setOsRejeitando(null);
    setJustificativaRejeicao("");
  };

  const handleConfirmarRejeicao = () => {
    if (!justificativaRejeicao.trim()) {
      toast.error("Por favor, informe o motivo da rejeição.");
      return;
    }

    if (osRejeitando) {
      setLoadingRejeicao(true);
      updateOSStatus(osRejeitando, "rejeitada", `OS rejeitada pela Engenharia Matricial: ${justificativaRejeicao}`);
      
      toast.success("OS rejeitada com sucesso.");

      setOsRejeitando(null);
      setJustificativaRejeicao("");
      setLoadingRejeicao(false);
    }
  };

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Abertura de OS</h1>
          <p className="text-muted-foreground">
            {osAbertas.length} ordem{osAbertas.length !== 1 ? 's' : ''} de serviço aberta{osAbertas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/os/nova">
            <Button>Nova OS</Button>
          </Link>
        </div>
      </div>

      {osAbertas.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS aberta encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osAbertas.map((os) => (
            <Card key={os.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca}
                    <Badge variant="secondary">
                      {capitalizarTexto(os.status)}
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleIniciarPlanejamento(os.id)}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Enviar para planejamento
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleIniciarRejeicao(os.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                    <Link to={`/os/${os.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{capitalizarTexto(os.cliente)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.nomeSolicitante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavelEM}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de abertura</p>
                    <p className="font-medium">{formatDate(os.dataAbertura)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data compromissada</p>
                    <p className="font-medium">{formatDate(os.dataCompromissada)}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm text-muted-foreground">Valor SAO</p>
                    {os.valorOrcamento && os.valorOrcamento > 0 ? (
                      <>
                        <p className="font-medium text-lg text-primary">{formatCurrency(os.valorOrcamento)}</p>
                        <p className="text-xs text-muted-foreground">Valor informado pelo solicitante</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-lg text-amber-600">Não informado</p>
                        <p className="text-xs text-amber-600">Deverá ser preenchido no planejamento</p>
                      </>
                    )}
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Descrição</p>
                  <p className="text-sm">{os.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Rejeição */}
      <Dialog open={osRejeitando !== null} onOpenChange={(open) => !open && handleCancelarRejeicao()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar OS</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição desta ordem de serviço
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="justificativa" className="text-red-600">Justificativa *</Label>
              <Textarea
                id="justificativa"
                placeholder="Descreva o motivo da rejeição..."
                value={justificativaRejeicao}
                onChange={(e) => setJustificativaRejeicao(e.target.value)}
                className={!justificativaRejeicao ? "border-red-500" : ""}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelarRejeicao}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmarRejeicao}
              disabled={loadingRejeicao}
            >
              Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}