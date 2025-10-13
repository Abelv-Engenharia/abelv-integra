import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Check, X, AlertTriangle } from "lucide-react";
import { useOS } from "@/contexts/OSContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function OSAguardandoAceite() {
  const { osList, aprovarPlanejamento, updateOSStatus } = useOS();
  const { toast } = useToast();
  const [osParaRejeitar, setOsParaRejeitar] = useState<number | null>(null);
  const [justificativaRejeicao, setJustificativaRejeicao] = useState("");
  const [loading, setLoading] = useState(false);
  
  const osAguardandoAceite = osList.filter(os => os.status === "aguardando-aceite");

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

  const handleAprovar = (osId: number) => {
    aprovarPlanejamento(osId);
    toast({
      title: "Planejamento aprovado",
      description: "OS iniciada com sucesso.",
    });
  };

  const handleIniciarRejeicao = (osId: number) => {
    setOsParaRejeitar(osId);
    setJustificativaRejeicao("");
  };

  const handleCancelarRejeicao = () => {
    setOsParaRejeitar(null);
    setJustificativaRejeicao("");
  };

  const handleConfirmarRejeicao = async () => {
    if (!justificativaRejeicao.trim()) {
      toast({
        title: "Justificativa obrigatória",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive"
      });
      return;
    }

    if (!osParaRejeitar) return;

    setLoading(true);
    try {
      updateOSStatus(osParaRejeitar, "aberta", justificativaRejeicao.trim());
      toast({
        title: "Planejamento rejeitado",
        description: "OS retornada para status aberta com justificativa.",
        variant: "destructive"
      });
      handleCancelarRejeicao();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao rejeitar planejamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OS Aguardando aceite</h1>
          <p className="text-muted-foreground">
            {osAguardandoAceite.length} ordem{osAguardandoAceite.length !== 1 ? 's' : ''} de serviço aguardando aceite
          </p>
        </div>
      </div>

      {osAguardandoAceite.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma OS aguardando aceite encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {osAguardandoAceite.map((os) => (
            <Card key={os.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    OS Nº {os.numero || os.id} - CCA {os.cca}
                    <Badge variant="outline">
                      Aguardando aceite
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleAprovar(os.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aprovar planejamento
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleIniciarRejeicao(os.id)}
                      className="text-red-600 hover:text-red-700"
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
                    <p className="font-medium">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disciplina</p>
                    <p className="font-medium">{capitalizarTexto(os.disciplina)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HH planejado</p>
                    <p className="font-medium">{os.hhPlanejado}h</p>
                  </div>
                  {os.dataInicioPrevista && os.dataFimPrevista && (
                    <div className="md:col-span-3">
                      <p className="text-sm text-muted-foreground">Período previsto</p>
                      <p className="font-medium">
                        {formatDate(os.dataInicioPrevista)} - {formatDate(os.dataFimPrevista)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável EM</p>
                    <p className="font-medium">{os.responsavelEM}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solicitante</p>
                    <p className="font-medium">{os.nomeSolicitante}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="text-sm">{os.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Rejeição com Justificativa */}
      <Dialog open={!!osParaRejeitar} onOpenChange={(open) => !open && handleCancelarRejeicao()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Rejeitar planejamento
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição do planejamento da OS #{osParaRejeitar}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="justificativa" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Motivo da rejeição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="justificativa"
                placeholder="Explique detalhadamente o motivo da rejeição do planejamento..."
                value={justificativaRejeicao}
                onChange={(e) => setJustificativaRejeicao(e.target.value)}
                className={!justificativaRejeicao.trim() ? "border-red-300" : ""}
                rows={4}
              />
              {!justificativaRejeicao.trim() && (
                <p className="text-sm text-red-600">Campo obrigatório</p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Atenção:</strong> Ao rejeitar o planejamento, a OS retornará para o status "Aberta" 
                e precisará ser replanejada novamente.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelarRejeicao} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmarRejeicao}
              disabled={loading || !justificativaRejeicao.trim()}
            >
              {loading ? "Rejeitando..." : "Confirmar rejeição"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}