const Block = require('../src/models/block');
const Chain = require('../src/models/chain');

describe('Chain tests', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Chain();
  });
  it('should start with genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });
  it('should add a new block', () => {
    const data = 'dummy data';
    blockchain.addBlock(data);
    expect(blockchain.chain[blockchain.chain.length - 1].boondhis).toEqual(data);
  });
});
