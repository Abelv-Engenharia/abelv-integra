export interface PaginaFavorita {
  id: string;
  usuario_id: string;
  nome_pagina: string;
  url_pagina: string;
  icone?: string;
  created_at: string;
  updated_at: string;
}

export interface NovaFavorita {
  nome_pagina: string;
  url_pagina: string;
  icone?: string;
}