const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timeStamp, prevHash, currHash, boondhis) {
    this.timeStamp = timeStamp;
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.boondhis = boondhis;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timeStamp}
      Last Hash: ${this.prevHash}
      Hash     : ${this.currHash}
      Boondhis : ${this.boondhis}`;
  }

  /*
  * Method that creates and returns genesis block
  */
  static genesis() {
    return new this('0000', '0000', Block.hash('0000', '0000', {}), {});
  }

  /*
  * Method that generates a new block with the transactions
  * @param lastBlock contains reference to previous block
  * @param boondhis contains the transactions data
  * @return new block instance
  */
  static mineBlock(lastBlock, boondhis) {
    const timeStamp = Date.now();
    const prevHash = lastBlock.currHash;
    const currHash = Block.hash(timeStamp, prevHash, boondhis);

    return new this(timeStamp, prevHash, currHash, boondhis);
  }

  /*
  * Helper method that returns hash of given block
  * @param block from a chain
  * @return hash of the given block
  */
  static hashOfBlock(block) {
    const { timeStamp, prevHash, boondhis } = block;
    return this.hash(timeStamp, prevHash, boondhis);
  }

  /*
  * Helper method that returns the hash of given details
  * @param timeStamp epoch time of creation of block
  * @param prevHash hash of the previous block in a blockchain
  * @param boondhis the object containing the transactions
  */
  static hash(timeStamp, prevHash, boondhis) {
    return SHA256(`${timeStamp}${prevHash}${boondhis}`).toString();
  }
}

module.exports = Block;
