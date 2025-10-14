// Dados fictícios para o módulo de Repositório de Documentos

export interface documento {
  id: string;
  nome: string;
  categoria: string;
  subcategoria: string;
  dataupload: string;
  datavalidade: string;
  usuarioresponsavel: string;
  responsavel: string;
  emailresponsavel: string;
  tamanho: string;
  tipo: string;
}

export interface subcategoria {
  id: string;
  nome: string;
}

export interface categoria {
  id: string;
  nome: string;
  descricao: string;
  quantidadedocumentos: number;
  cor: string;
  subcategorias: subcategoria[];
}

export const documentosmock: documento[] = [
  {
    id: "1",
    nome: "Contrato_Prestacao_Servicos.pdf",
    categoria: "Empresarial",
    subcategoria: "Contrato Social",
    dataupload: "15/01/2024",
    datavalidade: "15/01/2026",
    usuarioresponsavel: "Maria Silva",
    responsavel: "Maria Silva",
    emailresponsavel: "maria.silva@empresa.com",
    tamanho: "2.3 MB",
    tipo: "PDF"
  },
  {
    id: "2", 
    nome: "CNH_Categoria_B.pdf",
    categoria: "Habilitação",
    subcategoria: "Licenças",
    dataupload: "22/01/2024",
    datavalidade: "22/01/2025",
    usuarioresponsavel: "João Santos",
    responsavel: "João Santos",
    emailresponsavel: "joao.santos@empresa.com",
    tamanho: "1.8 MB",
    tipo: "PDF"
  },
  {
    id: "3",
    nome: "Relatorio_Financeiro_Q1.xlsx", 
    categoria: "Financeiro",
    subcategoria: "DRE",
    dataupload: "28/01/2024",
    datavalidade: "28/12/2024",
    usuarioresponsavel: "Ana Costa",
    responsavel: "Ana Costa",
    emailresponsavel: "ana.costa@empresa.com",
    tamanho: "4.1 MB",
    tipo: "Excel"
  },
  {
    id: "4",
    nome: "Certidao_Nascimento.pdf",
    categoria: "Certidões", 
    subcategoria: "Certidões",
    dataupload: "05/02/2024",
    datavalidade: "05/02/2030",
    usuarioresponsavel: "Carlos Lima",
    responsavel: "Carlos Lima",
    emailresponsavel: "carlos.lima@empresa.com",
    tamanho: "1.2 MB",
    tipo: "PDF"
  },
  {
    id: "5",
    nome: "Codigo_Conduta_Empresa.pdf",
    categoria: "Políticas e Código de Conduta",
    subcategoria: "Políticas e Código de Conduta",
    dataupload: "10/02/2024", 
    datavalidade: "10/02/2025",
    usuarioresponsavel: "Marina Oliveira",
    responsavel: "Marina Oliveira",
    emailresponsavel: "marina.oliveira@empresa.com",
    tamanho: "3.5 MB",
    tipo: "PDF"
  },
  {
    id: "6",
    nome: "Estatuto_Social.pdf",
    categoria: "Empresarial",
    subcategoria: "Contrato Social",
    dataupload: "12/02/2024",
    datavalidade: "12/02/2027",
    usuarioresponsavel: "Roberto Ferreira",
    responsavel: "Roberto Ferreira",
    emailresponsavel: "roberto.ferreira@empresa.com", 
    tamanho: "2.8 MB",
    tipo: "PDF"
  },
  {
    id: "7",
    nome: "Carteira_Trabalho.pdf",
    categoria: "Habilitação",
    subcategoria: "Licenças",
    dataupload: "18/02/2024",
    datavalidade: "18/01/2025",
    usuarioresponsavel: "Fernanda Souza",
    responsavel: "Fernanda Souza",
    emailresponsavel: "fernanda.souza@empresa.com",
    tamanho: "987 KB", 
    tipo: "PDF"
  },
  {
    id: "8",
    nome: "Balancete_Mensal.xlsx",
    categoria: "Financeiro",
    subcategoria: "Balanços",
    dataupload: "25/02/2024",
    datavalidade: "25/03/2025",
    usuarioresponsavel: "Paulo Mendes",
    responsavel: "Paulo Mendes",
    emailresponsavel: "paulo.mendes@empresa.com",
    tamanho: "2.1 MB",
    tipo: "Excel"
  },
  {
    id: "9",
    nome: "Certidao_Casamento.pdf",
    categoria: "Certidões",
    subcategoria: "Certidões",
    dataupload: "28/02/2024",
    datavalidade: "15/10/2024",
    usuarioresponsavel: "Luciana Reis",
    responsavel: "Luciana Reis",
    emailresponsavel: "luciana.reis@empresa.com",
    tamanho: "1.4 MB",
    tipo: "PDF"
  },
  {
    id: "10",
    nome: "Manual_Compliance.docx",
    categoria: "Políticas e Código de Conduta",
    subcategoria: "Políticas e Código de Conduta",
    dataupload: "02/03/2024",
    datavalidade: "02/03/2026",
    usuarioresponsavel: "Eduardo Santos",
    responsavel: "Eduardo Santos",
    emailresponsavel: "eduardo.santos@empresa.com",
    tamanho: "5.2 MB",
    tipo: "Word"
  }
];

export const categoriasmock: categoria[] = [
  {
    id: "1",
    nome: "Empresarial",
    descricao: "Contratos, estatutos e documentos corporativos",
    quantidadedocumentos: 2,
    cor: "bg-blue-500",
    subcategorias: [
      { id: "1-1", nome: "Cartão CNPJ" },
      { id: "1-2", nome: "Contrato Social" },
      { id: "1-3", nome: "Ficha Cadastral" },
      { id: "1-4", nome: "Inscrições" },
      { id: "1-5", nome: "IPTU" }
    ]
  },
  {
    id: "2", 
    nome: "Habilitação",
    descricao: "CNH, carteira de trabalho e documentos profissionais",
    quantidadedocumentos: 2,
    cor: "bg-green-500",
    subcategorias: [
      { id: "2-1", nome: "Atestado Bancário" },
      { id: "2-2", nome: "Atestado Técnico" },
      { id: "2-3", nome: "CREA" },
      { id: "2-4", nome: "Licenças" },
      { id: "2-5", nome: "SGQ" },
      { id: "2-6", nome: "SMS" }
    ]
  },
  {
    id: "3",
    nome: "Financeiro",
    descricao: "Relatórios financeiros, balancetes e documentos contábeis", 
    quantidadedocumentos: 2,
    cor: "bg-purple-500",
    subcategorias: [
      { id: "3-1", nome: "Balanços" },
      { id: "3-2", nome: "Declaração de Faturamento" },
      { id: "3-3", nome: "DMPL" },
      { id: "3-4", nome: "DRE" }
    ]
  },
  {
    id: "4",
    nome: "Certidões",
    descricao: "Certidões de nascimento, casamento e outros documentos civis",
    quantidadedocumentos: 2,
    cor: "bg-orange-500",
    subcategorias: [
      { id: "4-1", nome: "Certidões" }
    ]
  },
  {
    id: "5",
    nome: "Políticas e Código de Conduta", 
    descricao: "Políticas internas, código de conduta e compliance",
    quantidadedocumentos: 2,
    cor: "bg-red-500",
    subcategorias: [
      { id: "5-1", nome: "Políticas e Código de Conduta" }
    ]
  }
];