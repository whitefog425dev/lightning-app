import { observable, useStrict } from 'mobx';
import ComputedTransactions from '../../../src/computed/transactions';

describe('Computed Transactions Unit Tests', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
  });

  describe('ComputedTransactions()', () => {
    it('should work with empty store', () => {
      store = observable({});
      ComputedTransactions(store);
      expect(store.computedTransactions, 'to equal', null);
    });

    it('should aggregate transactions, payments, and invoices', () => {
      store = observable({
        transactionsResponse: [{ date: new Date() }],
        paymentsResponse: [{ date: new Date() }],
        invoicesResponse: [{ date: new Date() }],
      });
      ComputedTransactions(store);
      expect(store.computedTransactions.length, 'to equal', 3);
    });
  });
});
