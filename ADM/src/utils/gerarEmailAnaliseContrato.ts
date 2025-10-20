import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnaliseContratual } from "@/types/analise-contratual";

export function gerarAssuntoEmail(dados: AnaliseContratual): string {
  const locador = dados.imobiliaria || dados.nome_proprietario;
  return `Validação de Contrato de Locação – ${locador}`;
}

export function gerarCorpoEmailSimplificado(dados: AnaliseContratual): string {
  const enderecoCompleto = `${dados.logradouro || ''}, ${dados.numero || ''}${dados.complemento ? `, ${dados.complemento}` : ''}, ${dados.bairro || ''}, ${dados.cidade || ''} - ${dados.uf || ''}`;
  
  const valorAluguel = (dados.valor_mensal || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  const valorIR = (dados.ir_valor_retido || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  const valorLiquido = (dados.valor_liquido_pagar || dados.valor_mensal || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  const caucaoFormatado = (dados.caucao || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  const dataInicio = dados.data_inicio_contrato ? format(new Date(dados.data_inicio_contrato), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';
  const dataFim = dados.data_fim_contrato ? format(new Date(dados.data_fim_contrato), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .greeting {
      margin-bottom: 20px;
    }
    .data-row {
      margin-bottom: 12px;
      line-height: 1.6;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      min-width: 180px;
    }
    .btn-link {
      display: inline-block;
      margin: 25px 0;
      padding: 12px 24px;
      background-color: #0066CC;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="greeting">
      Prezados,
    </div>

    <p>Segue abaixo o resumo do contrato cadastrado no Painel de Análise Contratual para validação:</p>

    <div style="margin: 20px 0;">
      <div class="data-row">
        <span class="label">Locador:</span>
        <span>${dados.nome_proprietario || 'N/A'}</span>
      </div>
      
      ${dados.imobiliaria ? `
      <div class="data-row">
        <span class="label">Imobiliária:</span>
        <span>${dados.imobiliaria}</span>
      </div>
      ` : ''}
      
      <div class="data-row">
        <span class="label">Endereço/Objeto:</span>
        <span>${enderecoCompleto}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Valor Aluguel:</span>
        <span>${valorAluguel}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Valor IR:</span>
        <span>${valorIR}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Valor Líquido:</span>
        <span>${valorLiquido}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Vencimento:</span>
        <span>Todo dia ${dados.dia_vencimento || 'N/A'}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Forma de Pagamento:</span>
        <span>${dados.forma_pagamento || 'N/A'}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Caução:</span>
        <span>${caucaoFormatado}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Prazo Contratual:</span>
        <span>${dataInicio} a ${dataFim}</span>
      </div>
      
      ${dados.multa_rescisoria_percentual ? `
      <div class="data-row">
        <span class="label">Multa:</span>
        <span>${dados.multa_rescisoria_percentual}%</span>
      </div>
      ` : ''}
      
      ${dados.despesas_adicionais ? `
      <div class="data-row">
        <span class="label">Despesas adicionais:</span>
        <span>${dados.despesas_adicionais}</span>
      </div>
      ` : ''}
    </div>

    <p>Contrato anexado para conferência e assinatura.</p>

    <a href="${window.location.origin}/painel-analise-contratual" class="btn-link">
      🔗 Clique aqui para acessar a tela de validação no Lovable
    </a>

    <div class="footer">
      <p>Atenciosamente,<br/>
      <strong>${dados.responsavel_analise || 'N/A'}</strong><br/>
      Abelv Engenharia</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Manter funções antigas para compatibilidade
export function gerarCorpoEmail(dados: AnaliseContratual): string {
  return gerarCorpoEmailSimplificado(dados);
}

export function gerarNomeArquivoContrato(dados: AnaliseContratual): string {
  return `${dados.logradouro}, ${dados.numero}${dados.complemento ? `, ${dados.complemento}` : ''}, ${dados.bairro}.pdf`;
}

export function gerarNomeArquivoVistoria(dados: AnaliseContratual): string {
  return `${dados.logradouro}, ${dados.numero}${dados.complemento ? `, ${dados.complemento}` : ''}, ${dados.bairro} VISTORIA.pdf`;
}