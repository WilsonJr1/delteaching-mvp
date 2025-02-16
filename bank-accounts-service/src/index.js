const express = require('express');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./database/db'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Olá do BankAccounts Service!');
});

async function startServer() {
  await connectToDatabase(); 

  app.listen(port, () => {
    console.log(`BankAccounts Service rodando na porta ${port}`);
  });
}

startServer();