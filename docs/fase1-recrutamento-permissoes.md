# Fase 1 - Permissões e Configuração

## ✅ Concluído

### Permissões Necessárias
As seguintes permissões devem ser configuradas manualmente no sistema de permissões:

- `gestao_pessoas_recrutamento_dashboard` - Acesso ao dashboard de recrutamento
- `gestao_pessoas_recrutamento_abertura_vaga` - Criar novas vagas
- `gestao_pessoas_recrutamento_gestao_vagas` - Gerenciar vagas (kanban)
- `gestao_pessoas_recrutamento_banco_talentos` - Acessar banco de talentos
- `gestao_pessoas_recrutamento_acompanhamento_sla` - Acompanhar SLA das vagas

### Hooks Criados

**Fase 2 - Vagas:**
- `useVagas()` - Buscar todas as vagas ativas
- `useVagaById(id)` - Buscar vaga específica
- `useCreateVaga()` - Criar nova vaga
- `useUpdateVaga()` - Atualizar vaga
- `useDeleteVaga()` - Deletar vaga (soft delete)
- `useVagasCandidatos()` - Gerenciar candidatos vinculados às vagas

**Fase 3 - Candidatos:**
- `useCandidatos()` - Buscar todos os candidatos
- `useCandidatoById(id)` - Buscar candidato específico
- `useCreateCandidato()` - Criar novo candidato
- `useUpdateCandidato()` - Atualizar candidato
- `useDeleteCandidato()` - Deletar candidato (soft delete)

**Fase 4 - Dashboard:**
- `useDashboardRecrutamento()` - Hook consolidado com KPIs e dados para gráficos

**Fase 5 - SLA:**
- `useEtapasSLA()` - Gerenciar etapas de SLA
- `useHistoricoSLA()` - Histórico de alterações de SLA

### Arquivos Removidos
- `src/data/gestao-pessoas/mockVagas.ts` ❌
- `src/data/gestao-pessoas/mockCandidatos.ts` ❌

### Status
✅ Todas as 5 fases foram implementadas com hooks do Supabase
⚠️ Páginas precisam ser atualizadas para usar os novos hooks
⚠️ Permissões devem ser configuradas manualmente no admin
