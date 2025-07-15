const fs = require('fs');
const path = require('path');

/**
 * Utilitário para processar templates de e-mail
 */
class TemplateHelper {
  /**
   * Carrega um template HTML
   * @param {string} templateName - Nome do template (sem extensão)
   * @returns {string} - Conteúdo do template
   */
  static loadTemplate(templateName) {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${templateName} não encontrado`);
    }
    
    return fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * Substitui variáveis no template
   * @param {string} template - Conteúdo do template
   * @param {object} variables - Objeto com as variáveis para substituir
   * @returns {string} - Template processado
   */
  static processTemplate(template, variables) {
    let processedTemplate = template;
    
    // Substituir variáveis simples {{VARIAVEL}}
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value || '');
    }
    
    // Processar seções condicionais {{#VARIAVEL}}...{{/VARIAVEL}}
    const conditionalRegex = /{{#(\w+)}}(.*?){{\/\1}}/gs;
    processedTemplate = processedTemplate.replace(conditionalRegex, (match, key, content) => {
      const value = variables[key];
      return value && value !== '' ? content : '';
    });
    
    return processedTemplate;
  }

  /**
   * Cria um e-mail HTML a partir de um template
   * @param {string} templateName - Nome do template
   * @param {object} data - Dados para o template
   * @returns {string} - HTML do e-mail
   */
  static createEmail(templateName, data) {
    const template = this.loadTemplate(templateName);
    
    // Adicionar data/hora atual se não fornecida
    if (!data.DATA_ENVIO) {
      data.DATA_ENVIO = new Date().toLocaleString('pt-BR');
    }
    
    return this.processTemplate(template, data);
  }

  /**
   * Cria um e-mail simples sem template
   * @param {string} titulo - Título do e-mail
   * @param {string} mensagem - Mensagem principal
   * @param {string} destinatario - Nome do destinatário
   * @param {object} options - Opções adicionais
   * @returns {string} - HTML do e-mail
   */
  static createSimpleEmail(titulo, mensagem, destinatario, options = {}) {
    const data = {
      TITULO: titulo,
      MENSAGEM: mensagem,
      DESTINATARIO: destinatario,
      REMETENTE: options.remetente || 'Sistema',
      INFO_ADICIONAL: options.info || '',
      LINK_ACAO: options.link || '#',
      TEXTO_BOTAO: options.botao || 'Clique aqui',
      ANEXOS: options.anexos && options.anexos.length > 0 ? 'true' : '',
      LISTA_ANEXOS: options.anexos || [],
      DATA_ENVIO: new Date().toLocaleString('pt-BR')
    };

    return this.createEmail('email-template', data);
  }
}

module.exports = TemplateHelper;