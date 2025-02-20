// bank-accounts-service/src/index.js
const express = require('express');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./database/db');
const { createBankAccount, getBankAccountByNumber, getBankAccountsByBranch, getBankAccountsByHolderDocument } = require('./controllers/bankAccountController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Olá do BankAccounts Service!');
});

app.post('/bank-accounts', createBankAccount); 

app.get('/bank-accounts/number/:accountNumber', getBankAccountByNumber);

app.get('/bank-accounts/branch/:branch', getBankAccountsByBranch);

app.get('/bank-accounts/holder-document/:holderDocument', getBankAccountsByHolderDocument);


async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`BankAccounts Service rodando na porta ${port}`);
  });
}

startServer();