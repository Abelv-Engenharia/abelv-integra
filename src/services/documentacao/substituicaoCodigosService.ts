interface Funcionario {
  id: string;
  nome: string;
  matricula?: string;
  cpf?: string;
  funcao?: string;
  data_admissao?: string;
}

interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo?: string;
}

interface Empresa {
  id: number;
  nome: string;
  cnpj?: string;
}

interface Treinamento {
  nome: string;
  carga_horaria: number;
  data_realizacao: string;
  local: string;
  instrutor: string;
}

interface Riscos {
  fisicos?: string[];
  quimicos?: string[];
  biologicos?: string[];
  ergonomicos?: string[];
  acidentes?: string[];
}

interface DadosSubstituicao {
  funcionario: Funcionario;
  cca: CCA;
  empresa?: Empresa;
  treinamento?: Treinamento;
  riscos?: Riscos;
  epis?: string[];
  dadosAdicionais?: Record<string, any>;
}

const formatarDataPorExtenso = (data: string): string => {
  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  const d = new Date(data);
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
};

const formatarData = (data: string): string => {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
};

export const substituirCodigos = (
  template: string,
  dados: DadosSubstituicao
): string => {
  let resultado = template;

  // Dados do funcionário
  resultado = resultado.replace(/{{FUNCIONARIO_NOME}}/g, dados.funcionario.nome || '');
  resultado = resultado.replace(/{{FUNCIONARIO_MATRICULA}}/g, dados.funcionario.matricula || '');
  resultado = resultado.replace(/{{FUNCIONARIO_CPF}}/g, dados.funcionario.cpf || '');
  resultado = resultado.replace(/{{FUNCIONARIO_FUNCAO}}/g, dados.funcionario.funcao || '');
  if (dados.funcionario.data_admissao) {
    resultado = resultado.replace(/{{FUNCIONARIO_DATA_ADMISSAO}}/g, formatarData(dados.funcionario.data_admissao));
  }

  // Dados do CCA
  resultado = resultado.replace(/{{CCA_CODIGO}}/g, dados.cca.codigo || '');
  resultado = resultado.replace(/{{CCA_NOME}}/g, dados.cca.nome || '');
  resultado = resultado.replace(/{{CCA_TIPO}}/g, dados.cca.tipo || '');

  // Dados da empresa
  if (dados.empresa) {
    resultado = resultado.replace(/{{EMPRESA_NOME}}/g, dados.empresa.nome || '');
    resultado = resultado.replace(/{{EMPRESA_CNPJ}}/g, dados.empresa.cnpj || '');
  }

  // Dados do treinamento
  if (dados.treinamento) {
    resultado = resultado.replace(/{{TREINAMENTO_NOME}}/g, dados.treinamento.nome || '');
    resultado = resultado.replace(/{{TREINAMENTO_CARGA_HORARIA}}/g, dados.treinamento.carga_horaria?.toString() || '');
    resultado = resultado.replace(/{{TREINAMENTO_LOCAL}}/g, dados.treinamento.local || '');
    resultado = resultado.replace(/{{TREINAMENTO_INSTRUTOR}}/g, dados.treinamento.instrutor || '');
    
    if (dados.treinamento.data_realizacao) {
      resultado = resultado.replace(/{{TREINAMENTO_DATA_REALIZACAO}}/g, formatarData(dados.treinamento.data_realizacao));
      resultado = resultado.replace(/{{TREINAMENTO_DATA_REALIZACAO_EXTENSO}}/g, formatarDataPorExtenso(dados.treinamento.data_realizacao));
    }
  }

  // Riscos
  if (dados.riscos) {
    resultado = resultado.replace(/{{RISCOS_FISICOS}}/g, dados.riscos.fisicos?.join(', ') || '');
    resultado = resultado.replace(/{{RISCOS_QUIMICOS}}/g, dados.riscos.quimicos?.join(', ') || '');
    resultado = resultado.replace(/{{RISCOS_BIOLOGICOS}}/g, dados.riscos.biologicos?.join(', ') || '');
    resultado = resultado.replace(/{{RISCOS_ERGONOMICOS}}/g, dados.riscos.ergonomicos?.join(', ') || '');
    resultado = resultado.replace(/{{RISCOS_ACIDENTES}}/g, dados.riscos.acidentes?.join(', ') || '');
  }

  // EPIs
  if (dados.epis) {
    resultado = resultado.replace(/{{EPIS_OBRIGATORIOS}}/g, dados.epis.join(', '));
  }

  // Data de emissão
  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  const dataEmissaoExtenso = formatarDataPorExtenso(new Date().toISOString());
  resultado = resultado.replace(/{{DATA_EMISSAO}}/g, dataEmissao);
  resultado = resultado.replace(/{{DATA_EMISSAO_EXTENSO}}/g, dataEmissaoExtenso);

  // Dados adicionais (chaves dinâmicas)
  if (dados.dadosAdicionais) {
    Object.keys(dados.dadosAdicionais).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      resultado = resultado.replace(regex, dados.dadosAdicionais![key]?.toString() || '');
    });
  }

  return resultado;
};

export const gerarPreviewDocumento = (
  template: string,
  dados: DadosSubstituicao
): string => {
  return substituirCodigos(template, dados);
};
