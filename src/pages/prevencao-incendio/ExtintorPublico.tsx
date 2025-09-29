import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, MapPin, Factory, AlertCircle, CheckCircle2, LogIn } from "lucide-react";
import { fetchExtintorByCodigo, fetchInspecoesByExtintor } from "@/services/extintores/extintoresService";
import { formatarTipoExtintor, getStatusExtintorTexto, getStatusExtintorBadgeClass } from "@/utils/extintorUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCode from "react-qr-code";

const ExtintorPublico = () => {
  const { codigo } = useParams<{ codigo: string }>();

  const { data: extintor, isLoading: loadingExtintor } = useQuery({
    queryKey: ["extintor-publico", codigo],
    queryFn: () => fetchExtintorByCodigo(codigo!),
    enabled: !!codigo,
  });

  const { data: inspecoes, isLoading: loadingInspecoes } = useQuery({
    queryKey: ["inspecoes-extintor", extintor?.id],
    queryFn: () => fetchInspecoesByExtintor(extintor!.id),
    enabled: !!extintor?.id,
  });

  if (loadingExtintor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Flame className="h-16 w-16 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Carregando informações do extintor...</p>
        </div>
      </div>
    );
  }

  if (!extintor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
              <h1 className="text-2xl font-bold">Extintor Não Encontrado</h1>
              <p className="text-muted-foreground">
                O extintor com o código <strong>{codigo}</strong> não foi encontrado ou está inativo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusTexto = getStatusExtintorTexto(extintor.data_vencimento);
  const statusClass = getStatusExtintorBadgeClass(extintor.data_vencimento);
  const qrValue = `${window.location.origin}/prevencao-incendio/extintor/${extintor.codigo}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Extintor de Incêndio</h1>
                <p className="text-sm opacity-90">Sistema de Prevenção contra Incêndios</p>
              </div>
            </div>
            <Link to="/login">
              <Button variant="secondary" size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Acessar Sistema
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Informações do Extintor */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                <QRCode value={qrValue} size={150} />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Escaneie para acessar
                </p>
              </div>

              {/* Detalhes */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{extintor.codigo}</h2>
                  <Badge className={statusClass}>{statusTexto}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CCA</p>
                    <p className="font-medium">{extintor.ccas?.codigo} - {extintor.ccas?.nome}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">{formatarTipoExtintor(extintor.tipo)}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Capacidade</p>
                    <p className="font-medium">{extintor.capacidade}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      <Factory className="inline h-4 w-4 mr-1" />
                      Fabricante
                    </p>
                    <p className="font-medium">{extintor.fabricante || "—"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localização</p>
                    <p className="font-medium">{extintor.localizacao}</p>
                  </div>
                </div>

                {extintor.data_vencimento && (
                  <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Próxima Inspeção</p>
                      <p className="font-medium">
                        {format(new Date(extintor.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Inspeções */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Histórico de Inspeções</h3>

            {loadingInspecoes ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando histórico...
              </div>
            ) : inspecoes && inspecoes.length > 0 ? (
              <div className="space-y-4">
                {inspecoes.map((inspecao, index) => (
                  <div
                    key={inspecao.id}
                    className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`rounded-full p-2 ${
                        inspecao.status === "conforme" 
                          ? "bg-success/20 text-success" 
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {inspecao.status === "conforme" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      {index < inspecoes.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {format(new Date(inspecao.data_inspecao), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <Badge variant={inspecao.status === "conforme" ? "default" : "destructive"}>
                          {inspecao.status === "conforme" ? "Conforme" : "Não Conforme"}
                        </Badge>
                      </div>
                      {inspecao.observacoes && (
                        <p className="text-sm text-muted-foreground">{inspecao.observacoes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma inspeção registrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Sistema de Gestão de Segurança</p>
          <p className="mt-1">
            Para mais informações, entre em contato com o responsável pela segurança
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtintorPublico;
