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

  static genesis() {
    return new this('0000', '0000', Block.hash('0000', '0000', {}), {});
  }

  static mineBlock(lastBlock, data) {
    const timeStamp = Date.now();
    const prevHash = lastBlock.currHash;
    const currHash = Block.hash(timeStamp, prevHash, data);

    return new this(timeStamp, prevHash, currHash, data);
  }

  static hash(timeStamp, prevHash, data) {
    return SHA256(`${timeStamp}${prevHash}${data}`).toString();
  }
}

module.exports = Block;
