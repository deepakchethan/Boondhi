const { INITIAL_BALANCE } = require('../../config');
const ChainUtil = require('./chainutil');
const Transaction = require('../models/transaction');
const Blockchain = require('../models/chain');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.generateKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
    public Key : ${this.publicKey.toString()}
    balance    : ${this.balance}`;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];
    let recentInput;
    let startTime;
    blockchain.chain.forEach(block => block.boondhis.forEach(transaction => transactions.push(transaction)));
    const walletInputs = transactions.filter(transaction => transaction.input.address === this.publicKey);
    if (walletInputs.length > 0) {
      recentInput = walletInputs.reduce((prev, current) => prev.input.timeStamp > current.input.timeStamp ? prev : current);
      balance = recentInput.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInput.input.timeStamp;
    }
    transactions.forEach(transaction => {
      if (transaction.input.timeStamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });
    
    return balance;
  }

  
  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);
    if (amount > this.balance) {
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);
    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }
}


module.exports = Wallet;
