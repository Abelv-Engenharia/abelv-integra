import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Target, Calendar, Clock, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { OS } from "@/contexts/engenharia-matricial/OSContext";

interface QuadranteDisciplinaProps {
  disciplina: string;
  icon: LucideIcon;
  iconColor: string;
  osList: OS[];
  metaHHMensal: number;
  metaHHAnual: number;
  percentualMinimo: number;
}

export default function QuadranteDisciplina({
  disciplina,
  icon: Icon,
  iconColor,
  osList,
  metaHHMensal,
  metaHHAnual,
  percentualMinimo
}: QuadranteDisciplinaProps) {
  const calcularHHDisciplina = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const osConcluidasMesAtual = osList.filter(os => {
      if (os.status === "concluida" && os.dataConclusao) {
        const dataConclusao = new Date(os.dataConclusao);
        return dataConclusao.getMonth() === mesAtual && dataConclusao.getFullYear() === anoAtual;
      }
      return false;
    });
    
    const hhMensal = osConcluidasMesAtual.reduce((acc, os) => acc + (os.hhPlanejado + (os.hhAdicional || 0)), 0);
    
    const hhAnual = osList
      .filter(os => os.status === "concluida" && os.dataConclusao && new Date(os.dataConclusao).getFullYear() === anoAtual)
      .reduce((acc, os) => acc + (os.hhPlanejado + (os.hhAdicional || 0)), 0);
    
    return { hhMensal, hhAnual };
  };

  const { hhMensal, hhAnual } = calcularHHDisciplina();
  const percentualMetaMensal = (hhMensal / metaHHMensal) * 100;
  const percentualMetaAnual = (hhAnual / metaHHAnual) * 100;
  
  const saldoMensalNecessario = metaHHMensal - hhMensal;
  const saldoAnualNecessario = metaHHAnual - hhAnual;
  
  const mesesRestantes = 12 - (new Date().getMonth() + 1);
  const hhMediaMensalNecessaria = mesesRestantes > 0 ? saldoAnualNecessario / mesesRestantes : 0;

  const capitalizarTexto = (texto: string) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
        <CardTitle>EM {capitalizarTexto(disciplina)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cenário Mensal */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cenário Mensal
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">HH apropriadas</p>
                <p className="text-xl font-bold">{hhMensal}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meta mensal</p>
                <p className="text-xl font-bold">{metaHHMensal}h</p>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">% Avanço meta</p>
              <p className={`text-2xl font-bold ${percentualMetaMensal >= percentualMinimo ? 'text-green-600' : 'text-red-600'}`}>
                {percentualMetaMensal.toFixed(1)}%
              </p>
              {percentualMetaMensal < percentualMinimo && (
                <div className="flex items-center mt-1 text-destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Abaixo do mínimo ({percentualMinimo}%)</span>
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Saldo mensal</p>
              <p className={`text-lg font-bold ${saldoMensalNecessario > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {saldoMensalNecessario > 0 ? '+' : ''}{saldoMensalNecessario}h
              </p>
              <p className="text-xs text-muted-foreground">
                {saldoMensalNecessario > 0 ? 'Necessário para meta' : 'Acima da meta'}
              </p>
            </div>
          </div>

          {/* Cenário Anual */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Cenário Anual
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">HH apropriadas</p>
                <p className="text-xl font-bold">{hhAnual}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meta anual</p>
                <p className="text-xl font-bold">{metaHHAnual}h</p>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">% Avanço meta anual</p>
              <p className={`text-2xl font-bold ${percentualMetaAnual >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {percentualMetaAnual.toFixed(1)}%
              </p>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Saldo anual</p>
              <p className={`text-lg font-bold ${saldoAnualNecessario > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {saldoAnualNecessario > 0 ? '+' : ''}{saldoAnualNecessario}h
              </p>
              <p className="text-xs text-muted-foreground">
                {saldoAnualNecessario > 0 ? 'Necessário para meta' : 'Acima da meta'}
              </p>
            </div>

            {mesesRestantes > 0 && saldoAnualNecessario > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Média mensal necessária</p>
                <p className="text-lg font-bold text-blue-600">
                  {hhMediaMensalNecessaria.toFixed(0)}h/mês
                </p>
                <p className="text-xs text-muted-foreground">
                  Para os próximos {mesesRestantes} meses
                </p>
              </div>
            )}
          </div>

          {/* Resumo estatístico */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Estatísticas
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total OS</p>
                <p className="font-bold">{osList.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">OS concluídas</p>
                <p className="font-bold">{osList.filter(os => os.status === "concluida").length}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}