const express = require('express');
const bodyParser = require('body-parser');
const Chain = require('../models/chain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet/index');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Chain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(blockchain, tp);

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

// Get the transactions inside the pool
app.get('/transactions', (req, res) => {
  res.json(tp.transactions);
});

// Adds the transaction to the pool
app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

p2pServer.listen();
