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
}

module.exports = TransactionPool;
