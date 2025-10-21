# Permissões do Módulo Gestão de Pessoas

Este documento detalha todas as permissões disponíveis para o módulo **Gestão de Pessoas**, organizado por submódulos.

## 📋 Visão Geral

O módulo Gestão de Pessoas está dividido em **6 submódulos** principais com um total de **53 permissões** granulares.

---

## 1️⃣ Solicitações de Serviços (8 permissões)

Controla o acesso às funcionalidades de solicitação e aprovação de serviços internos.

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_solicitacoes_dashboard` | Dashboard | Visualizar dashboard com KPIs de solicitações |
| `gestao_pessoas_solicitacoes_criar` | Criar Solicitação | Criar novas solicitações de serviços |
| `gestao_pessoas_solicitacoes_visualizar` | Visualizar Solicitações | Consultar e visualizar solicitações existentes |
| `gestao_pessoas_solicitacoes_editar` | Editar Solicitação | Editar solicitações em rascunho ou pendentes |
| `gestao_pessoas_solicitacoes_excluir` | Excluir Solicitação | Excluir solicitações (se permitido pelo status) |
| `gestao_pessoas_solicitacoes_aprovar` | Aprovar Solicitações | Aprovar solicitações pendentes |
| `gestao_pessoas_solicitacoes_reprovar` | Reprovar Solicitações | Reprovar solicitações com justificativa |
| `gestao_pessoas_solicitacoes_relatorios` | Relatórios | Gerar e visualizar relatórios de solicitações |

**Páginas relacionadas:**
- `/gestao-pessoas/kpi-solicitacoes` - Dashboard
- `/gestao-pessoas/solicitacao-servicos` - Criar
- `/gestao-pessoas/controle-solicitacoes` - Visualizar
- `/gestao-pessoas/aprovacao-solicitacoes` - Aprovar
- `/gestao-pessoas/relatorios-solicitacoes` - Relatórios

---

## 2️⃣ Gestão de Viagens (5 permissões)

Controla o acesso ao cadastro, importação e consulta de faturas de viagens corporativas.

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_viagens_dashboard` | Dashboard | Visualizar dashboard de viagens e faturas |
| `gestao_pessoas_viagens_cadastrar_fatura` | Cadastrar Fatura | Cadastrar manualmente faturas de viagens |
| `gestao_pessoas_viagens_importar_fatura` | Importar Fatura | Importar faturas via planilha/arquivo |
| `gestao_pessoas_viagens_consultar_faturas` | Consultar Faturas | Consultar histórico de faturas |
| `gestao_pessoas_viagens_relatorios` | Relatórios | Gerar relatórios de viagens e despesas |

**Páginas relacionadas:**
- `/gestao-pessoas/gestao-viagens-dashboard` - Dashboard
- `/gestao-pessoas/cadastro-fatura` - Cadastrar
- `/gestao-pessoas/importar-fatura` - Importar
- `/gestao-pessoas/consulta-faturas` - Consultar
- `/gestao-pessoas/relatorio-viagens` - Relatórios

---

## 3️⃣ Gestão de Veículos (20 permissões)

O submódulo mais completo, com controle granular sobre veículos, multas, condutores, cartões, pedágios, checklists e abastecimento.

### 3.1 Veículos Gerais (6 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_dashboard` | Dashboard | Dashboard com indicadores da frota |
| `gestao_pessoas_veiculos_cadastrar` | Cadastrar Veículo | Cadastrar novos veículos na frota |
| `gestao_pessoas_veiculos_editar` | Editar Veículo | Editar informações de veículos |
| `gestao_pessoas_veiculos_visualizar` | Visualizar Veículos | Consultar dados dos veículos |
| `gestao_pessoas_veiculos_excluir` | Excluir Veículo | Excluir veículos do sistema |
| `gestao_pessoas_veiculos_consultas` | Consultas Veículos | Consultas avançadas de veículos |

### 3.2 Multas (3 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_multas_cadastrar` | Cadastrar Multas | Registrar multas de trânsito |
| `gestao_pessoas_veiculos_multas_visualizar` | Visualizar Multas | Consultar multas registradas |
| `gestao_pessoas_veiculos_multas_editar` | Editar Multas | Editar status e dados de multas |

### 3.3 Condutores (3 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_condutores_cadastrar` | Cadastrar Condutores | Cadastrar condutores autorizados |
| `gestao_pessoas_veiculos_condutores_visualizar` | Visualizar Condutores | Consultar dados de condutores |
| `gestao_pessoas_veiculos_condutores_editar` | Editar Condutores | Editar informações de condutores |

### 3.4 Cartões de Combustível (2 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_cartoes_cadastrar` | Cadastrar Cartões | Cadastrar cartões de combustível |
| `gestao_pessoas_veiculos_cartoes_visualizar` | Visualizar Cartões | Consultar cartões cadastrados |

### 3.5 Pedágios (2 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_pedagios_cadastrar` | Cadastrar Pedágios | Registrar despesas de pedágio |
| `gestao_pessoas_veiculos_pedagios_visualizar` | Visualizar Pedágios | Consultar registros de pedágio |

### 3.6 Checklists e Abastecimento (3 permissões)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_checklists_criar` | Criar Checklists | Criar checklists de inspeção |
| `gestao_pessoas_veiculos_checklists_visualizar` | Visualizar Checklists | Consultar checklists realizados |
| `gestao_pessoas_veiculos_abastecimento_gerenciar` | Gerenciar Abastecimento | Controlar abastecimentos da frota |

### 3.7 Relatórios (1 permissão)

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_veiculos_relatorios` | Relatórios | Relatórios gerais de veículos |

**Páginas relacionadas:**
- `/gestao-pessoas/dashboard-veiculos` - Dashboard
- `/gestao-pessoas/consultas-veiculos` - Consultas
- `/gestao-pessoas/cadastro-veiculo` - Cadastro
- `/gestao-pessoas/cadastro-multa` - Multas
- `/gestao-pessoas/cadastro-condutor` - Condutores
- `/gestao-pessoas/cadastro-cartao` - Cartões
- `/gestao-pessoas/cadastro-pedagio` - Pedágios
- `/gestao-pessoas/checklist-veiculos` - Checklists
- `/gestao-pessoas/calculo-rotas` - Cálculo de rotas (sem permissão específica)
- `/gestao-pessoas/controle-abastecimento` - Abastecimento
- `/gestao-pessoas/relatorios-veiculos` - Relatórios

---

## 4️⃣ Recrutamento & Seleção (6 permissões)

Controla o processo de recrutamento, desde abertura de vagas até banco de talentos.

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_recrutamento_dashboard` | Dashboard | Dashboard de recrutamento e seleção |
| `gestao_pessoas_recrutamento_abertura_vaga` | Abertura de Vaga | Criar novas vagas |
| `gestao_pessoas_recrutamento_gestao_vagas` | Gestão de Vagas | Gerenciar vagas abertas |
| `gestao_pessoas_recrutamento_aprovacao_vaga` | Aprovação de Vaga | Aprovar/reprovar solicitações de vaga |
| `gestao_pessoas_recrutamento_banco_talentos` | Banco de Talentos | Acessar banco de candidatos |
| `gestao_pessoas_recrutamento_acompanhamento_sla` | Acompanhamento SLA | Acompanhar SLA das etapas |

**Páginas relacionadas:**
- `/gestao-pessoas/dashboard-recrutamento` - Dashboard
- `/gestao-pessoas/rh-abertura-vaga` - Abertura
- `/gestao-pessoas/gestao-vagas` - Gestão
- `/gestao-pessoas/aprovacao-vaga` - Aprovação
- `/gestao-pessoas/banco-talentos` - Banco de Talentos

**⚠️ Nota:** Atualmente as páginas de Recrutamento **NÃO** têm validação de permissão no código. Todas são acessíveis para quem tem acesso ao módulo Gestão de Pessoas. As permissões estão definidas para futura implementação de controle granular.

---

## 5️⃣ Prestadores de Serviço (14 permissões)

Controla a gestão de prestadores PJ, contratos, notas fiscais, férias e passivos.

| Slug da Permissão | Label | Descrição |
|-------------------|-------|-----------|
| `gestao_pessoas_prestadores_dashboard` | Dashboard | Dashboard de prestadores de serviço |
| `gestao_pessoas_prestadores_cadastrar_pj` | Cadastrar Pessoa Jurídica | Cadastrar novos prestadores PJ |
| `gestao_pessoas_prestadores_consultar_pj` | Consultar Prestadores | Consultar prestadores cadastrados |
| `gestao_pessoas_prestadores_editar_pj` | Editar Prestador | Editar dados de prestadores |
| `gestao_pessoas_prestadores_contratos_visualizar` | Visualizar Contratos | Consultar contratos ativos/inativos |
| `gestao_pessoas_prestadores_contratos_criar` | Criar Contrato | Emitir novos contratos de prestação |
| `gestao_pessoas_prestadores_contratos_editar` | Editar Contrato | Editar contratos existentes |
| `gestao_pessoas_prestadores_demonstrativos` | Demonstrativos | Acessar demonstrativos de pagamento |
| `gestao_pessoas_prestadores_nf_emitir` | Emitir Nota Fiscal | Cadastrar emissão de notas fiscais |
| `gestao_pessoas_prestadores_nf_aprovar` | Aprovar Nota Fiscal | Aprovar/reprovar notas fiscais |
| `gestao_pessoas_prestadores_ferias_controlar` | Controlar Férias | Controlar férias de prestadores |
| `gestao_pessoas_prestadores_ferias_aprovar` | Aprovar Férias | Aprovar solicitações de férias |
| `gestao_pessoas_prestadores_passivos` | Controle de Passivos | Gerenciar passivos trabalhistas |
| `gestao_pessoas_prestadores_relatorios` | Relatórios | Relatórios de prestadores |

**Páginas relacionadas:**
- `/gestao-pessoas/dashboard-prestadores` - Dashboard
- `/gestao-pessoas/cadastro-pessoa-juridica` - Cadastro PJ
- `/gestao-pessoas/consulta-prestadores` - Consulta
- `/gestao-pessoas/emissao-contrato-prestacao-servico` - Emissão Contrato
- `/gestao-pessoas/consulta-contratos` - Consulta Contratos
- `/gestao-pessoas/demonstrativo-prestacao-servico` - Demonstrativo
- `/gestao-pessoas/cadastro-emissao-nf` - Emissão NF
- `/gestao-pessoas/aprovacao-nf` - Aprovação NF
- `/gestao-pessoas/controle-ferias` - Controle Férias
- `/gestao-pessoas/aprovacao-ferias` - Aprovação Férias
- `/gestao-pessoas/controle-passivos` - Passivos
- `/gestao-pessoas/relatorios-prestadores` - Relatórios

**⚠️ Nota:** Atualmente as páginas de Prestadores **NÃO** têm validação de permissão no código. Todas são acessíveis para quem tem acesso ao módulo Gestão de Pessoas. As permissões estão definidas para futura implementação de controle granular.

---

## 📊 Resumo de Permissões

| Submódulo | Quantidade de Permissões |
|-----------|-------------------------|
| Solicitações de Serviços | 8 |
| Gestão de Viagens | 5 |
| Gestão de Veículos | 20 |
| Recrutamento & Seleção | 6 |
| Prestadores de Serviço | 14 |
| **TOTAL** | **53** |

---

## 🔐 Como Atribuir Permissões

### 1. Interface Administrativa

1. Acesse `/admin/perfis`
2. Clique em "Novo Perfil" ou edite um perfil existente
3. Procure pelas categorias:
   - **Gestão de Pessoas - Solicitações de Serviços**
   - **Gestão de Pessoas - Viagens**
   - **Gestão de Pessoas - Veículos**
   - **Gestão de Pessoas - Recrutamento & Seleção**
   - **Gestão de Pessoas - Prestadores de Serviço**
4. Selecione as permissões desejadas ou use "Selecionar Todas" por categoria
5. Salve o perfil

### 2. Atribuir Perfil ao Usuário

1. Acesse `/admin/usuarios` ou `/admin/usuarios-direct`
2. Edite o usuário desejado
3. Na seção "Perfis de Acesso", associe o perfil criado
4. As permissões serão aplicadas imediatamente

---

## 🛡️ Validação de Permissões no Código

### No Sidebar

O componente `SidebarSectionGestaoPessoas.tsx` valida permissões usando `canSee(slug)`:

```tsx
{canSee('gestao_pessoas_solicitacoes_dashboard') && (
  <Link to="/gestao-pessoas/kpi-solicitacoes">
    <span>Dashboard</span>
  </Link>
)}
```

**Submódulos com validação ativa:**
- ✅ Solicitações de Serviços
- ✅ Gestão de Viagens
- ✅ Gestão de Veículos
- ❌ Recrutamento & Seleção (sem validação)
- ❌ Prestadores de Serviço (sem validação)

### Em Páginas (Guards)

Para proteger páginas com permissões, utilize o componente `GestaoPessoasGuard`:

```tsx
import { GestaoPessoasGuard } from "@/components/security/GestaoPessoasGuard";

function MinhaPage() {
  return (
    <GestaoPessoasGuard requiredPermission="gestao_pessoas_solicitacoes_criar">
      {/* Conteúdo da página */}
    </GestaoPessoasGuard>
  );
}
```

Ou o `PermissionGuard` para validações mais flexíveis:

```tsx
import { PermissionGuard } from "@/components/security/PermissionGuard";

function ComponenteCondicional() {
  return (
    <PermissionGuard 
      requiredPermission="gestao_pessoas_prestadores_nf_aprovar"
      fallback={<p>Você não tem permissão para aprovar notas fiscais</p>}
    >
      <BotaoAprovar />
    </PermissionGuard>
  );
}
```

---

## 🎯 Recomendações de Perfis de Acesso

### Perfil: Analista de RH

```
✅ Solicitações: visualizar, criar
✅ Viagens: consultar_faturas, relatorios
✅ Recrutamento: dashboard, gestao_vagas, banco_talentos
✅ Prestadores: consultar_pj, demonstrativos
```

### Perfil: Gestor de RH

```
✅ Solicitações: todas (8)
✅ Viagens: todas (5)
✅ Recrutamento: todas (6)
✅ Prestadores: todas exceto aprovar NF (13)
```

### Perfil: Coordenador de Frota

```
✅ Veículos: todas (20)
✅ Viagens: dashboard, consultar_faturas, relatorios
```

### Perfil: Aprovador Financeiro

```
✅ Solicitações: visualizar, aprovar, reprovar
✅ Viagens: consultar_faturas, relatorios
✅ Prestadores: nf_aprovar, demonstrativos, relatorios
```

---

## 🔧 Implementação Futura

### Páginas sem Validação de Permissão

As seguintes páginas **ainda não validam permissões** no código e são acessíveis a todos os usuários com acesso ao módulo Gestão de Pessoas:

**Recrutamento & Seleção (5 páginas):**
- `/gestao-pessoas/dashboard-recrutamento`
- `/gestao-pessoas/rh-abertura-vaga`
- `/gestao-pessoas/gestao-vagas`
- `/gestao-pessoas/aprovacao-vaga`
- `/gestao-pessoas/banco-talentos`

**Prestadores de Serviço (12 páginas):**
- `/gestao-pessoas/dashboard-prestadores`
- `/gestao-pessoas/cadastro-pessoa-juridica`
- `/gestao-pessoas/consulta-prestadores`
- `/gestao-pessoas/emissao-contrato-prestacao-servico`
- `/gestao-pessoas/consulta-contratos`
- `/gestao-pessoas/demonstrativo-prestacao-servico`
- `/gestao-pessoas/cadastro-emissao-nf`
- `/gestao-pessoas/aprovacao-nf`
- `/gestao-pessoas/controle-ferias`
- `/gestao-pessoas/aprovacao-ferias`
- `/gestao-pessoas/controle-passivos`
- `/gestao-pessoas/relatorios-prestadores`

**Recomendação:** Adicionar `GestaoPessoasGuard` ou `PermissionGuard` nessas páginas para ativar o controle de acesso granular.

---

## 📚 Referências

- **Arquivo de permissões:** `src/services/permissionsService.ts`
- **Sidebar:** `src/components/layout/SidebarSectionGestaoPessoas.tsx`
- **Guards de segurança:**
  - `src/components/security/GestaoPessoasGuard.tsx`
  - `src/components/security/PermissionGuard.tsx`
- **Hook de permissões:** `src/hooks/usePermissionsDirect.tsx`
- **Documentação do módulo:** `docs/README-GESTAO-PESSOAS-PRESTADORES.md`
