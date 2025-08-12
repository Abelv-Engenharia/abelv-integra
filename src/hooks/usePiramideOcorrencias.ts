import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";

export type PiramideCounts = {
  fatal: number;
  cpd: number;
  spd: number;
  incidente: number;
  desvios: number;
};

export function usePiramideOcorrencias(anoAtual: number = new Date().getFullYear()) {
  const [counts, setCounts] = useState<PiramideCounts>({ fatal: 0, cpd: 0, spd: 0, incidente: 0, desvios: 0 });
  const [loading, setLoading] = useState(true);
  const { data: userCCAs = [], isLoading: ccasLoading } = useUserCCAs();

  useEffect(() => {
    if (ccasLoading) return;

    const load = async () => {
      try {
        setLoading(true);
        const ccaCodes = userCCAs.map((c: any) => c.codigo?.toString()).filter(Boolean);
        const ccaIds = userCCAs.map((c: any) => c.id);

        // Buscar ocorrências do ano e CCAs permitidos
        const ocorrenciasPromise = supabase
          .from("ocorrencias")
          .select("classificacao_ocorrencia_codigo")
          .eq("ano", anoAtual)
          .in("cca", ccaCodes);

        // Contagem de desvios
        const desviosPromise = supabase
          .from("desvios_completos")
          .select("*", { count: "exact", head: true })
          .in("cca_id", ccaIds);

        const [{ data: ocorrencias = [] }, { count: desviosCount = 0 }] = await Promise.all([
          ocorrenciasPromise,
          desviosPromise,
        ]);

        // Normalizar código e calcular contagens
        const getCod = (o: any) => (o?.classificacao_ocorrencia_codigo || "").toUpperCase().trim();
        const fatal = ocorrencias.filter((o: any) => {
          const c = getCod(o);
          return ["FATAL", "AC FATAL", "AC FAT", "FAT", "AC FTL"].includes(c);
        }).length;
        const cpd = ocorrencias.filter((o: any) => getCod(o) === "AC CPD").length;
        const spd = ocorrencias.filter((o: any) => ["AC SPD", "AC SPD CRT"].includes(getCod(o))).length;
        const incidente = ocorrencias.filter((o: any) => ["INC DM", "INC SDM", "INC AMB", "INC"].includes(getCod(o))).length;

        setCounts({ fatal, cpd, spd, incidente, desvios: desviosCount || 0 });
      } catch (e) {
        console.error("Erro ao carregar pirâmide de ocorrências:", e);
        setCounts({ fatal: 0, cpd: 0, spd: 0, incidente: 0, desvios: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ccasLoading, userCCAs, anoAtual]);

  return { counts, loading };
}
