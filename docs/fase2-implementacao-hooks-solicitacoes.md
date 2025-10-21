# Fase 2: Implementação de Hooks para Solicitações

## Objetivo
Conectar o módulo de Solicitações de Serviços ao banco de dados Supabase, substituindo dados mockados por dados reais.

## Arquivos Criados

### 1. Hook de Dados: `src/hooks/gestao-pessoas/useSolicitacoesServicos.tsx`

**Responsabilidades:**
- Buscar todas as solicitações do banco de dados
- Criar novas solicitações
- Atualizar solicitações existentes
- Deletar solicitações
- Buscar solicitação por ID

**Funções Exportadas:**
- `solicitacoes`: Array de solicitações do banco
- `isLoading`: Estado de carregamento
- `createSolicitacao`: Função para criar nova solicitação
- `updateSolicitacao`: Função para atualizar solicitação
- `deleteSolicitacao`: Função para deletar solicitação
- `getSolicitacaoById`: Função para buscar por ID

## Arquivos Modificados

### 1. Context: `src/contexts/gestao-pessoas/SolicitacoesContext.tsx`

**Mudanças:**
- Removido uso de `localStorage`
- Integrado com hook `useSolicitacoesServicos`
- Adicionada função `converterParaSolicitacao` para mapear dados do banco para o formato do frontend
- Mantida compatibilidade com código existente

**Mapeamento de Campos:**

| Frontend | Banco de Dados |
|----------|----------------|
| `dataSolicitacao` | `data_solicitacao` |
| `solicitante` | `solicitante_nome` |
| `solicitanteId` | `solicitante_id` |
| `tipoServico` | `tipo_servico` |
| `observacoesgestao` | `observacoes_gestao` |
| `estimativavalor` | `estimativa_valor` |
| `imagemAnexo` | `imagem_anexo` |
| `responsavelaprovacao` | `responsavel_aprovacao_id` |
| `dataaprovacao` | `data_aprovacao` |
| `justificativaaprovacao` | `justificativa_aprovacao` |
| `justificativareprovacao` | `justificativa_reprovacao` |
| `dataconclusao` | `data_conclusao` |
| `observacoesconclusao` | `observacoes_conclusao` |
| `comprovanteconclusao` | `comprovante_conclusao` |
| `statusanterior` | `status_anterior` |
| `foimovidoautomaticamente` | `foi_movido_automaticamente` |
| `datamudancaautomatica` | `data_mudanca_automatica` |
| `motivomudancaautomatica` | `motivo_mudanca_automatica` |

## Tabela do Banco

**Nome:** `solicitacoes_servicos`

**Campos Principais:**
- `id`: UUID (gerado automaticamente)
- `solicitante_id`: UUID (referência ao usuário)
- `solicitante_nome`: TEXT
- `tipo_servico`: ENUM (tipo_servico_enum)
- `prioridade`: ENUM (prioridade_solicitacao_enum)
- `status`: ENUM (status_solicitacao_enum)
- `cca_id`: INTEGER (referência ao CCA)
- `observacoes`: TEXT
- `estimativa_valor`: NUMERIC
- `data_solicitacao`: TIMESTAMP
- `created_at`: TIMESTAMP (auto)
- `updated_at`: TIMESTAMP (auto)

## TODOs Pendentes

### 1. Autenticação de Usuário
- [ ] Integrar com sistema de autenticação para obter `solicitante_id` real
- [ ] Substituir `'temp-user-id'` e `'Usuário Temporário'` por dados reais

### 2. Buscar Nomes de Usuários
- [ ] Implementar função para buscar nome do responsável pela aprovação
- [ ] Implementar função para buscar nome do aprovador
- [ ] Implementar função para buscar nome de quem concluiu

### 3. Integração com CCAs
- [ ] Buscar nome do CCA a partir do `cca_id`
- [ ] Exibir centro de custo correto nas interfaces

### 4. Tabelas Relacionadas
- [ ] Implementar hooks para `solicitacoes_dados_especificos`
- [ ] Implementar hooks para `solicitacoes_viajantes`
- [ ] Implementar hooks para `solicitacoes_historico`

### 5. Verificação Automática de Status
- [ ] Implementar verificação automática de status com edge function
- [ ] Substituir verificação local por verificação do servidor

## Componentes Afetados

Todos os componentes que usam `useSolicitacoes()` agora recebem dados do banco:

1. ✅ `KPISolicitacoes.tsx` - Dashboard de KPIs
2. ✅ `ControleSolicitacoes.tsx` - Controle de solicitações
3. ✅ `AprovacaoSolicitacoes.tsx` - Aprovação de solicitações
4. ✅ `SolicitacaoServicos.tsx` - Formulário de criação

## Status da Fase 2

✅ **Concluído:**
- Hook de dados criado
- Context atualizado para usar Supabase
- Mapeamento de campos implementado
- Compatibilidade mantida

⚠️ **Pendente:**
- Integração com autenticação real
- Busca de nomes de usuários relacionados
- Implementação de tabelas relacionadas
- Edge functions para verificação automática

## Próximos Passos

Após completar os TODOs pendentes, seguir para:
- **Fase 3:** Implementar hooks de dados reais para Viagens
- **Fase 4:** Implementar hooks de dados reais para Veículos
