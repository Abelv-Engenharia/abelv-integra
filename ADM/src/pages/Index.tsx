import { useState } from "react";
import { ArrowRight, BarChart3, Users, FileText, Palette, Zap, Lightbulb, Plus, Edit, Shield, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
const developmentPrompts = [{
  title: "1. Criar Tela",
  description: "Exemplo para criar uma tela",
  examples: [
    "Crie uma tela com os seguintes campos: Número do CCA (número inteiro, obrigatório), Descrição (texto, obrigatório), Cliente (campo com as seguintes opções Brainfarma e Libbs), Valor de Venda (número decimal), Status (caixa de seleção)"
  ],
  icon: Plus,
  color: "text-primary"
}, {
  title: "2. Alterar um Campo",
  description: "Exemplos de alterações em campos existentes:",
  examples: [
    "Altere o nome do campo de 'Valor de Venda' para 'Venda'",
    "Altere o tipo do campo 'Cliente' para texto digitável"
  ],
  icon: Edit,
  color: "text-secondary"
}, {
  title: "3. Criar Regra de Validação",
  description: "Exemplos de regras de validação:",
  examples: [
    "Não permitir que o valor do campo 'Valor de venda' seja negativo",
    "O campo 'Descrição' deve conter mais do que 3 caracteres"
  ],
  icon: Shield,
  color: "text-accent"
}, {
  title: "4. Gerar Relatório",
  description: "Exemplo para criar um botão",
  examples: [
    "Crie um botão 'Gerar relatório', que ao ser clicado gera um relatório dos itens da tabela em pdf e abra ele"
  ],
  icon: Download,
  color: "text-destructive"
}];
const Index = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  return <div className="p-6 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <Badge className="bg-gradient-primary text-primary-foreground mb-4">
          Demonstração Lovable
        </Badge>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Bem-vindo ao{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">ABELV INTEGRA</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Esta é a base de homologação para os módulos da sua área.</p>
        
        
      </div>


      {/* Development Prompts */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Exemplos de Prompts para Desenvolvimento</h2>
        <div className="space-y-6 text-center">
          <Badge className="bg-gradient-primary text-primary-foreground mb-4 text-center text-3xl">
            Clique nos exemplos para copiar o conteúdo
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developmentPrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${prompt.color}`} />
                    </div>
                    <CardTitle className="text-xl">{prompt.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-sm leading-relaxed">
                    {prompt.examples.length > 0 ? prompt.description : `"${prompt.description}"`}
                  </CardDescription>
                  {prompt.examples.length > 0 && (
                    <div className="space-y-2">
                      {prompt.examples.map((example, exampleIndex) => (
                        <div 
                          key={exampleIndex}
                          className="bg-muted/50 p-3 rounded-md border-l-2 border-primary/20 cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(example);
                              // Aqui poderia adicionar um toast de sucesso se necessário
                            } catch (err) {
                              console.error('Erro ao copiar texto: ', err);
                            }
                          }}
                        >
                          <p className="text-xs text-muted-foreground italic">
                            "{example}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      
    </div>;
};
export default Index;