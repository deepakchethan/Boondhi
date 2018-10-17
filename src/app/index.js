const express = require('express');
const Chain = require('../models/chain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Chain();

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.listen(HTTP_PORT, () => {
  console.log('App listening on port 3000!');
});
