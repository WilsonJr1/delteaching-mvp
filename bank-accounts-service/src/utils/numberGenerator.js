function generateAccountNumber() {
    const length = 5; 
    let accountNumber = '';
    const digits = '0123456789';
  
    for (let i = 0; i < length; i++) {
      accountNumber += digits.charAt(Math.floor(Math.random() * digits.length));
    }
  
    return accountNumber;
  }
  
  module.exports = {
    generateAccountNumber,
  };