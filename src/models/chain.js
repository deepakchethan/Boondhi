const Block = require('./block');

class Chain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  static getChain() {
    return this.chain;
  }

  addBlock(boondhi) {
    const prevBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(prevBlock, boondhi);
    this.chain.push(block);
  }
}

module.exports = Chain;
