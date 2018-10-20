const express = require('express');
const bodyParser = require('body-parser');
const Chain = require('../models/chain');
const P2pServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Chain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());

app.post('/mine', (req, res) => {
  blockchain.addBlock(req.body.data);
  res.redirect('/blocks');
  p2pServer.synchronizeChains();
});

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.listen(HTTP_PORT, () => {
  // Ignore next line
  console.log('App listening on port ', HTTP_PORT);
});

p2pServer.listen();
