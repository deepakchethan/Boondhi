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
    return new this('0000', '0000', 'dpak-ctan', {});
  }

  static mineBlock(lastBlock, data) {
    const timeStamp = Date.now();
    const prevHash = lastBlock.currHash;
    const currHash = 'todo-hash';

    return new this(timeStamp, prevHash, currHash, data);
  }
}

module.exports = Block;
