const Transaction = require('../models/transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(mTransaction) {
    const transactionWithId = this.transactions.find(transaction => transaction.id === mTransaction.id);
    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = mTransaction;
    } else {
      this.transactions.push(mTransaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(trans => trans.input.address === address);
  }

  getValidTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => total + output.amount, 0);

      if (transaction.input.amount !== outputTotal) {
        return;
      }

      if (!Transaction.verifyTransaction(transaction)) {
        return;
      }

      return transaction;
    });
  }
}

module.exports = TransactionPool;
