const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../../config');

class Block {
  constructor(timeStamp, prevHash, currHash, boondhis, nonce) {
    this.timeStamp = timeStamp;
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.boondhis = boondhis;
    this.nonce = nonce;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timeStamp}
      Last Hash: ${this.prevHash}
      Hash     : ${this.currHash}
      Nonce    : ${this.nonce}
      Boondhis : ${this.boondhis}`;
  }

  /*
  * Method that creates and returns genesis block
  */
  static genesis() {
    return new this('0000', '0000', Block.hash('0000', '0000', {}), {}, 0);
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
   
    let nonce = 0;
    let currHash;
    // Poof of work system algorithm for consensus
    do {
      nonce += 1;
      currHash = Block.hash(timeStamp, prevHash, boondhis, nonce);
    } while (currHash.substr(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));
    return new this(timeStamp, prevHash, currHash, boondhis, nonce);
  }

  /*
  * Helper method that returns hash of given block
  * @param block from a chain
  * @return hash of the given block
  */
  static hashOfBlock(block) {
    const { timeStamp, prevHash, boondhis, nonce } = block;
    return this.hash(timeStamp, prevHash, boondhis, nonce);
  }

  /*
  * Helper method that returns the hash of given details
  * @param timeStamp epoch time of creation of block
  * @param prevHash hash of the previous block in a blockchain
  * @param boondhis the object containing the transactions
  */
  static hash(timeStamp, prevHash, boondhis, nonce) {
    return SHA256(`${timeStamp}${prevHash}${boondhis}${nonce}`).toString();
  }
}

module.exports = Block;
