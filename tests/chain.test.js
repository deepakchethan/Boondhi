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

describe('Chain validation tests', () => {
  let blockchain;
  let fakeBlockchain;

  beforeEach(() => {
    blockchain = new Chain();
    fakeBlockchain = new Chain();
  });
  it('should return true for the valid chain', () => {
    blockchain.addBlock('ding ding');
    expect(Chain.isValidChain(blockchain.chain)).toBeTruthy();
  });
  it('should return false for invalid chain', () => {
    fakeBlockchain.chain.push('a', 'b', 'c', 'd');
    expect(Chain.isValidChain(fakeBlockchain.chain)).toBeFalsy();
  });
  it('should return false for chain with wrong genesis', () => {
    fakeBlockchain.chain.pop();
    fakeBlockchain.chain.push('a', 'b', 'c', 'd');
    expect(Chain.isValidChain(fakeBlockchain.chain)).toBeFalsy();
  });
});

describe('Chain splitting solution tests', () => {
  let blockchain;
  let oBlockchain;

  beforeEach(() => {
    blockchain = new Chain();
    oBlockchain = new Chain();
  });
  it('should replace blockchain with longer chain', () => {
    const currentBlockchainLength = blockchain.chain.length;
    oBlockchain.addBlock('fake data');
    oBlockchain.addBlock('fake data');
    blockchain.replaceChainWith(oBlockchain);
    expect(blockchain.chain.length).toBeGreaterThanOrEqual(currentBlockchainLength);
  });
  it('should replace blockchain with longer chain', () => {
    const currentBlockchainLength = oBlockchain.chain.length;
    blockchain.addBlock('fake data');
    blockchain.addBlock('fake data');
    blockchain.replaceChainWith(oBlockchain);
    expect(blockchain.chain.length).toBeGreaterThanOrEqual(currentBlockchainLength);
  });
});
