import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRepositorioDocumentos = (subcategoriaId?: string) => {
  return useQuery({
    queryKey: ["repositorio-documentos", subcategoriaId],
    queryFn: async () => {
      let query = supabase
        .from("repositorio_documentos")
        .select(`
          *,
          categoria:repositorio_categorias(id, nome),
          subcategoria:repositorio_subcategorias(id, nome)
        `)
        .order("created_at", { ascending: false });

      if (subcategoriaId) {
        query = query.eq("subcategoria_id", subcategoriaId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

export const useRepositorioDocumentosStats = () => {
  return useQuery({
    queryKey: ["repositorio-documentos-stats"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("repositorio_documentos")
        .select("*", { count: "exact", head: true });

      if (error) throw error;

      // Documentos de hoje
      const hoje = new Date().toISOString().split("T")[0];
      const { count: hojeCount, error: hojeError } = await supabase
        .from("repositorio_documentos")
        .select("*", { count: "exact", head: true })
        .gte("created_at", hoje);

      if (hojeError) throw hojeError;

      // Categorias ativas
      const { count: categoriasCount, error: catError } = await supabase
        .from("repositorio_categorias")
        .select("*", { count: "exact", head: true })
        .eq("ativo", true);

      if (catError) throw catError;

      return {
        total: count || 0,
        hoje: hojeCount || 0,
        categorias: categoriasCount || 0,
      };
    },
  });
};
