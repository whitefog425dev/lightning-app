import React from 'react';
import { Clipboard } from 'react-native';
import { storiesOf } from '@storybook/react';
import sinon from 'sinon';
import { Store } from '../src/store';
import NavAction from '../src/action/nav';
import GrpcAction from '../src/action/grpc';
import NotificationAction from '../src/action/notification';
import WalletAction from '../src/action/wallet';
import InvoiceAction from '../src/action/invoice';
import PaymentAction from '../src/action/payment';
import Welcome from '../src/view/welcome';
import Transaction from '../src/view/transaction';
import Channel from '../src/view/channel';
import Home from '../src/view/home';
import Deposit from '../src/view/deposit';
import Invoice from '../src/view/invoice';
import InvoiceQR from '../src/view/invoice-qr';
import Payment from '../src/view/payment';
import PayLightningConfirm from '../src/view/pay-lightning-confirm';
import PayLightningDone from '../src/view/pay-lightning-done';
import PayBitcoin from '../src/view/pay-bitcoin';
import PayBitcoinConfirm from '../src/view/pay-bitcoin-confirm';
import PayBitcoinDone from '../src/view/pay-bitcoin-done';

const store = new Store();
const nav = sinon.createStubInstance(NavAction);
const grpc = sinon.createStubInstance(GrpcAction);
const notify = sinon.createStubInstance(NotificationAction);
const wallet = new WalletAction(store, grpc, notify);
const invoice = new InvoiceAction(store, grpc, nav, notify, Clipboard);
sinon.stub(invoice, 'generateUri');
const payment = new PaymentAction(store, grpc, wallet, nav, notify);
sinon.stub(payment, 'checkType');
sinon.stub(payment, 'payBitcoin');
sinon.stub(payment, 'payLightning');

storiesOf('Screens', module)
  .add('Welcome', () => <Welcome />)
  .add('Home', () => (
    <Home
      store={store}
      wallet={wallet}
      payment={payment}
      invoice={invoice}
      nav={nav}
    />
  ))
  .add('Transactions', () => <Transaction store={store} nav={nav} />)
  .add('Channels', () => <Channel store={store} nav={nav} />)
  .add('Deposit', () => <Deposit store={store} invoice={invoice} nav={nav} />)
  .add('Payment', () => <Payment store={store} payment={payment} nav={nav} />)
  .add('Pay Lightning Confirm', () => (
    <PayLightningConfirm store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Lightning Done', () => (
    <PayLightningDone store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin', () => (
    <PayBitcoin store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Confirm', () => (
    <PayBitcoinConfirm store={store} payment={payment} nav={nav} />
  ))
  .add('Pay Bitcoin Done', () => <PayBitcoinDone payment={payment} nav={nav} />)
  .add('Invoice', () => <Invoice store={store} invoice={invoice} nav={nav} />)
  .add('Invoice QR', () => (
    <InvoiceQR store={store} invoice={invoice} nav={nav} />
  ));

// set some dummy data
store.walletAddress = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
store.balanceSatoshis = 798765432;
store.channelBalanceSatoshis = 59876000;
store.settings.exchangeRate.usd = 0.00014503;
store.payment.amount = '0.45678';
store.payment.address = 'ra2XT898gWTp9q2DwMgtwMJsUEh3oMeS4K';
store.payment.fee = '0.0001';
store.invoice.amount = '0.45678';
store.invoice.note = 'For the love of bitcoin';
store.invoice.encoded =
  'lnbc4567800n1pdvqx48pp5eng6uyqnkdlx93m2598ug93qtuls8gapygxznshzd56h7n5cxs0sdp9gehhygr5dpjjqmr0wejjqmmxyp3xjarrda5kucqzysmhyrleqpt3yqf5nctzsr3hvrv9vhhnawazkwyzu8t4mf85tllsyjsf8hgu5nt6dj3jaljjgmt999xnlsweqvatypzlu34nhpjlxf59qp4dn2pv';
store.invoice.uri = `lightning:${store.invoice.encoded}`;
store.transactions = [...Array(5)].map((x, i) => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'bitcoin',
  amount: 923456,
  fee: 8250,
  status: i % 2 === 0 ? 'unconfirmed' : 'confirmed',
  date: new Date(),
}));
store.invoices = [...Array(1)].map(x => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'lightning',
  amount: 81345,
  status: 'in-progress',
  date: new Date(),
}));
store.payments = [...Array(10)].map(x => ({
  id: '610da3203c36b17783477cbe5db092220ac7d58477cbe5db092',
  type: 'lightning',
  amount: 92345,
  fee: 1,
  status: 'complete',
  date: new Date(),
}));
store.channels = [...Array(4)].map(x => ({
  remotePubkey:
    '0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38',
  id: '1337006139441152',
  capacity: 2005000,
  localBalance: 1990000,
  remoteBalance: 10000,
  channelPoint:
    '3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275',
  active: true,
  status: 'open',
}));
store.pendingChannels = [...Array(6)].map((x, i) => ({
  remotePubkey:
    '0343bc80b914aebf8e50eb0b8e445fc79b9e6e8e5e018fa8c5f85c7d429c117b38',
  id: '1337006139441152',
  capacity: 1005000,
  localBalance: 600000,
  remoteBalance: 400000,
  channelPoint:
    '3511ae8a52c97d957eaf65f828504e68d0991f0276adff94c6ba91c7f6cd4275',
  status: i % 2 === 0 ? 'pending-closing' : 'pending-open',
}));
