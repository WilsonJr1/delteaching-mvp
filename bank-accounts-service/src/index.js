// bank-accounts-service/src/index.js
const express = require('express');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./database/db');
const { createBankAccount, getBankAccountByNumber, getBankAccountsByBranch } = require('./controllers/bankAccountController')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware para parsear o corpo das requisições como JSON

app.get('/', (req, res) => {
  res.send('Olá do BankAccounts Service!');
});

app.post('/bank-accounts', createBankAccount); // Rota POST para criar conta, usando o controlador

app.get('/bank-accounts/number/:accountNumber', getBankAccountByNumber);

app.get('/bank-accounts/branch/:branch', getBankAccountsByBranch);

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`BankAccounts Service rodando na porta ${port}`);
  });
}

startServer();