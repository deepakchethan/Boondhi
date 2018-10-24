const ChainUtil = require('../wallet/chainutil');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(sendersWallet, recieverWallet, amount) {
    const transaction = new this();

    if (amount > sendersWallet.balance) {
      return;
    }

    transaction.outputs.push(...[
      { amount: sendersWallet.balance - amount, address: sendersWallet.publicKey },
      { amount, address: recieverWallet }]);
      return transaction;
  }
}

module.exports = Transaction;
