const Block = require('../src/models/block');
const { DIFFICULTY } = require('../config');

describe('Block Tests', () => {
  beforeEach(() => {});

  it('should create a block with given args', () => {
    const block = new Block('foo', 'bar', 'zoo', 'baz');
    expect(block.timeStamp).toBe('foo');
    expect(block.prevHash).toBe('bar');
    expect(block.currHash).toBe('zoo');
    expect(block.boondhis).toBe('baz');
  });
  it('should have genesis block values equal to default', () => {
    const block = Block.genesis();
    expect(block.timeStamp).toBe('0000');
    expect(block.prevHash).toBe('0000');
    expect(block.currHash).toBe(Block.hash('0000', '0000', {}));
    expect(block.boondhis).toEqual({});
  });
  it('should have created a first block with values provided', () => {
    const block = Block.mineBlock(Block.genesis(), {});
    expect(block.prevHash).toBe(Block.genesis().currHash);
    expect(block.currHash).toBe(Block.hash(block.timeStamp, block.prevHash, block.boondhis, block.nonce));
    expect(block.boondhis).toEqual({});
  });
});

describe('Proof Of Work Model', () => {
  let data;
  let prevBlock;
  let block;
  beforeEach(() => {
    data = 'bar';
    prevBlock = Block.genesis();
    block = Block.mineBlock(prevBlock, data);
  });

  it('generates a hash that matches the difficulty', () => {
    expect(block.currHash.substring(0, DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
  });
});
