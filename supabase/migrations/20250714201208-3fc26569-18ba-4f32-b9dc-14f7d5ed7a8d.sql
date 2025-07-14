-- Create table for tutorials
CREATE TABLE public.tutoriais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    video_url TEXT NOT NULL,
    categoria TEXT NOT NULL DEFAULT 'geral',
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.tutoriais ENABLE ROW LEVEL SECURITY;

-- Create policies for tutorials
CREATE POLICY "Todos podem visualizar tutoriais ativos" 
ON public.tutoriais 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Usuários autenticados podem criar tutoriais" 
ON public.tutoriais 
FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem atualizar seus próprios tutoriais" 
ON public.tutoriais 
FOR UPDATE 
USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem excluir seus próprios tutoriais" 
ON public.tutoriais 
FOR DELETE 
USING (auth.uid() = usuario_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tutoriais_updated_at
    BEFORE UPDATE ON public.tutoriais
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for tutorial videos
INSERT INTO storage.buckets (id, name, public) VALUES ('tutoriais', 'tutoriais', true);

-- Create policies for tutorial video uploads
CREATE POLICY "Todos podem visualizar vídeos de tutoriais" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tutoriais');

CREATE POLICY "Usuários autenticados podem fazer upload de vídeos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tutoriais' AND auth.uid() IS NOT NULL);

CREATE POLICY "Usuários podem atualizar seus próprios vídeos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tutoriais' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem excluir seus próprios vídeos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tutoriais' AND auth.uid()::text = (storage.foldername(name))[1]);