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
    this.signTransaction(transaction, sendersWallet);
    return transaction;
  }

  static signTransaction(transaction, sendersWallet) {
    transaction.input = {
      timeStamp: Date.now(),
      amount: sendersWallet.balance,
      address: sendersWallet.publicKey,
      signature: sendersWallet.sign(ChainUtil.hash(transaction.outputs)),
    };
  }

  static verifyTransaction(transaction) {
    return ChainUtil.verifySignature(
      transaction.input.address,
      transaction.input.signature,
      ChainUtil.hash(transaction.outputs),
    );
  }
}

module.exports = Transaction;
