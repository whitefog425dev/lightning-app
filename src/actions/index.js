import { observe } from 'mobx';
import { AsyncStorage } from 'react-native';
import store from '../store';
import ActionsGrpc from './grpc';
import ActionsNav from './nav';
import ActionsWallet from './wallet';
import ActionsLogs from './logs';
import ActionsInfo from './info';
import ActionsNotification from './notification';
import ActionsChannels from './channels';
import ActionsTransactions from './transactions';
import ActionsPayments from './payments';

const ipcRenderer = window.ipcRenderer; // exposed to sandbox via preload.js

//
// Inject dependencies
//

store.init(AsyncStorage);

export const actionsLogs = new ActionsLogs(store, ipcRenderer);
export const actionsNotification = new ActionsNotification(store);
export const actionsGrpc = new ActionsGrpc(store, ipcRenderer);
export const actionsNav = new ActionsNav(store, ipcRenderer);
export const actionsWallet = new ActionsWallet(
  store,
  actionsGrpc,
  actionsNav,
  actionsNotification
);
export const actionsInfo = new ActionsInfo(store, actionsGrpc);
export const actionsChannels = new ActionsChannels(
  store,
  actionsGrpc,
  actionsNotification
);
export const actionsTransactions = new ActionsTransactions(store, actionsGrpc);
export const actionsPayments = new ActionsPayments(
  store,
  actionsGrpc,
  actionsWallet,
  actionsNotification
);

//
// Init actions
//

observe(store, 'loaded', () => {
  // TODO: init wallet unlocker instead of lnd
  actionsGrpc.initLnd();
  // actionsGrpc.initUnlocker();
});

observe(store, 'unlockerReady', async () => {
  // TODO: wire up to UI
  const seedPassphrase = 'hodlgang';
  const walletPassword = 'bitconeeeeeect';
  try {
    await actionsWallet.generateSeed({ seedPassphrase });
    await actionsWallet.initWallet({
      walletPassword,
      seedPassphrase,
      seedMnemonic: store.seedMnemonic,
    });
  } catch (err) {
    await actionsWallet.unlockWallet({ walletPassword });
  }
});

observe(store, 'walletUnlocked', () => {
  actionsGrpc.initLnd();
});

observe(store, 'lndReady', () => {
  // init wallet
  actionsWallet.getBalance();
  actionsWallet.getChannelBalance();
  actionsWallet.getNewAddress();
  // init info
  actionsInfo.getInfo();
  // init channels
  actionsChannels.pollChannels();
  actionsChannels.pollPendingChannels();
  actionsChannels.pollPeers();
  // init transactions
  actionsTransactions.getTransactions();
  actionsTransactions.subscribeTransactions();
  actionsTransactions.getInvoices();
  actionsTransactions.subscribeInvoices();
  actionsTransactions.getPayments();
});
