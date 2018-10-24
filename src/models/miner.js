const Transaction = require('../models/transaction');
const Wallet = require('../wallet/index');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.getValidTransactions();
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.synchronizeChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();
    return block;
  }
}

module.exports = Miner;
