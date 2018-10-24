const { INITIAL_BALANCE } = require('../../config');
const ChainUtil = require('./chainutil');

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

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}


module.exports = Wallet;
