export interface MultaCompleta {
  // Dados básicos (obrigatórios)
  id: string
  numeroAutoInfracao: string
  dataMulta: Date
  horario: string
  ocorrencia: string
  pontos: number
  condutorInfrator: string
  placa: string
  
  // Dados complementares
  dataNotificacao?: Date
  responsavel?: string
  veiculo?: string
  locadora?: string
  valor?: number
  
  // Dados financeiros (após lançamento)
  numeroFatura?: string
  tituloSienge?: string
  
  // Controle de processo
  indicadoOrgao: 'Sim' | 'Não' | 'Pendente'
  statusMulta: 'Registrada' | 'Condutor Notificado' | 'Formulário Retornado' | 
               'Indicada ao Órgão' | 'Lançada no Sienge' | 'RH/Financeiro Notificado' | 
               'Desconto Confirmado' | 'Processo Concluído'
  
  // Documentos
  documentoNotificacao?: File | string // Do órgão
  formularioPreenchido?: File | string // Retornado pelo condutor  
  comprovanteIndicacao?: File | string // Após indicação
  
  // Controle de emails
  emailCondutorEnviado?: Date
  emailRHFinanceiroEnviado?: Date
  descontoConfirmado?: boolean
  
  // Metadados
  createdAt: Date
  updatedAt: Date
  createdBy: string
  
  // Campos legacy (para compatibilidade)
  descontoEfetuado?: string
  statusNotificacao?: "Pendente" | "Enviado" | "Documento Retornado" | "Em Atraso"
  prazoPreenchimento?: Date
  localCompleto?: string
  documentoAnexado?: File | string
  emailCondutor?: string
  documentoPreenchido?: File | string
  dataEnvioNotificacao?: Date
  dataRetornoDocumento?: Date
  observacoesNotificacao?: string
}

export type StatusMulta = MultaCompleta['statusMulta']
export type IndicadoOrgao = MultaCompleta['indicadoOrgao']

export interface EmailTemplate {
  to: string[]
  subject: string
  body: string
  attachments?: File[]
}

export interface MultaEmailLog {
  id: string
  multaId: string
  recipients: string[]
  recipientType: 'Condutor' | 'RH/Financeiro'
  subject: string
  body: string
  sentAt: string
  status: 'sent' | 'failed'
  attachments?: string[]
}