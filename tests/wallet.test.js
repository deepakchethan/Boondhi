const Wallet = require('../src/wallet/index');
const TransactionPool = require('../src/wallet/transaction-pool');
const Blockchain = require('../src/models/chain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet tests', () => {
  let wallet;
  let tp;
  let bc;
  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  }); 

  describe('Creating a transaction', () => {
    let transaction;
    let sendAmount;
    let recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'radlfkjad;aadf';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      it('doubles the sendAmount subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
      });

      it('clones the sendAmount output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });

    describe('calculating a blance', () => {
      let addBalance;
      let repeatAdd;
      let senderWallet;
      beforeEach(() => {
        senderWallet = new Wallet();
        addBalance = 100;
        repeatAdd = 3; 
        for (let i = 0; i < repeatAdd; i += 1) {
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
        }
        bc.addBlock(tp.transactions);
      });

      it('calculate the balance for blockchain transactions matching the recipient', () => {
        expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd) - 50);  // 50 from previous tests
      });

      it('calculates the balance for blockchain transactions matching the sender', () => {
        expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
      });
    });
  });
});