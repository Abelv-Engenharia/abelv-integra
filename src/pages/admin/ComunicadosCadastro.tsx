import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useCriarComunicado } from "@/hooks/useComunicados";
import { comunicadosService } from "@/services/comunicadosService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCCAs } from "@/hooks/useCCAs";
import { UsuariosSelector } from "@/components/admin/comunicados/UsuariosSelector";

const ComunicadosCadastro = () => {
  const navigate = useNavigate();
  const criarComunicado = useCriarComunicado();
  const { data: ccas = [] } = useCCAs();
  
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_inicio: new Date(),
    data_fim: new Date(),
    ativo: true,
    publico_alvo: { 
      tipo: "todos" as "todos" | "cca" | "usuarios",
      cca_id: undefined as number | undefined,
      usuarios_ids: [] as string[]
    }
  });
  
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tipo de arquivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF, JPEG ou PNG são permitidos.",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setArquivo(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    // Validações de público-alvo
    if (formData.publico_alvo.tipo === 'cca' && !formData.publico_alvo.cca_id) {
      toast({
        title: "Erro",
        description: "Selecione um CCA.",
        variant: "destructive",
      });
      return;
    }

    if (formData.publico_alvo.tipo === 'usuarios' && formData.publico_alvo.usuarios_ids.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um usuário.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      let arquivo_url = null;
      let arquivo_nome = null;
      
      // Upload do arquivo se existir
      if (arquivo) {
        arquivo_url = await comunicadosService.uploadAnexo(arquivo);
        arquivo_nome = arquivo.name;
      }

      await criarComunicado.mutateAsync({
        ...formData,
        data_inicio: format(formData.data_inicio, 'yyyy-MM-dd'),
        data_fim: format(formData.data_fim, 'yyyy-MM-dd'),
        arquivo_url,
        arquivo_nome,
      });

      navigate('/admin/comunicados/consulta');
    } catch (error) {
      console.error('Erro ao criar comunicado:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Cadastro de Comunicados</h1>
        <p className="text-muted-foreground">
          Crie um novo comunicado para os usuários do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Comunicado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Digite o título do comunicado"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Digite a descrição do comunicado"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.data_inicio && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_inicio ? (
                          format(formData.data_inicio, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.data_inicio}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, data_inicio: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data de Fim *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.data_fim && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.data_fim ? (
                          format(formData.data_fim, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.data_fim}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, data_fim: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Público-Alvo *</Label>
                <Select
                  value={formData.publico_alvo.tipo}
                  onValueChange={(value) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      publico_alvo: { 
                        tipo: value as "todos" | "cca" | "usuarios",
                        cca_id: undefined,
                        usuarios_ids: []
                      } 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o público-alvo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os usuários</SelectItem>
                    <SelectItem value="cca">Usuários de um CCA específico</SelectItem>
                    <SelectItem value="usuarios">Usuários específicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.publico_alvo.tipo === 'cca' && (
                <div>
                  <Label>Selecionar CCA *</Label>
                  <Select
                    value={formData.publico_alvo.cca_id?.toString() || ""}
                    onValueChange={(value) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        publico_alvo: { 
                          ...prev.publico_alvo,
                          cca_id: parseInt(value)
                        } 
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {ccas.map((cca) => (
                        <SelectItem key={cca.id} value={cca.id.toString()}>
                          {cca.codigo} - {cca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.publico_alvo.tipo === 'usuarios' && (
                <div>
                  <Label>Selecionar Usuários *</Label>
                  <UsuariosSelector
                    selectedIds={formData.publico_alvo.usuarios_ids}
                    onChange={(ids) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        publico_alvo: { 
                          ...prev.publico_alvo,
                          usuarios_ids: ids
                        } 
                      }))
                    }
                  />
                </div>
              )}

              <div>
                <Label htmlFor="arquivo">Anexo (PDF, JPEG ou PNG)</Label>
                <div className="mt-2">
                  {arquivo ? (
                    <div className="flex items-center gap-2 p-3 border rounded-lg">
                      <span className="flex-1 text-sm">{arquivo.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setArquivo(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="arquivo" className="cursor-pointer">
                          <span className="font-medium text-primary hover:text-primary/80">
                            Clique para selecionar um arquivo
                          </span>
                          <input
                            id="arquivo"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PDF, JPEG ou PNG até 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                />
                <Label htmlFor="ativo">Comunicado ativo</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={uploading || criarComunicado.isPending}
              >
                {uploading || criarComunicado.isPending ? "Salvando..." : "Salvar Comunicado"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/comunicados/consulta')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComunicadosCadastro;