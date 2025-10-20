import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import dos 5 componentes de aba
import DadosColaboradorTab from "@/components/validacao-admissao/DadosColaboradorTab";
import AdmissaoTab from "@/components/validacao-admissao/AdmissaoTab";
import AjudaCustoTab from "@/components/validacao-admissao/AjudaCustoTab";
import ChecklistASOTab from "@/components/validacao-admissao/ChecklistASOTab";
import EnvioTab from "@/components/validacao-admissao/EnvioTab";

export default function ValidacaoAdmissao() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dados");
  const [validacaoId, setValidacaoId] = useState<string | null>(null);
  
  // Estados das flags
  const [flags, setFlags] = useState({
    dados_ok: false,
    admissao_ok: false,
    ajuda_ok: false,
    aso_ok: false
  });

  // FASE 2: Carregar validação da URL ou última criada
  useEffect(() => {
    const carregarValidacao = async () => {
      // Verificar se há ID na URL
      const urlParams = new URLSearchParams(window.location.search);
      const idDaUrl = urlParams.get('id');

      if (idDaUrl) {
        // Carregar validação específica da URL
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('*')
          .eq('id', idDaUrl)
          .maybeSingle();

        if (data && !error) {
          setValidacaoId(data.id);
          setFlags({
            dados_ok: data.dados_ok || false,
            admissao_ok: data.admissao_ok || false,
            ajuda_ok: data.ajuda_ok || false,
            aso_ok: data.aso_ok || false
          });
        }
      } else {
        // Carregar última validação criada
        const { data, error } = await supabase
          .from('validacao_admissao')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data && !error) {
          setValidacaoId(data.id);
          setFlags({
            dados_ok: data.dados_ok || false,
            admissao_ok: data.admissao_ok || false,
            ajuda_ok: data.ajuda_ok || false,
            aso_ok: data.aso_ok || false
          });
        }
      }
    };

    carregarValidacao();
  }, []);

  // Função para limpar todas as abas
  const limparTodasAbas = () => {
    // Resetar todas as flags
    setFlags({
      dados_ok: false,
      admissao_ok: false,
      ajuda_ok: false,
      aso_ok: false
    });

    // Limpar validacaoId (força todas as abas a resetarem)
    setValidacaoId(null);

    // Voltar para primeira aba
    setActiveTab("dados");

    toast({
      title: "Tudo limpo",
      description: "Todos os dados foram limpos. Você pode iniciar um novo cadastro.",
    });
  };

  // Indicador visual de aba completa
  const getTabIcon = (isComplete: boolean) => {
    if (isComplete) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Validação de Admissão (Nydhus)</h1>
          <p className="text-muted-foreground">
            Processo completo de validação e integração com Nydhus e Sienge
          </p>
        </div>
        
        {/* Indicador de progresso global */}
        <Card className="w-64">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {getTabIcon(flags.dados_ok)}
              <span className="text-sm">Dados Colaborador</span>
            </div>
            <div className="flex items-center gap-2">
              {getTabIcon(flags.admissao_ok)}
              <span className="text-sm">Admissão</span>
            </div>
            <div className="flex items-center gap-2">
              {getTabIcon(flags.ajuda_ok)}
              <span className="text-sm">Ajuda de Custo</span>
            </div>
            <div className="flex items-center gap-2">
              {getTabIcon(flags.aso_ok)}
              <span className="text-sm">ASO</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dados" className="flex items-center gap-2">
            {getTabIcon(flags.dados_ok)}
            Dados Colaborador
          </TabsTrigger>
          <TabsTrigger value="admissao" className="flex items-center gap-2">
            {getTabIcon(flags.admissao_ok)}
            Admissão
          </TabsTrigger>
          <TabsTrigger value="ajuda" className="flex items-center gap-2">
            {getTabIcon(flags.ajuda_ok)}
            Ajuda de Custo
          </TabsTrigger>
          <TabsTrigger value="aso" className="flex items-center gap-2">
            {getTabIcon(flags.aso_ok)}
            Checklist & ASO
          </TabsTrigger>
          <TabsTrigger 
            value="envio" 
            disabled={!Object.values(flags).every(f => f)}
            className="flex items-center gap-2"
          >
            {Object.values(flags).every(f => f) ? 
              <CheckCircle className="h-4 w-4 text-green-500" /> : 
              <XCircle className="h-4 w-4 text-red-500" />
            }
            Envio (DP)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6">
          <DadosColaboradorTab 
            validacaoId={validacaoId}
            setValidacaoId={setValidacaoId}
            onComplete={(ok) => setFlags(prev => ({...prev, dados_ok: ok}))}
            onLimparTudo={limparTodasAbas}
          />
        </TabsContent>

        <TabsContent value="admissao" className="mt-6">
          <AdmissaoTab 
            validacaoId={validacaoId}
            onComplete={(ok) => setFlags(prev => ({...prev, admissao_ok: ok}))}
          />
        </TabsContent>

        <TabsContent value="ajuda" className="mt-6">
          <AjudaCustoTab 
            validacaoId={validacaoId}
            onComplete={(ok) => setFlags(prev => ({...prev, ajuda_ok: ok}))}
          />
        </TabsContent>

        <TabsContent value="aso" className="mt-6">
          <ChecklistASOTab 
            validacaoId={validacaoId}
            onComplete={(ok) => setFlags(prev => ({...prev, aso_ok: ok}))}
          />
        </TabsContent>

        <TabsContent value="envio" className="mt-6">
          <EnvioTab validacaoId={validacaoId} flags={flags} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
