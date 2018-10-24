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
    transaction = Transaction.newTransaction(wallet, 'j1ng4-1a1a', 30);
    transactionPool.updateOrAddTransaction(transaction);
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
});

