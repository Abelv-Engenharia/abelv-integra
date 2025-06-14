import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ccaService } from "@/services/treinamentos/ccaService";
import { 
  Funcionario,
  TreinamentoNormativo,
  Treinamento
} from "@/types/treinamentos";
import { calcularStatusTreinamento, formatarData, fetchFuncionarios, fetchTreinamentos, getNomeTreinamento } from "@/utils/treinamentosUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import FuncionarioSelector from "@/components/treinamentos/FuncionarioSelector";
import FuncionarioInfoCard from "@/components/treinamentos/FuncionarioInfoCard";
import CrachaPreview from "@/components/treinamentos/CrachaPreview";
import FuncionarioTreinamentosValidosCard from "@/components/treinamentos/FuncionarioTreinamentosValidosCard";

const TreinamentosCracha = () => {
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | undefined>();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [treinamentosValidos, setTreinamentosValidos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentosInfo, setTreinamentosInfo] = useState<Treinamento[]>([]);
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const crachaRef = useRef<HTMLDivElement | null>(null);

  // Fetch funcionarios data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [funcionariosData, treinamentosData, ccasData] = await Promise.all([
          fetchFuncionarios(),
          fetchTreinamentos(),
          ccaService.getAll(),
        ]);
        setFuncionarios(funcionariosData);
        setTreinamentosInfo(treinamentosData);
        setCcas(ccasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Ordenar CCAs pelo campo 'codigo' em ordem crescente antes de mostrar as opções
  const ccasOrdenados = [...ccas].sort((a, b) => {
    if (!a.codigo || !b.codigo) return 0;
    // Se for numérico, compara como número. Se não, compara como string.
    const numA = Number(a.codigo);
    const numB = Number(b.codigo);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    } else {
      return a.codigo.localeCompare(b.codigo, "pt-BR", { numeric: true });
    }
  });

  // Lista de funcionários filtrada por CCA selecionado
  const funcionariosFiltrados = selectedCcaId
    ? funcionarios.filter((f) => f.cca_id === selectedCcaId)
    : [];

  // Ao trocar o CCA, limpa seleção de funcionário e info dependentes
  const handleCcaChange = (ccaId: string) => {
    setSelectedCcaId(Number(ccaId));
    setSelectedFuncionarioId(undefined);
    setFuncionario(null);
    setTreinamentosValidos([]);
  };

  const handleFuncionarioChange = async (funcionarioId: string) => {
    setSelectedFuncionarioId(funcionarioId);
    setIsLoading(true);
    
    try {
      const selectedFuncionario = funcionariosFiltrados.find(f => f.id === funcionarioId);
      setFuncionario(selectedFuncionario || null);
      
      // Get valid trainings for this funcionario from Supabase
      const { data: treinamentosData, error } = await supabase
        .from('treinamentos_normativos')
        .select('*')
        .eq('funcionario_id', funcionarioId)
        .eq('arquivado', false);
      
      if (error) {
        console.error("Erro ao buscar treinamentos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os treinamentos do funcionário",
          variant: "destructive",
        });
        setTreinamentosValidos([]);
        return;
      }
      
      // Process trainings
      const treinamentosProcessados = await Promise.all(treinamentosData.map(async (t) => {
        const dataRealizacao = t.data_realizacao;
        const dataValidade = t.data_validade;
        const status = calcularStatusTreinamento(new Date(dataValidade));
        const treinamentoNome = await getNomeTreinamento(t.treinamento_id);
        
        return {
          id: t.id,
          funcionario_id: t.funcionario_id,
          treinamento_id: t.treinamento_id,
          tipo: t.tipo as 'Formação' | 'Reciclagem',
          data_realizacao: dataRealizacao,
          data_validade: dataValidade,
          certificado_url: t.certificado_url,
          status: status,
          arquivado: t.arquivado,
          treinamentoNome
        };
      }));
      
      // Filter valid or about to expire trainings
      const treinamentosValidos = treinamentosProcessados
        .filter(t => t.status === "Válido" || t.status === "Próximo ao vencimento")
        .sort((a, b) => new Date(a.data_validade).getTime() - new Date(b.data_validade).getTime());
      
      setTreinamentosValidos(treinamentosValidos);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados",
        variant: "destructive",
      });
      setTreinamentosValidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!funcionario) {
      toast({
        title: "Aviso",
        description: "Selecione um funcionário para gerar o crachá",
        variant: "destructive",
      });
      return;
    }
    
    if (treinamentosValidos.length === 0) {
      toast({
        title: "Aviso",
        description: "O funcionário não possui treinamentos válidos para emissão de crachá",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Imprimindo",
      description: "Enviando crachá para impressão...",
    });
    
    // Implementação da funcionalidade de impressão
    if (crachaRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        
        // Adicionar estilos para impressão que mantêm o layout exato do preview
        const style = document.createElement('style');
        style.innerHTML = `
          @page {
            size: 100mm 160mm;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: white;
          }
          .cracha-container {
            width: 100mm;
            height: 160mm;
            box-sizing: border-box;
            padding: 5mm;
            margin: 0 auto;
            page-break-after: always;
            display: flex;
            flex-direction: column;
          }
          .header {
            background-color: hsl(222.2, 47.4%, 11.2%);
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 4px 4px 0 0;
            margin-bottom: 15px;
          }
          .header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .profile {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }
          .photo {
            width: 80px;
            height: 80px;
            background-color: #f3f4f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
          }
          .photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo svg {
            width: 40px;
            height: 40px;
            color: #9ca3af;
          }
          .info {
            display: flex;
            flex-direction: column;
          }
          .info h4 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          .info p {
            margin: 0 0 5px 0;
            font-size: 14px;
          }
          .info .matricula {
            font-size: 12px;
            color: #6b7280;
          }
          .certifications {
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
            flex-grow: 1;
          }
          .certifications h5 {
            font-size: 14px;
            text-align: center;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: 600;
          }
          .certifications-table {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
          }
          .certifications-table thead {
            border-bottom: 1px solid #e5e7eb;
          }
          .certifications-table th {
            text-align: left;
            padding: 5px;
            font-weight: 600;
          }
          .certifications-table th:last-child {
            text-align: right;
          }
          .certifications-table td {
            padding: 5px;
            border-bottom: 1px solid #e5e7eb;
          }
          .certifications-table td:last-child {
            text-align: right;
          }
          .footer {
            border-top: 1px solid #e5e7eb;
            margin-top: auto;
            padding-top: 8px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
          }
          .empty-message {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            margin-top: 20px;
          }
        `;

        // Criar HTML para impressão usando o design exato do preview
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Crachá de Capacitação - ${funcionario.nome}</title>
            ${style.outerHTML}
          </head>
          <body>
            <div class="cracha-container">
              <div class="header">
                <h3>Crachá de Capacitação</h3>
              </div>
              
              <div class="profile">
                <div class="photo">
                  ${funcionario.foto 
                    ? `<img src="${funcionario.foto}" alt="${funcionario.nome}" />` 
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
                  }
                </div>
                
                <div class="info">
                  <h4>${funcionario.nome}</h4>
                  <p>${funcionario.funcao}</p>
                  <p class="matricula">Matrícula: ${funcionario.matricula}</p>
                </div>
              </div>
              
              <div class="certifications">
                <h5>Certificações Válidas</h5>
                
                ${treinamentosValidos.length > 0 
                  ? `<table class="certifications-table">
                      <thead>
                        <tr>
                          <th>Treinamento</th>
                          <th>Validade</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${treinamentosValidos.map(treinamento => `
                          <tr>
                            <td>${treinamento.treinamentoNome || 'Treinamento não encontrado'}</td>
                            <td>${formatarData(treinamento.data_validade)}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>`
                  : `<p class="empty-message">Sem treinamentos válidos</p>`
                }
              </div>
              
              <div class="footer">
                <p>Emitido em ${format(new Date(), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </body>
          </html>
        `);
        
        printWindow.document.close();
        
        // Delay para garantir que o conteúdo foi renderizado antes de imprimir
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Emissão de Crachá de Capacitação</h1>
      </div>

      {isLoading && !selectedFuncionarioId ? (
        <div className="flex justify-center items-center py-8">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          <FuncionarioSelector
            ccasOrdenados={ccasOrdenados}
            selectedCcaId={selectedCcaId}
            handleCcaChange={handleCcaChange}
            funcionariosFiltrados={funcionariosFiltrados}
            selectedFuncionarioId={selectedFuncionarioId}
            handleFuncionarioChange={handleFuncionarioChange}
            funcionario={funcionario}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FuncionarioTreinamentosValidosCard
              funcionario={funcionario}
              treinamentosValidos={treinamentosValidos}
              isLoading={isLoading}
            />

            <CrachaPreview
              funcionario={funcionario}
              treinamentosValidos={treinamentosValidos}
              isLoading={isLoading}
              onPrint={handlePrint}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TreinamentosCracha;
