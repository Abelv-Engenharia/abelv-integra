import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ModuloSelector } from "@/components/prestadores/relatorios/ModuloSelector";
import { ColunasSelectorPorModulo } from "@/components/prestadores/relatorios/ColunasSelectorPorModulo";
import { FiltrosRelatorioPrestadores as FiltrosComponent } from "@/components/prestadores/relatorios/FiltrosRelatorioPrestadores";
import { TabelaDinamica } from "@/components/prestadores/relatorios/TabelaDinamica";
import { ResumoCards } from "@/components/prestadores/relatorios/ResumoCards";
import { ExportButtons } from "@/components/prestadores/relatorios/ExportButtons";
import { ModuloPrestador, FiltrosRelatorioPrestadores, DadosModulo } from "@/types/relatorio-prestadores";
import { RelatorioPrestadoresDataService } from "@/services/RelatorioPrestadoresDataService";
import { BarChart3, FileBarChart } from "lucide-react";
import { toast } from "sonner";

export default function RelatoriosPrestadores() {
  const [modulosSelecionados, setModulosSelecionados] = useState<ModuloPrestador[]>([]);
  const [colunasPorModulo, setColunasPorModulo] = useState<Record<ModuloPrestador, string[]>>({} as any);
  const [filtros, setFiltros] = useState<FiltrosRelatorioPrestadores>({
    modulos: [],
  });
  const [dadosModulos, setDadosModulos] = useState<DadosModulo[]>([]);
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  const handleGerarRelatorio = () => {
    if (modulosSelecionados.length === 0) {
      toast.error("Selecione pelo menos um módulo");
      return;
    }

    const erros: string[] = [];
    modulosSelecionados.forEach(modulo => {
      const colunas = colunasPorModulo[modulo] || [];
      if (colunas.length === 0) {
        erros.push(`Selecione pelo menos uma coluna para o módulo selecionado`);
      }
    });

    if (erros.length > 0) {
      toast.error(erros[0]);
      return;
    }

    const dadosCompletos = RelatorioPrestadoresDataService.carregarDadosCompletos(
      modulosSelecionados,
      colunasPorModulo
    );

    const dadosFiltrados = dadosCompletos.map(modulo => ({
      ...modulo,
      dados: RelatorioPrestadoresDataService.aplicarFiltros(modulo.dados, {
        ...filtros,
        modulos: modulosSelecionados
      })
    }));

    setDadosModulos(dadosFiltrados);
    setRelatorioGerado(true);
    toast.success("Relatório gerado com sucesso!");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <FileBarChart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Relatórios de prestadores de serviço</h1>
            <p className="text-muted-foreground">
              Relatório dinâmico consolidando dados de todos os módulos de prestadores
            </p>
          </div>
        </div>

        <ModuloSelector
          modulosSelecionados={modulosSelecionados}
          onChange={(modulos) => {
            setModulosSelecionados(modulos);
            setRelatorioGerado(false);
          }}
        />

        <ColunasSelectorPorModulo
          modulosSelecionados={modulosSelecionados}
          colunasPorModulo={colunasPorModulo}
          onChange={(colunas) => {
            setColunasPorModulo(colunas);
            setRelatorioGerado(false);
          }}
        />

        {modulosSelecionados.length > 0 && (
          <FiltrosComponent
            filtros={{ ...filtros, modulos: modulosSelecionados }}
            onChange={(novosFiltros) => {
              setFiltros(novosFiltros);
              setRelatorioGerado(false);
            }}
          />
        )}

        {modulosSelecionados.length > 0 && (
          <div className="flex justify-center">
            <Button size="lg" onClick={handleGerarRelatorio} className="gap-2">
              <BarChart3 className="h-5 w-5" />
              Gerar relatório
            </Button>
          </div>
        )}

        {relatorioGerado && dadosModulos.length > 0 && (
          <>
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-6">Resultado</h2>
              
              <ResumoCards dadosModulos={dadosModulos} />
              
              <ExportButtons 
                dadosModulos={dadosModulos} 
                filtros={{ ...filtros, modulos: modulosSelecionados }} 
              />
              
              <div className="space-y-6">
                {dadosModulos.map((modulo) => (
                  <TabelaDinamica key={modulo.modulo} dadosModulo={modulo} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
