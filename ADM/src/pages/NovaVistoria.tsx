import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon, ArrowLeft, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import RegistroFotografico, { FotoCategoria } from '@/components/vistoria/RegistroFotografico';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const vistoriaSchema = z.object({
  contrato: z.string().min(1, 'Contrato é obrigatório'),
  data: z.date({ required_error: 'Data da vistoria é obrigatória' }),
  tipo: z.string().min(1, 'Tipo de vistoria é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  documento: z.instanceof(File, { message: 'Documento é obrigatório' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Arquivo deve ter no máximo 10MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Apenas arquivos PDF, JPG, JPEG e PNG são permitidos'
    )
});

type VistoriaFormData = z.infer<typeof vistoriaSchema>;

const tiposVistoria = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'periodica', label: 'Periódica' },
  { value: 'saida', label: 'Saída' },
  { value: 'outra', label: 'Outra' }
];

export default function NovaVistoria() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fotosCategorias, setFotosCategorias] = useState<FotoCategoria[]>([]);
  const navigate = useNavigate();

  // Carregar contratos do banco
  const { data: contratos = [], isLoading: isLoadingContratos } = useQuery({
    queryKey: ['contratos-alojamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratos_alojamento')
        .select('id, codigo, nome, logradouro')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const form = useForm<VistoriaFormData>({
    resolver: zodResolver(vistoriaSchema),
    defaultValues: {
      data: new Date(),
    },
  });

  const onSubmit = async (data: VistoriaFormData) => {
    setIsSubmitting(true);
    
    try {
      const totalFotos = fotosCategorias.reduce((total, cat) => total + cat.fotos.length, 0);
      
      const registroFotografico = {
        totalCategorias: fotosCategorias.length,
        totalFotos,
        categorias: fotosCategorias.map(cat => ({
          categoria: cat.categoria,
          quantidadeFotos: cat.fotos.length,
          fotos: cat.fotos.map(f => ({
            nome: f.file.name,
            legenda: f.legenda || cat.legendaSugerida
          }))
        }))
      };

      const payload = {
        contrato_id: data.contrato,
        data: format(data.data, 'yyyy-MM-dd'),
        tipo: data.tipo,
        responsavel: data.responsavel,
        documento_anexo: data.documento.name,
        registro_fotografico: registroFotografico,
      };

      const { error } = await supabase
        .from('vistorias_alojamento')
        .insert([payload]);

      if (error) throw error;
      
      toast.success(`Vistoria cadastrada com sucesso! ${totalFotos} foto(s) anexada(s).`);
      navigate('/vistorias-alojamento');
    } catch (error) {
      console.error('Erro ao salvar vistoria:', error);
      toast.error('Erro ao cadastrar vistoria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamanho
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Arquivo deve ter no máximo 10MB');
        return;
      }

      // Validar tipo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Apenas arquivos PDF, JPG, JPEG e PNG são permitidos');
        return;
      }

      setSelectedFile(file);
      form.setValue('documento', file);
      form.clearErrors('documento');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.resetField('documento');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vistorias-alojamento')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastro de Vistoria de Alojamento</h1>
            <p className="text-muted-foreground">Registre uma nova vistoria de alojamento</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados da Vistoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contrato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Contrato *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingContratos}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingContratos ? "Carregando..." : "Selecione o contrato"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contratos.map((contrato) => (
                              <SelectItem key={contrato.id} value={contrato.id}>
                                {contrato.codigo} - {contrato.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-destructive">Data da Vistoria *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Tipo de Vistoria *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposVistoria.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Responsável *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do responsável pela vistoria" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel className="text-destructive">Laudo de Vistoria (Anexo) *</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {!selectedFile ? (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <div className="mt-4">
                                  <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="text-sm font-medium text-primary hover:text-primary/80">
                                      Clique para fazer upload
                                    </span>
                                    <input
                                      id="file-upload"
                                      type="file"
                                      className="sr-only"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    PDF, JPG, JPEG ou PNG até 10MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{selectedFile.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(selectedFile.size)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Registro Fotográfico */}
            <RegistroFotografico onChange={setFotosCategorias} />

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vistorias-alojamento')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Vistoria'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}