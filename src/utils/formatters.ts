/**
 * Formata o CNPJ no padrão XX.XXX.XXX/XXXX-XX
 */
export function formatarcnpj(cnpj: string): string {
  // Remove caracteres não numéricos
  const apenasNumeros = cnpj.replace(/\D/g, '');
  
  // Aplica a máscara
  if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  // Retorna o valor original se não tiver 14 dígitos
  return cnpj;
}
