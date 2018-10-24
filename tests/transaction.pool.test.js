const TransactionPool = require('../src/wallet/transaction-pool');
const Transaction = require('../src/models/transaction');
const Wallet = require('../src/wallet/index');

describe('Transaction Pool Tests', () => {
  let transactionPool;
  let wallet;
  let transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet(); 
    transaction = wallet.createTransaction('r4and-4dr355', 30, transactionPool)
  });

  it('adds transactions to the pool', () => {
    expect(transactionPool.transactions.find(trans => trans.id === transaction.id)).toEqual(transaction);
  });

  it('updates a tranaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'j00m1a-p@pi', 40);
    transactionPool.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(transactionPool.transactions.find(trans => trans.id === newTransaction.id))).not.toEqual(oldTransaction);
  });

  it('clears the transactions', () => {
    transactionPool.clear();
    expect(transactionPool.transactions).toEqual([]);
  });
  describe('mixing valid and currupt transaction', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions];
      for (let i = 0; i < 6; i += 1) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('akldsaskl', 30, transactionPool);
        if (i % 2 === 0) {
          transaction.input.amount = 2344565;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('shows a difference between valid and corrupt transactions', () => {
      expect(JSON.stringify(transactionPool.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(transactionPool.getValidTransactions()).toEqual(validTransactions);
    });
  });
});

