import { Card } from "@/components/ui/card";
import { DadosModulo } from "@/types/relatorio-prestadores";
import { FileText, DollarSign, Users, CheckCircle } from "lucide-react";

interface ResumoCardsProps {
  dadosModulos: DadosModulo[];
}

export function ResumoCards({ dadosModulos }: ResumoCardsProps) {
  const totalRegistros = dadosModulos.reduce((sum, m) => sum + m.dados.length, 0);
  
  const valorTotal = dadosModulos.reduce((sum, modulo) => {
    return sum + modulo.dados.reduce((s, item) => {
      const valor = item.valor || item.valornf || item.valorprestacaoservico || item.total || item.salariobase || 0;
      return s + Number(valor);
    }, 0);
  }, 0);

  const prestadoresUnicos = new Set();
  dadosModulos.forEach(modulo => {
    modulo.dados.forEach(item => {
      const nome = item.nomecompleto || item.nome || item.nomeprestador || item.prestador;
      if (nome) prestadoresUnicos.add(nome);
    });
  });

  const statusAprovados = dadosModulos.reduce((sum, modulo) => {
    return sum + modulo.dados.filter(item => 
      item.status?.toLowerCase() === 'aprovado' || 
      item.status?.toLowerCase() === 'aprovada' ||
      item.status?.toLowerCase() === 'enviado'
    ).length;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total de registros</p>
            <p className="text-2xl font-bold">{totalRegistros}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor total</p>
            <p className="text-2xl font-bold">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prestadores</p>
            <p className="text-2xl font-bold">{prestadoresUnicos.size}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Aprovados/Enviados</p>
            <p className="text-2xl font-bold">{statusAprovados}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
