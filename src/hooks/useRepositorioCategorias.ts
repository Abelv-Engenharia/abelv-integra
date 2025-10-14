import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRepositorioCategorias = () => {
  return useQuery({
    queryKey: ["repositorio-categorias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repositorio_categorias")
        .select(`
          *,
          subcategorias:repositorio_subcategorias(*)
        `)
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      return data;
    },
  });
};

export const useRepositorioCategoria = (categoriaId: string) => {
  return useQuery({
    queryKey: ["repositorio-categoria", categoriaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repositorio_categorias")
        .select(`
          *,
          subcategorias:repositorio_subcategorias(*)
        `)
        .eq("id", categoriaId)
        .eq("ativo", true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!categoriaId,
  });
};

export const useRepositorioSubcategoria = (categoriaId: string, subcategoriaId: string) => {
  return useQuery({
    queryKey: ["repositorio-subcategoria", categoriaId, subcategoriaId],
    queryFn: async () => {
      const { data: categoria, error: catError } = await supabase
        .from("repositorio_categorias")
        .select("*")
        .eq("id", categoriaId)
        .eq("ativo", true)
        .single();

      if (catError) throw catError;

      const { data: subcategoria, error: subError } = await supabase
        .from("repositorio_subcategorias")
        .select("*")
        .eq("id", subcategoriaId)
        .eq("categoria_id", categoriaId)
        .eq("ativo", true)
        .single();

      if (subError) throw subError;

      return { categoria, subcategoria };
    },
    enabled: !!categoriaId && !!subcategoriaId,
  });
};
