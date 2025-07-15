/**
 * Exemplo de uso do sistema de e-mails
 * 
 * Este arquivo demonstra como inserir e-mails na fila para envio automático
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const TemplateHelper = require('../utils/template-helper');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Função para adicionar e-mail à fila
 */
async function adicionarEmailNaFila(destinatario, assunto, corpo, anexos = []) {
  try {
    const { data, error } = await supabase
      .from('emails_pendentes')
      .insert([
        {
          destinatario,
          assunto,
          corpo,
          anexos
        }
      ]);

    if (error) {
      console.error('Erro ao adicionar e-mail na fila:', error);
      return false;
    }

    console.log('E-mail adicionado na fila com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro:', error);
    return false;
  }
}

/**
 * Exemplo 1: E-mail simples sem anexos
 */
async function exemploEmailSimples() {
  console.log('=== Exemplo 1: E-mail simples ===');
  
  const htmlContent = TemplateHelper.createSimpleEmail(
    'Bem-vindo ao Sistema',
    'Obrigado por se cadastrar em nosso sistema. Seu cadastro foi realizado com sucesso!',
    'João Silva',
    {
      remetente: 'Equipe de Suporte',
      info: 'Você pode acessar o sistema a qualquer momento.',
      link: 'https://sistema.com/login',
      botao: 'Acessar Sistema'
    }
  );

  await adicionarEmailNaFila(
    'joao@email.com',
    'Bem-vindo ao Sistema',
    htmlContent
  );
}

/**
 * Exemplo 2: E-mail com anexos
 */
async function exemploEmailComAnexos() {
  console.log('=== Exemplo 2: E-mail com anexos ===');
  
  const anexos = [
    {
      nome_arquivo: 'relatorio_mensal.pdf',
      url: 'https://xexgdtlctyuycohzhmuu.supabase.co/storage/v1/object/public/ocorrencias/relatorio_janeiro.pdf'
    },
    {
      nome_arquivo: 'dados_complementares.xlsx',
      url: 'https://xexgdtlctyuycohzhmuu.supabase.co/storage/v1/object/public/ocorrencias/dados.xlsx'
    }
  ];

  const htmlContent = TemplateHelper.createSimpleEmail(
    'Relatório Mensal Disponível',
    'Segue em anexo o relatório mensal solicitado. Por favor, revise os dados e nos informe sobre qualquer inconsistência.',
    'Maria Santos',
    {
      remetente: 'Departamento de Relatórios',
      info: 'Este relatório contém dados sensíveis. Mantenha-o em local seguro.',
      anexos: anexos
    }
  );

  await adicionarEmailNaFila(
    'maria@email.com',
    'Relatório Mensal - Janeiro 2024',
    htmlContent,
    anexos
  );
}

/**
 * Exemplo 3: E-mail HTML personalizado
 */
async function exemploEmailPersonalizado() {
  console.log('=== Exemplo 3: E-mail HTML personalizado ===');
  
  const htmlPersonalizado = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Notificação de Ocorrência</h2>
        <p>Uma nova ocorrência foi registrada no sistema:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <strong>Tipo:</strong> Acidente de Trabalho<br>
          <strong>Data:</strong> 15/07/2024<br>
          <strong>Local:</strong> Setor de Produção<br>
          <strong>Responsável:</strong> João Silva
        </div>
        <p>Acesse o sistema para mais detalhes.</p>
        <a href="https://sistema.com/ocorrencias" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ver Ocorrência
        </a>
      </body>
    </html>
  `;

  await adicionarEmailNaFila(
    'supervisor@email.com',
    'Nova Ocorrência Registrada',
    htmlPersonalizado
  );
}

/**
 * Exemplo 4: E-mail em lote
 */
async function exemploEmailLote() {
  console.log('=== Exemplo 4: E-mail em lote ===');
  
  const destinatarios = [
    { email: 'funcionario1@email.com', nome: 'Carlos Silva' },
    { email: 'funcionario2@email.com', nome: 'Ana Costa' },
    { email: 'funcionario3@email.com', nome: 'Pedro Santos' }
  ];

  for (const destinatario of destinatarios) {
    const htmlContent = TemplateHelper.createSimpleEmail(
      'Treinamento Obrigatório',
      `Você tem um treinamento obrigatório agendado para amanhã às 14:00. Por favor, compareça no horário marcado.`,
      destinatario.nome,
      {
        remetente: 'RH - Treinamentos',
        info: 'O treinamento é obrigatório para todos os funcionários.',
        link: 'https://sistema.com/treinamentos',
        botao: 'Ver Detalhes'
      }
    );

    await adicionarEmailNaFila(
      destinatario.email,
      'Treinamento Obrigatório - Amanhã 14:00',
      htmlContent
    );
  }
}

/**
 * Função para consultar status da fila
 */
async function consultarStatusFila() {
  console.log('=== Status da Fila de E-mails ===');
  
  try {
    // E-mails pendentes
    const { data: pendentes, error: errorPendentes } = await supabase
      .from('emails_pendentes')
      .select('*')
      .eq('enviado', false);

    // E-mails enviados
    const { data: enviados, error: errorEnviados } = await supabase
      .from('emails_pendentes')
      .select('*')
      .eq('enviado', true);

    // E-mails com falha
    const { data: falhados, error: errorFalhados } = await supabase
      .from('emails_pendentes')
      .select('*')
      .eq('enviado', false)
      .gte('tentativas', 3);

    if (errorPendentes || errorEnviados || errorFalhados) {
      console.error('Erro ao consultar status:', errorPendentes || errorEnviados || errorFalhados);
      return;
    }

    console.log(`📧 E-mails pendentes: ${pendentes.length}`);
    console.log(`✅ E-mails enviados: ${enviados.length}`);
    console.log(`❌ E-mails falhados: ${falhados.length}`);
    
    if (pendentes.length > 0) {
      console.log('\nPróximos e-mails na fila:');
      pendentes.slice(0, 5).forEach((email, index) => {
        console.log(`${index + 1}. ${email.destinatario} - ${email.assunto} (tentativas: ${email.tentativas})`);
      });
    }

  } catch (error) {
    console.error('Erro ao consultar status:', error);
  }
}

// Executar exemplos
async function main() {
  console.log('=== EXEMPLOS DE USO DO SISTEMA DE E-MAILS ===\n');
  
  // Consultar status inicial
  await consultarStatusFila();
  
  // Executar exemplos (descomente os que deseja testar)
  // await exemploEmailSimples();
  // await exemploEmailComAnexos();
  // await exemploEmailPersonalizado();
  // await exemploEmailLote();
  
  console.log('\n=== EXEMPLOS CONCLUÍDOS ===');
  console.log('Execute o script principal (npm start) para processar a fila');
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  adicionarEmailNaFila,
  consultarStatusFila,
  TemplateHelper
};