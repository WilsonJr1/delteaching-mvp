function isValidCPF(cpf) {
    const cpfSemPontuacao = cpf.replace(/[.-]/g, ''); // Remove pontos e traços
    return cpfSemPontuacao.length === 11 && /^\d+$/.test(cpfSemPontuacao); // 11 dígitos e apenas dígitos
  }
  
  function isValidCNPJ(cnpj) {
    const cnpjSemPontuacao = cnpj.replace(/[.-/]/g, ''); // Remove pontos, traços e barras
    return cnpjSemPontuacao.length === 14 && /^\d+$/.test(cnpjSemPontuacao); // 14 dígitos e apenas dígitos
  }
  
  module.exports = {
    isValidCPF,
    isValidCNPJ,
  };