const ChainUtil = require('../wallet/chainutil');
const { MINING_REWARD } = require('../../config');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  update(senderWallet, recipient, amount) {
    const sendersOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > sendersOutput.amount) {
      return;
    }
    sendersOutput.amount -= amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);
    return this;
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

  static transactionWithOutputs(sendersWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, sendersWallet);
    return transaction;
  }

  static rewardTransaction(minersWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [{
      amount: MINING_REWARD, address: minersWallet.publicKey,
    }]);
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
