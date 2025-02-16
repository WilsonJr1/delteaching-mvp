const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3000; // Usa a porta definida em .env ou 3000 por padrão

app.get('/', (req, res) => {
  res.send('Olá do BankAccounts Service!');
});

app.listen(port, () => {
  console.log(`BankAccounts Service rodando na porta ${port}`);
});