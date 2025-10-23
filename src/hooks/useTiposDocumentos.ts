import { useQuery } from "@tanstack/react-query";
import { tipoDocumentoService } from "@/services/admin/tipoDocumentoService";

export const useTiposDocumentos = () => {
  return useQuery({
    queryKey: ['tipos-documentos'],
    queryFn: () => tipoDocumentoService.getAll(),
  });
};
