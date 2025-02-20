// bank-accounts-service/src/controllers/bankAccountController.js
const { pool } = require('../database/db');
const { generateAccountNumber } = require('../utils/numberGenerator');
const { isValidCPF, isValidCNPJ, isValidEmail } = require('../utils/validator'); // Importa isValidEmail também

const createBankAccount = async (req, res) => {
  try {
    const {
      branch,
      type,
      holderName,
      holderEmail,
      holderDocument,
      holderType,
    } = req.body;

    // Validação básica dos campos obrigatórios (RF02)
    if (!branch || !type || !holderName || !holderEmail || !holderDocument || !holderType) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Validação do formato CPF/CNPJ do holderDocument
    if (!isValidCPF(holderDocument) && !isValidCNPJ(holderDocument)) {
      return res.status(400).json({ message: 'O documento do titular deve ser um CPF ou CNPJ válido.' });
    }

    // Validação do formato de email do holderEmail (Nova Validação - RD05)
    if (!isValidEmail(holderEmail)) {
      return res.status(400).json({ message: 'O email do titular deve ter um formato válido.' });
    }


    // Validação do tamanho máximo de holderEmail (RD05) - Já validado pelo formato, mas podemos manter por segurança
    const maxEmailLength = 200; // RD05
    if (holderEmail.length > maxEmailLength) {
      return res.status(400).json({ message: `O email do titular não pode ter mais de ${maxEmailLength} caracteres.` });
    }


    // Validação de unicidade do holderDocument
    const documentCheckResult = await pool.query(
      'SELECT 1 FROM BankAccounts WHERE holderDocument = $1',
      [holderDocument]
    );
    const documentAlreadyExists = documentCheckResult.rows.length > 0;

    if (documentAlreadyExists) {
      return res.status(409).json({ message: 'Já existe um cliente cadastrado com este documento.' });
    }

    let accountNumber;
    let accountNumberExists;

    do {
      accountNumber = generateAccountNumber();
      const checkNumberResult = await pool.query(
        'SELECT 1 FROM BankAccounts WHERE number = $1',
        [accountNumber]
      );
      accountNumberExists = checkNumberResult.rows.length > 0;
    } while (accountNumberExists);

    const result = await pool.query(
      'INSERT INTO BankAccounts (branch, number, type, holderName, holderEmail, holderDocument, holderType) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, number',
      [branch, accountNumber, type, holderName, holderEmail, holderDocument, holderType]
    );

    const newAccountId = result.rows[0].id;
    const newAccountNumber = result.rows[0].number;

    await pool.query(
      'INSERT INTO Balances (bankAccountId) VALUES ($1)',
      [newAccountId]
    );

    res.status(201).json({
      message: 'Conta bancária criada com sucesso!',
      bankAccountId: newAccountId,
      bankAccountNumber: newAccountNumber,
    });

  } catch (error) {
    console.error('Erro ao criar conta bancária:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar conta bancária.' });
  }
};


const getBankAccountByNumber = async (req, res) => {
    try {
      const accountNumber = req.params.accountNumber; 
  
      if (!accountNumber) {
        return res.status(400).json({ message: 'Número da conta bancária é obrigatório para a busca.' });
      }
  
      const result = await pool.query(
        'SELECT * FROM BankAccounts WHERE number = $1', // Busca a conta pelo número
        [accountNumber]
      );
  
      const bankAccount = result.rows[0]; // Pega o primeiro resultado (ou undefined se não encontrar)
  
      if (!bankAccount) {
        return res.status(404).json({ message: 'Conta bancária não encontrada.' }); // Retorna 404 se não encontrar
      }
  
      res.status(200).json(bankAccount); // Retorna a conta bancária encontrada (status 200 OK)
  
    } catch (error) {
      console.error('Erro ao buscar conta bancária por número:', error);
      res.status(500).json({ message: 'Erro interno do servidor ao buscar conta bancária.' });
    }
  };


  
  const getBankAccountsByBranch = async (req, res) => {
  try {
    const branchCode = req.params.branch; // Pega o código da agência dos parâmetros da URL

    if (!branchCode) {
      return res.status(400).json({ message: 'Código da agência é obrigatório para a busca.' });
    }

    const result = await pool.query(
      'SELECT * FROM BankAccounts WHERE branch = $1', // Busca contas pela agência
      [branchCode]
    );

    const bankAccounts = result.rows; // Pega todos os resultados (pode ser um array vazio ou com várias contas)

    if (bankAccounts.length === 0) {
      return res.status(404).json({ message: 'Nenhuma conta bancária encontrada para esta agência.' }); // Retorna 404 se não encontrar contas na agência
    }

    res.status(200).json(bankAccounts); // Retorna o array de contas bancárias encontradas (status 200 OK)

  } catch (error) {
    console.error('Erro ao buscar contas bancárias por agência:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar contas bancárias por agência.' });
  }
};


module.exports = {
  createBankAccount,
  getBankAccountByNumber,
  getBankAccountsByBranch, // Exporta a nova função getBankAccountsByBranch
}
