import { Vaga, StatusVaga, PrioridadeVaga, TipoContrato, MotivoAbertura, StatusAprovacao, StatusCandidato, EtapaProcesso } from '@/types/gestao-pessoas/vaga';

export const mockVagas: Vaga[] = [
  {
    id: '1',
    numeroVaga: 'VAG-2024-001',
    cargo: 'Engenheiro Civil Júnior',
    area: 'Engenharia',
    setor: 'Obras Civis',
    localTrabalho: 'São Paulo - SP',
    motivoAbertura: MotivoAbertura.NOVA_OBRA,
    prazoMobilizacao: new Date('2024-12-01'),
    tipoContrato: TipoContrato.CLT,
    jornadaTrabalho: '40h semanais',
    faixaSalarial: 'R$ 5.000 - R$ 7.000',
    beneficios: 'VT, VR, Plano de Saúde, Participação nos Lucros',
    formacaoMinima: 'Superior completo em Engenharia Civil',
    experienciaDesejada: 'Mínimo 2 anos em obras de infraestrutura',
    hardSkills: ['AutoCAD', 'MS Project', 'Excel Avançado', 'Normas ABNT'],
    softSkills: ['Comunicação', 'Trabalho em Equipe', 'Organização'],
    aprovador: 'João Silva',
    statusAprovacao: StatusAprovacao.APROVADO,
    status: StatusVaga.EM_SELECAO,
    prioridade: PrioridadeVaga.ALTA,
    dataCriacao: new Date('2024-09-15'),
    dataAtualizacao: new Date('2024-09-17'),
    gestor: 'Carlos Santos',
    etapaAtual: EtapaProcesso.ENTREVISTA_RH,
    candidatos: [
      {
        id: '1',
        nome: 'Ana Paula Costa',
        email: 'ana.costa@email.com',
        telefone: '(11) 99999-0001',
        status: StatusCandidato.ENTREVISTADO,
        dataAplicacao: new Date('2024-09-16'),
        observacoes: 'Perfil adequado, experiência relevante'
      },
      {
        id: '2',
        nome: 'Bruno Oliveira',
        email: 'bruno.oliveira@email.com',
        telefone: '(11) 99999-0002',
        status: StatusCandidato.EM_ANALISE,
        dataAplicacao: new Date('2024-09-17')
      }
    ]
  },
  {
    id: '2',
    numeroVaga: 'VAG-2024-002',
    cargo: 'Técnico em Segurança do Trabalho',
    area: 'Segurança',
    setor: 'SESMT',
    localTrabalho: 'Rio de Janeiro - RJ',
    motivoAbertura: MotivoAbertura.SUBSTITUICAO,
    nomeColaboradorSubstituido: 'Pedro Almeida',
    prazoMobilizacao: new Date('2024-11-15'),
    tipoContrato: TipoContrato.CLT,
    jornadaTrabalho: '44h semanais',
    faixaSalarial: 'R$ 3.500 - R$ 4.500',
    beneficios: 'VT, VR, Plano de Saúde',
    formacaoMinima: 'Técnico em Segurança do Trabalho',
    experienciaDesejada: 'Mínimo 3 anos na área',
    hardSkills: ['NR-10', 'NR-35', 'Primeiros Socorros', 'Investigação de Acidentes'],
    softSkills: ['Liderança', 'Comunicação', 'Atenção aos Detalhes'],
    aprovador: 'Maria Fernanda',
    statusAprovacao: StatusAprovacao.PENDENTE,
    status: StatusVaga.SOLICITACAO_ABERTA,
    prioridade: PrioridadeVaga.MEDIA,
    dataCriacao: new Date('2024-09-10'),
    dataAtualizacao: new Date('2024-09-17'),
    gestor: 'Ricardo Lima',
    etapaAtual: EtapaProcesso.TRIAGEM_CURRICULOS,
    candidatos: []
  },
  {
    id: '3',
    numeroVaga: 'VAG-2024-003',
    cargo: 'Auxiliar Administrativo',
    area: 'Administrativo',
    setor: 'Recursos Humanos',
    localTrabalho: 'Belo Horizonte - MG',
    motivoAbertura: MotivoAbertura.AUMENTO_EQUIPE,
    prazoMobilizacao: new Date('2024-10-30'),
    tipoContrato: TipoContrato.ESTAGIO,
    jornadaTrabalho: '30h semanais',
    faixaSalarial: 'R$ 1.200 - R$ 1.500',
    beneficios: 'VT, VR',
    formacaoMinima: 'Cursando Administração ou áreas afins',
    experienciaDesejada: 'Desejável experiência com atendimento',
    hardSkills: ['Pacote Office', 'Atendimento ao Cliente', 'Organização'],
    softSkills: ['Proatividade', 'Comunicação', 'Trabalho em Equipe'],
    aprovador: 'Ana Beatriz',
    statusAprovacao: StatusAprovacao.APROVADO,
    status: StatusVaga.DIVULGACAO_FEITA,
    prioridade: PrioridadeVaga.BAIXA,
    dataCriacao: new Date('2024-09-05'),
    dataAtualizacao: new Date('2024-09-15'),
    gestor: 'Luciana Soares',
    etapaAtual: EtapaProcesso.DEVOLUTIVA_GESTOR,
    candidatos: [
      {
        id: '3',
        nome: 'Felipe Santos',
        email: 'felipe.santos@email.com',
        telefone: '(31) 99999-0003',
        status: StatusCandidato.APROVADO,
        dataAplicacao: new Date('2024-09-12'),
        observacoes: 'Excelente comunicação e proatividade'
      }
    ]
  }
];

export const mockGestores = [
  { id: '1', nome: 'Carlos Santos' },
  { id: '2', nome: 'Ricardo Lima' },
  { id: '3', nome: 'Luciana Soares' },
  { id: '4', nome: 'João Silva' },
  { id: '5', nome: 'Maria Fernanda' }
];

export const mockAprovadores = [
  { id: '1', nome: 'João Silva' },
  { id: '2', nome: 'Maria Fernanda' },
  { id: '3', nome: 'Ana Beatriz' },
  { id: '4', nome: 'Roberto Costa' }
];

export const mockCargos = [
  'Engenheiro Civil Júnior',
  'Engenheiro Civil Pleno',
  'Engenheiro Civil Sênior',
  'Técnico em Segurança do Trabalho',
  'Auxiliar Administrativo',
  'Assistente Administrativo',
  'Analista Administrativo',
  'Coordenador de Obras',
  'Supervisor de Campo',
  'Encarregado de Obras'
];

export const mockAreas = [
  'Engenharia',
  'Segurança',
  'Administrativo',
  'Recursos Humanos',
  'Financeiro',
  'Logística',
  'Qualidade',
  'Meio Ambiente'
];

export const mockSetores = [
  'Obras Civis',
  'SESMT',
  'Recursos Humanos',
  'Financeiro',
  'Suprimentos',
  'Qualidade',
  'Meio Ambiente',
  'Operações'
];