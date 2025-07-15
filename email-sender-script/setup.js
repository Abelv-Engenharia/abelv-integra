const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Configuração do SMTP
const transporter = nodemailer.createTransporter({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
});

async function testSupabaseConnection() {
  console.log('🔧 Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase
      .from('emails_pendentes')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log(`📊 Tabela emails_pendentes encontrada com ${data.length} registros de teste`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error.message);
    return false;
  }
}

async function testSMTPConnection() {
  console.log('📧 Testando conexão SMTP Office365...');
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP estabelecida com sucesso!');
    console.log(`📮 Configurado para enviar de: ${process.env.SMTP_USER}`);
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão SMTP:', error.message);
    return false;
  }
}

async function insertTestEmail() {
  console.log('📝 Inserindo email de teste...');
  try {
    const { data, error } = await supabase
      .from('emails_pendentes')
      .insert([
        {
          destinatario: process.env.SMTP_USER, // Envia para o próprio e-mail como teste
          assunto: 'Teste de Configuração - Sistema de E-mails',
          corpo: `
            <h2>🎉 Configuração Concluída!</h2>
            <p>Este é um e-mail de teste do sistema de envio automático.</p>
            <p><strong>Configurações:</strong></p>
            <ul>
              <li>SMTP User: ${process.env.SMTP_USER}</li>
              <li>Supabase URL: ${process.env.SUPABASE_URL}</li>
              <li>Data/Hora: ${new Date().toLocaleString('pt-BR')}</li>
            </ul>
            <p>Se você recebeu este e-mail, o sistema está funcionando corretamente!</p>
          `,
          anexos: [],
          enviado: false,
          tentativas: 0
        }
      ])
      .select();
    
    if (error) {
      console.error('❌ Erro ao inserir email de teste:', error.message);
      return false;
    }
    
    console.log('✅ Email de teste inserido com sucesso!');
    console.log(`📧 ID do email: ${data[0].id}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao inserir email de teste:', error.message);
    return false;
  }
}

async function runSetup() {
  console.log('🚀 Iniciando configuração do sistema de e-mails...\n');
  
  // Verificar variáveis de ambiente
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Variáveis de ambiente faltando no arquivo .env');
    process.exit(1);
  }
  
  console.log('📋 Configurações carregadas:');
  console.log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL}`);
  console.log(`   - SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   - SMTP_PASS: ${'*'.repeat(process.env.SMTP_PASS.length)}\n`);
  
  // Testes de conexão
  const supabaseOk = await testSupabaseConnection();
  const smtpOk = await testSMTPConnection();
  
  if (!supabaseOk || !smtpOk) {
    console.error('\n❌ Configuração falhou. Verifique as credenciais e tente novamente.');
    process.exit(1);
  }
  
  // Inserir email de teste
  console.log('');
  const testInserted = await insertTestEmail();
  
  if (testInserted) {
    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('💡 Próximos passos:');
    console.log('   1. Execute "npm start" para processar a fila de emails');
    console.log('   2. Configure um cron job para execução automática');
    console.log('   3. Monitore os logs para verificar o funcionamento');
    console.log('\n📧 Um email de teste foi adicionado à fila e será enviado na próxima execução.');
  } else {
    console.error('\n❌ Falha ao inserir email de teste.');
    process.exit(1);
  }
}

// Executar setup
runSetup().catch(console.error);