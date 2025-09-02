import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileSearch, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";

const HoraSeguranca = () => {
  const [modelos, setModelos] = useState<any[]>([]);
  const [isLoadingModelos, setIsLoadingModelos] = useState(false);
  const navigate = useNavigate();

  const loadModelos = async () => {
    try {
      setIsLoadingModelos(true);
      const { data } = await supabase
        .from('checklists_avaliacao')
        .select('*')
        .eq('ativo', true)
        .ilike('nome', 'HORA DA SEGURANÇA%')
        .order('nome');
      if (data) {
        setModelos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setIsLoadingModelos(false);
    }
  };

  const selecionarModelo = (modelo: any) => {
    // Navegar para a página de cadastro com o modelo selecionado
    navigate('/inspecao-sms/cadastrar', { 
      state: { 
        modeloSelecionado: modelo,
        fromHoraSeguranca: true 
      } 
    });
  };

  useEffect(() => {
    loadModelos();
  }, []);

  if (isLoadingModelos) {
    return <PageLoader />;
  }

  return (
    <div className="content-padding section-spacing">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/inspecao-sms/cadastrar')} 
          className="flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Voltar</span>
        </Button>
        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
        <h1 className="heading-responsive">HORA DA SEGURANÇA ABELV</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Checklists Disponíveis para Hora da Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSearch className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum checklist encontrado</h3>
              <p className="text-responsive">
                Não há checklists "HORA DA SEGURANÇA" cadastrados no sistema.
              </p>
            </div>
          ) : (
            <div className="card-grid">
              {modelos.map(modelo => (
                <Card 
                  key={modelo.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50" 
                  onClick={() => selecionarModelo(modelo)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg line-clamp-2">
                      {modelo.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {modelo.descricao || 'Checklist de avaliação para Hora da Segurança'}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">
                        {Array.isArray(modelo.itens_avaliacao) ? modelo.itens_avaliacao.length : 0} itens de verificação
                      </span>
                      {modelo.requer_assinatura && (
                        <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          ✓ Requer assinatura
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Checklist Hora da Segurança</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HoraSeguranca;