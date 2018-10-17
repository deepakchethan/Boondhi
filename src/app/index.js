const express = require('express');
const bodyParser = require('body-parser');
const Chain = require('../models/chain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Chain();

app.use(bodyParser.json());

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);
  res.redirect('/blocks');
});

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.listen(HTTP_PORT, () => {
  console.log('App listening on port 3000!');
});
