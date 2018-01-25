const { ipcRenderer } = window.require('electron');

class ActionsNav {
  constructor(store) {
    this._store = store;
    ipcRenderer.on('open-url', (event, arg) => {
      // TODO: Go to route
      console.log('open-url', arg);
    });
  }

  goPay() {
    this._store.route = 'Pay';
  }
  goRequest() {
    this._store.route = 'Request';
  }
  goChannels() {
    this._store.route = 'Channels';
  }
  goTransactions() {
    this._store.route = 'Transactions';
  }
  goSettings() {
    this._store.route = 'Settings';
  }
  goCreateChannel() {
    this._store.route = 'CreateChannel';
  }
  goInitializeWallet() {
    this._store.route = 'InitializeWallet';
  }
  goVerifyWallet() {
    this._store.route = 'VerifyWallet';
  }
}

export default ActionsNav;
