import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReadOnlyIdentificacaoForm from "@/components/desvios/readonly/ReadOnlyIdentificacaoForm";
import ReadOnlyInformacoesDesvioForm from "@/components/desvios/readonly/ReadOnlyInformacoesDesvioForm";
import ReadOnlyAcaoCorretivaForm from "@/components/desvios/readonly/ReadOnlyAcaoCorretivaForm";
import ReadOnlyClassificacaoRiscoForm from "@/components/desvios/readonly/ReadOnlyClassificacaoRiscoForm";

const DesviosVisualizacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [desvio, setDesvio] = useState<DesvioCompleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDesvio = async () => {
      if (!id) return;
      
      try {
        const data = await desviosCompletosService.getById(id);
        
        // Enriquecer funcionarios_envolvidos com nomes dos funcionários
        if (data.funcionarios_envolvidos && Array.isArray(data.funcionarios_envolvidos)) {
          const funcionariosEnriquecidos = await Promise.all(
            data.funcionarios_envolvidos.map(async (func: any) => {
              if (func.funcionario_id) {
                const { data: funcionario } = await supabase
                  .from('funcionarios')
                  .select('nome, funcao, matricula')
                  .eq('id', func.funcionario_id)
                  .single();
                
                if (funcionario) {
                  return {
                    ...func,
                    nome: funcionario.nome,
                    funcao: func.funcao || funcionario.funcao,
                    matricula: func.matricula || funcionario.matricula
                  };
                }
              }
              return func;
            })
          );
          
          data.funcionarios_envolvidos = funcionariosEnriquecidos;
        }
        
        setDesvio(data);
      } catch (error) {
        console.error('Erro ao carregar desvio:', error);
        toast.error("Erro ao carregar dados do desvio");
      } finally {
        setLoading(false);
      }
    };

    loadDesvio();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!desvio) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Desvio não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header para tela */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => navigate("/desvios/consulta")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Consulta
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Visualização do Desvio</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Header para impressão */}
      <div className="hidden print:block text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">RELATÓRIO DE DESVIO</h1>
        <p className="text-lg text-gray-600">
          Protocolo: {desvio.id?.substring(0, 8).toUpperCase()}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Data de geração: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* 1. IDENTIFICAÇÃO */}
      <ReadOnlyIdentificacaoForm desvio={desvio} />

      {/* 2. INFORMAÇÕES DO DESVIO */}
      <ReadOnlyInformacoesDesvioForm desvio={desvio} />

      {/* 3. AÇÃO CORRETIVA */}
      <ReadOnlyAcaoCorretivaForm desvio={desvio} />

      {/* 4. CLASSIFICAÇÃO DE RISCO */}
      <ReadOnlyClassificacaoRiscoForm desvio={desvio} />
    </div>
  );
};

export default DesviosVisualizacao;