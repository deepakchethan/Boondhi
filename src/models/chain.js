const Block = require('./block');

class Chain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  static getChain() {
    return this.chain;
  }

  /*
  * This method adds a block to the current chain instance
  * @param boondhi the data to be added
  */
  addBlock(boondhi) {
    const prevBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(prevBlock, boondhi);
    this.chain.push(block);
  }

  /*
  * Method that checks if the chain is valid by two mechanisms
  * By comparing the genesis block hash
  * By comparing the hash of prev block in current block and if the hash of block is valid
  * @param chain the reference of blockchain to be validated
  * @return boolean
  */
  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i += 1) {
      const prevBlock = chain[i - 1];
      const currBlock = chain[i];

      if (prevBlock.currHash !== currBlock.prevHash
        || currBlock.currHash !== Block.hashOfBlock(currBlock)) {
        return false;
      }
    }
    return true;
  }

  /*
   * Method to solve chain splits
   * It replaces the longer chain with the current chain
   * @param reference of the chain
  */
  replaceChainWith(chain) {
    if (this.chain.length < chain.length) {
      return;
    }
    if (!Chain.isValidChain(chain)) {
      return;
    }
    this.chain = chain;
  }
}

module.exports = Chain;
