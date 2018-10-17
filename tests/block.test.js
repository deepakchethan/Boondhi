const Block = require('../src/models/block');


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
  expect(block.currHash).toBe('dpak-ctan');
  expect(block.boondhis).toEqual({});
});

it('should have create a first block with values provided', () => {
  const block = Block.mineBlock(Block.genesis(), {});
  expect(block.prevHash).toBe(Block.genesis().currHash);
  expect(block.currHash).toBe('todo-hash');
  expect(block.boondhis).toEqual({});
});





