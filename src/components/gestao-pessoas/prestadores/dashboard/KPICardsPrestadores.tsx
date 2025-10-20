import { KPIData } from "@/types/gestao-pessoas/dashboard-prestadores";
import { KPICard } from "@/components/gestao-pessoas/veiculos/dashboard/KPICard";
import { FileText, Home, Heart, Receipt, AlertTriangle, Activity } from "lucide-react";

interface KPICardsPrestadoresProps {
  kpis: KPIData;
}

export function KPICardsPrestadores({ kpis }: KPICardsPrestadoresProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <KPICard
        titulo="Total de NF"
        valor={kpis.totalnf.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={FileText}
        cor="azul"
      />
      
      <KPICard
        titulo="Ajuda de aluguel"
        valor={kpis.totalajudaaluguel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={Home}
        cor="verde"
      />
      
      <KPICard
        titulo="Reembolso convênio"
        valor={kpis.totalreembolsoconvenio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={Heart}
        cor="roxo"
      />
      
      <KPICard
        titulo="Desconto convênio"
        valor={kpis.totaldescontoconvenio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={Receipt}
        cor="amarelo"
      />
      
      <KPICard
        titulo="Multas de trânsito"
        valor={kpis.totalmultas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={AlertTriangle}
        cor="vermelho"
      />
      
      <KPICard
        titulo="Desconto abelv run"
        valor={kpis.totaldescontoabelvrun.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        Icon={Activity}
        cor="cinza"
      />
    </div>
  );
}
