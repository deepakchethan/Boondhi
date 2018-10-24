const Transaction = require('../src/models/transaction');
const Wallet = require('../src/wallet/index');

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
