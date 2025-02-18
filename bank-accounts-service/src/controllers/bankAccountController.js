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

module.exports = {
  createBankAccount,
};