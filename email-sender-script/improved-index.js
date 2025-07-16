
require('dotenv').config();
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração do SMTP Office365
const transporter = nodemailer.createTransporter({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

// Função para fazer log
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

// Função para baixar anexo de uma URL
async function downloadAttachment(url, filename) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 30000
    });

    return {
      filename: filename,
      content: response.data,
      contentType: response.headers['content-type'] || 'application/octet-stream'
    };
  } catch (error) {
    log(`Erro ao baixar anexo ${filename}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Função para processar anexos
async function processAttachments(anexos) {
  if (!anexos || anexos.length === 0) {
    return [];
  }

  const attachments = [];
  
  for (const anexo of anexos) {
    try {
      const attachment = await downloadAttachment(anexo.url, anexo.nome_arquivo);
      attachments.push(attachment);
      log(`Anexo processado: ${anexo.nome_arquivo}`);
    } catch (error) {
      log(`Falha ao processar anexo ${anexo.nome_arquivo}: ${error.message}`, 'ERROR');
    }
  }

  return attachments;
}

// Função para gerar relatório automático
async function generateReport(tipoRelatorio, periodoDias, ccaId = null) {
  try {
    log(`Gerando relatório automático: ${tipoRelatorio} (${periodoDias} dias)${ccaId ? ` para CCA ${ccaId}` : ''}`);
    
    const { data, error } = await supabase.functions.invoke('generate-report', {
      body: {
        tipo_relatorio: tipoRelatorio,
        periodo_dias: periodoDias,
        data_referencia: new Date().toISOString(),
        cca_id: ccaId
      }
    });

    if (error) {
      log(`Erro ao gerar relatório: ${error.message}`, 'ERROR');
      return null;
    }

    if (data && data.success) {
      log(`Relatório gerado com sucesso: ${tipoRelatorio}`);
      return data.html;
    } else {
      log(`Falha ao gerar relatório: ${data?.error || 'Erro desconhecido'}`, 'ERROR');
      return null;
    }
  } catch (error) {
    log(`Erro ao chamar função de relatório: ${error.message}`, 'ERROR');
    return null;
  }
}

// Função para enviar um e-mail
async function sendEmail(emailData) {
  try {
    log(`Enviando e-mail para ${emailData.destinatario} - Assunto: ${emailData.assunto}`);
    
    let corpoFinal = emailData.corpo;
    
    // Verificar se existe configuração com relatório automático
    const { data: configs, error: configError } = await supabase
      .from('configuracoes_emails')
      .select('tipo_relatorio, periodo_dias, cca_id')
      .eq('assunto', emailData.assunto)
      .eq('ativo', true)
      .not('tipo_relatorio', 'is', null)
      .limit(1);
    
    if (!configError && configs && configs.length > 0) {
      const config = configs[0];
      log(`Configuração encontrada com relatório: ${config.tipo_relatorio}${config.cca_id ? ` para CCA ${config.cca_id}` : ''}`);
      
      // Gerar relatório automático
      const relatorioHtml = await generateReport(config.tipo_relatorio, config.periodo_dias || 30, config.cca_id);
      
      if (relatorioHtml) {
        corpoFinal += '<br><br><hr><br>' + relatorioHtml;
        log(`Relatório adicionado ao e-mail: ${config.tipo_relatorio}`);
      } else {
        log(`Falha ao gerar relatório: ${config.tipo_relatorio}`, 'WARN');
      }
    }

    // Processar anexos
    const attachments = await processAttachments(emailData.anexos || []);

    // Configurar o e-mail
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emailData.destinatario,
      subject: emailData.assunto,
      html: corpoFinal,
      attachments: attachments
    };

    // Enviar e-mail
    await transporter.sendMail(mailOptions);
    log(`E-mail enviado com sucesso para ${emailData.destinatario}`);

    // Atualizar status no banco
    await supabase
      .from('emails_pendentes')
      .update({ 
        enviado: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', emailData.id);

    return true;
  } catch (error) {
    log(`Erro ao enviar e-mail para ${emailData.destinatario}: ${error.message}`, 'ERROR');
    
    // Incrementar tentativas
    await supabase
      .from('emails_pendentes')
      .update({ 
        tentativas: emailData.tentativas + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', emailData.id);

    return false;
  }
}

// Função principal
async function processEmailQueue() {
  try {
    log('Iniciando processamento da fila de e-mails...');

    // Buscar e-mails pendentes
    const { data: emails, error } = await supabase
      .from('emails_pendentes')
      .select('*')
      .eq('enviado', false)
      .lt('tentativas', 3)
      .order('criado_em', { ascending: true });

    if (error) {
      log(`Erro ao consultar e-mails pendentes: ${error.message}`, 'ERROR');
      return;
    }

    if (!emails || emails.length === 0) {
      log('Nenhum e-mail pendente encontrado');
      return;
    }

    log(`Encontrados ${emails.length} e-mails pendentes`);

    // Processar cada e-mail
    let sucessos = 0;
    let falhas = 0;

    for (const email of emails) {
      const success = await sendEmail(email);
      if (success) {
        sucessos++;
      } else {
        falhas++;
      }
      
      // Pequena pausa entre envios
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    log(`Processamento concluído. Sucessos: ${sucessos}, Falhas: ${falhas}`);

  } catch (error) {
    log(`Erro no processamento da fila: ${error.message}`, 'ERROR');
  }
}

// Função para testar conexão SMTP
async function testSMTPConnection() {
  try {
    await transporter.verify();
    log('Conexão SMTP testada com sucesso');
    return true;
  } catch (error) {
    log(`Erro na conexão SMTP: ${error.message}`, 'ERROR');
    return false;
  }
}

// Função para testar conexão Supabase
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('emails_pendentes')
      .select('count')
      .limit(1);

    if (error) {
      log(`Erro na conexão Supabase: ${error.message}`, 'ERROR');
      return false;
    }

    log('Conexão Supabase testada com sucesso');
    return true;
  } catch (error) {
    log(`Erro na conexão Supabase: ${error.message}`, 'ERROR');
    return false;
  }
}

// Executar script
async function main() {
  log('=== INICIANDO SCRIPT DE ENVIO DE E-MAILS ===');
  
  // Testar conexões
  const smtpOk = await testSMTPConnection();
  const supabaseOk = await testSupabaseConnection();
  
  if (!smtpOk || !supabaseOk) {
    log('Falha nos testes de conexão. Abortando execução.', 'ERROR');
    process.exit(1);
  }

  // Processar fila de e-mails
  await processEmailQueue();
  
  log('=== SCRIPT FINALIZADO ===');
  
  // Encerrar processo
  process.exit(0);
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main();
}

// Exportar para uso em outros módulos
module.exports = {
  processEmailQueue,
  sendEmail,
  testSMTPConnection,
  testSupabaseConnection
};
