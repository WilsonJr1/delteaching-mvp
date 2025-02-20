function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidCPF(cpf) {
    const cpfSemPontuacao = cpf.replace(/[.-]/g, '');
    return cpfSemPontuacao.length === 11 && /^\d+$/.test(cpfSemPontuacao);
  }
  
  function isValidCNPJ(cnpj) {
    const cnpjSemPontuacao = cnpj.replace(/[.-/]/g, '');
    return cnpjSemPontuacao.length === 14 && /^\d+$/.test(cnpjSemPontuacao);
  }
  
  
  module.exports = {
    isValidEmail, 
    isValidCNPJ,
    isValidCPF,
    
  };