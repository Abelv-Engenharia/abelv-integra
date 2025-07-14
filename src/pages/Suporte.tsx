import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Mail, MessageCircle, Phone, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useTutoriais } from "@/hooks/useTutoriais";

const Suporte = () => {
  const { data: tutoriais, isLoading } = useTutoriais();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ subject: "", category: "", message: "" });
  };

  const faqItems = [
    {
      question: "Como alterar minha senha?",
      answer: "Acesse Conta > Configurações > Segurança e utilize o formulário de alteração de senha."
    },
    {
      question: "Como cadastrar um novo desvio?",
      answer: "Navegue até Gestão SMS > Desvios > Cadastro e preencha todas as informações obrigatórias."
    },
    {
      question: "Como visualizar relatórios?",
      answer: "Acesse a seção Relatórios no menu lateral para visualizar dashboards e relatórios específicos."
    },
    {
      question: "Como cadastrar funcionários?",
      answer: "Utilize o menu ADM Matricial > Funcionários para cadastrar novos colaboradores."
    },
    {
      question: "Como criar tarefas?",
      answer: "Acesse Tarefas > Cadastro para criar novas tarefas e atribuí-las aos responsáveis."
    },
    {
      question: "Como registrar ocorrências?",
      answer: "Utilize Gestão SMS > Ocorrências > Cadastro para registrar novas ocorrências de segurança."
    }
  ];

  return (
    <div className="content-padding">
      <h1 className="heading-responsive mb-4 sm:mb-6">Central de Suporte</h1>
      
      <Tabs defaultValue="contato" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
          <TabsTrigger value="contato" className="text-xs sm:text-sm">
            <Mail className="h-4 w-4 mr-2" />
            Contato
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xs sm:text-sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutoriais" className="text-xs sm:text-sm">
            <Play className="h-4 w-4 mr-2" />
            Tutoriais
          </TabsTrigger>
        </TabsList>
        
        {/* Aba Contato */}
        <TabsContent value="contato" className="section-spacing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Enviar Mensagem</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Preencha o formulário abaixo e nossa equipe entrará em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Digite o assunto da sua mensagem"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={handleSelectChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suporte-tecnico">Suporte Técnico</SelectItem>
                        <SelectItem value="bug">Relatar Bug</SelectItem>
                        <SelectItem value="sugestao">Sugestão</SelectItem>
                        <SelectItem value="treinamento">Treinamento</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Descreva detalhadamente sua dúvida ou problema"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Outros Canais de Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Central de Ajuda</h3>
                      <p className="text-sm text-muted-foreground">
                        Acesse nossa documentação completa
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Chat Online</h3>
                      <p className="text-sm text-muted-foreground">
                        Disponível de segunda a sexta, 8h às 18h
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Telefone</h3>
                      <p className="text-sm text-muted-foreground">
                        (11) 3000-0000 - Horário comercial
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Aba FAQ */}
        <TabsContent value="faq" className="section-spacing">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Perguntas Frequentes</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Encontre respostas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aba Tutoriais */}
        <TabsContent value="tutoriais" className="section-spacing">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Tutoriais em Vídeo</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Aprenda a usar o sistema com nossos tutoriais em vídeo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tutoriais && tutoriais.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutoriais.map((tutorial) => (
                    <Card key={tutorial.id} className="overflow-hidden">
                      <div className="aspect-video bg-slate-100 relative group cursor-pointer">
                        <video
                          src={tutorial.video_url}
                          className="w-full h-full object-cover"
                          poster=""
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-slate-700 ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm line-clamp-2">
                              {tutorial.titulo}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {tutorial.categoria}
                            </Badge>
                          </div>
                          {tutorial.descricao && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {tutorial.descricao}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum tutorial disponível</h3>
                  <p className="text-muted-foreground">
                    Os tutoriais serão adicionados em breve.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Suporte;