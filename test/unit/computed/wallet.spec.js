import { Store } from '../../../src/store';
import ComputedWallet from '../../../src/computed/wallet';

describe('Computed Wallet Unit Tests', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('ComputedWallet()', () => {
    it('should work with initial store', () => {
      ComputedWallet(store);
      expect(store.balanceUnit, 'to equal', '0');
      expect(store.channelBalanceUnit, 'to equal', '0');
      expect(store.balanceFiat, 'to match', /0[,.]0{2}/);
      expect(store.channelBalanceFiat, 'to match', /0[,.]0{2}/);
      expect(store.unitLabel, 'to equal', 'bits');
      expect(store.channelBalanceLabel, 'to equal', '0');
    });

    it('should display channel balance in usd', () => {
      store.settings.displayFiat = true;
      store.settings.exchangeRate.usd = 0.00014503;
      store.balanceSatoshis = 100000000;
      store.channelBalanceSatoshis = 10000;
      ComputedWallet(store);
      expect(store.balanceUnit, 'to match', /^1[,.]0{3}[,.]0{3}$/);
      expect(store.channelBalanceUnit, 'to equal', '100');
      expect(store.balanceFiat, 'to match', /6[,.]895[,.]13/);
      expect(store.channelBalanceFiat, 'to match', /0[,.]69/);
      expect(store.unitLabel, 'to equal', null);
      expect(store.channelBalanceLabel, 'to match', /0[,.]69/);
    });

    it('should display channel balance in sat', () => {
      store.settings.exchangeRate.usd = 0.00014503;
      store.balanceSatoshis = 100000000;
      store.channelBalanceSatoshis = 10000;
      store.settings.unit = 'sat';
      ComputedWallet(store);
      expect(store.balanceUnit, 'to match', /^1{1}0{2}[,.]0{3}[,.]0{3}$/);
      expect(store.channelBalanceUnit, 'to match', /^1{1}0{1}[,.]0{3}$/);
      expect(store.balanceFiat, 'to match', /6[,.]895[,.]13/);
      expect(store.channelBalanceFiat, 'to match', /0[,.]69/);
      expect(store.unitLabel, 'to equal', 'SAT');
      expect(store.channelBalanceLabel, 'to match', /^1{1}0{1}[,.]0{3}$/);
    });
  });
});
