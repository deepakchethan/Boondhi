const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../../config');

class Block {
  constructor(timeStamp, prevHash, currHash, boondhis, nonce, difficulty) {
    this.timeStamp = timeStamp;
    this.prevHash = prevHash;
    this.currHash = currHash;
    this.boondhis = boondhis;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp  : ${this.timeStamp}
      Last Hash  : ${this.prevHash}
      Hash       : ${this.currHash}
      Nonce      : ${this.nonce}
      Difficulty : ${this.difficulty}
      Boondhis   : ${this.boondhis}`;
  }

  /*
  * Method that creates and returns genesis block
  */
  static genesis() {
    return new this('0000', '0000', Block.hash('0000', '0000', {}, 0, DIFFICULTY), {}, 0, DIFFICULTY);
  }

  /*
  * Method that generates a new block with the transactions
  * @param lastBlock contains reference to previous block
  * @param boondhis contains the transactions data
  * @return new block instance
  */
  static mineBlock(lastBlock, boondhis) {
    // Time of block creation time initiation
    const timeStamp = Date.now();
    const prevHash = lastBlock.currHash;
    let nonce = 0;
    let currHash;
    let difficulty;
    // Poof of work system algorithm for consensus
    do {
      nonce += 1;
      difficulty = Block.adjustDifficulty(lastBlock, timeStamp);
      currHash = Block.hash(timeStamp, prevHash, boondhis, nonce, difficulty);
    } while (currHash.substr(0, difficulty) !== '0'.repeat(difficulty));
    return new this(timeStamp, prevHash, currHash, boondhis, nonce, difficulty);
  }

  /*
  * Helper method that returns hash of given block
  * @param block from a chain
  * @return hash of the given block
  */
  static hashOfBlock(block) {
    const { timeStamp, prevHash, boondhis, nonce, difficulty } = block;
    return this.hash(timeStamp, prevHash, boondhis, nonce, difficulty);
  }

  /*
  * Helper method that returns the hash of given details
  * @param timeStamp epoch time of creation of block
  * @param prevHash hash of the previous block in a blockchain
  * @param boondhis the object containing the transactions
  */
  static hash(timeStamp, prevHash, boondhis, nonce, difficulty) {
    return SHA256(`${timeStamp}${prevHash}${boondhis}${nonce}${difficulty}`).toString();
  }

  /*
  * Helper method to dynamically adjust the difficulty
  * @param lastBlock The previous block in the blockchain
  * @param currentTime the creation time of current blockchain
  */
  static adjustDifficulty(lastBlock, currentTime) {
    const prevDifficulty = lastBlock.difficulty;
    const timeBetweenBlockCreation = lastBlock.timeStamp + MINE_RATE;
    if (timeBetweenBlockCreation === currentTime) {
      return prevDifficulty;
    }
    return (timeBetweenBlockCreation > currentTime ? prevDifficulty + 1 : prevDifficulty - 1);
  }
}

module.exports = Block;
