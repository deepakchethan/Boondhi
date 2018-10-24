const Transaction = require('../src/models/transaction');
const Wallet = require('../src/wallet/index');
const { MINING_REWARD } = require('../config');

describe('Transaction Positive Tests', () => {
  let transaction;
  let wallet;
  let reciever;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    reciever = 'r3c1p23nt';
    transaction = Transaction.newTransaction(wallet, reciever, amount);
  });

  it('Outputs the amount subtracted from the wallet balance', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount);
  });

  it('outputs the amount added to the recepient', () => {
    expect(transaction.outputs.find(output => output.address === reciever).amount).toEqual(amount);
  });
});


describe('Transactiom Negative Tests', () => {
  let transaction;
  let wallet;
  let reciever;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50000;
    reciever = 'r3c1p23nt';
    transaction = Transaction.newTransaction(wallet, reciever, amount);
  });

  it('does not create the transaction', () => {
    expect(transaction).toEqual(undefined);
  });
});

describe('Signing mechanism tests', () => {
  let transaction;
  let wallet;
  let reciever;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    reciever = 'r3c1p23nt';
    transaction = Transaction.newTransaction(wallet, reciever, amount);
  });

  it('validates valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBeTruthy();
  });

  it('invalidates a corrupt transaction', () => {
    transaction = Transaction.newTransaction(wallet, reciever, 50000);
    expect(transaction).toEqual(undefined);
  });
});

describe('Updaing transaction test', () => {
  let nextAmount;
  let nextRecipient;
  let transaction;
  let wallet;
  let reciever;
  let amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    reciever = 'r3c1p23nt';
    transaction = Transaction.newTransaction(wallet, reciever, amount);
    nextAmount = 20;
    nextRecipient = 'n3xt-4ddr355';
    
    transaction = transaction.update(wallet, nextRecipient, nextAmount);
  });

  it('substracts the next amount from senders output', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
  });

  describe('creating a reward transaction', () => {

    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
    });

    it('reward the miners wallet', () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
    });
  });
});

