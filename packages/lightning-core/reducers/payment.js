import { GRPC } from 'redux-grpc-middleware'

export const SEND_BITCOIN = 'PAYMENT/SEND_BITCOIN'
export const SET_BITCOIN_ADDRESS = 'PAYMENT/SET_BITCOIN_ADDRESS'

export const CHANGE_BITCOIN_FORM = 'PAYMENT/CHANGE_BITCOIN_FORM'
export const CHANGE_LIGHTNING_FORM = 'PAYMENT/CHANGE_LIGHTNING_FORM'
export const CHANGE_LIGHTNING_SEND_URI = 'PAYMENT/CHANGE_LIGHTNING_SEND_URI'

export const SEND_PAYMENT_REQUEST = 'CHANNELS/SEND_PAYMENT_REQUEST'
export const SEND_PAYMENT = 'CHANNELS/SEND_PAYMENT'
export const SEND_PAYMENT_FAILURE = 'CHANNELS/SEND_PAYMENT_FAILURE'

export const CREATE_INVOICE_REQUEST = 'PAYMENT/CREATE_INVOICE_REQUEST'
export const CREATE_INVOICE = 'PAYMENT/CREATE_INVOICE'
export const CREATE_INVOICE_FAILURE = 'PAYMENT/CREATE_INVOICE_FAILURE'

export const CHANGE_GENERATED_PAYMENT_REQUEST = 'PAYMENT/CHANGE_GENERATED_PAYMENT_REQUEST'

const initialState = {
  bitcoinAddress: '',
  generatedPaymentRequest: '',
}

export default function payment(state = initialState, action) {
  switch (action.type) {
    case SET_BITCOIN_ADDRESS:
      return { ...state, bitcoinAddress: action.user.address }
    case CHANGE_GENERATED_PAYMENT_REQUEST:
      return { ...state, generatedPaymentRequest: action.paymentRequest }
    default: return state
  }
}

export const actions = {
  changeGeneratedPaymentRequest: paymentRequest =>
    ({ type: CHANGE_GENERATED_PAYMENT_REQUEST, paymentRequest }),

  newWitnessAddress: () => ({
    [GRPC]: {
      method: 'newWitnessAddress',
      types: [null, SET_BITCOIN_ADDRESS],
      model: 'user',
    },
  }),

  sendCoins: ({ to, amount }) => ({
    [GRPC]: {
      method: 'sendCoins',
      body: {
        addr: to,
        amount,
      },
      types: [null, SEND_BITCOIN],
      model: 'transaction',
    },
  }),

  subscribePayments: () => ({
    [GRPC]: {
      method: 'sendPayment',
      types: [SEND_PAYMENT_REQUEST, SEND_PAYMENT, SEND_PAYMENT_FAILURE],
      stream: true,
    },
  }),

  sendLightning: (remotePubKey, amount, paymentHash) => ({
    [GRPC]: {
      method: 'sendPayment',
      body: {
        amt: amount,
        dest_string: remotePubKey,
        payment_hash: paymentHash,
      },
      types: [SEND_PAYMENT_REQUEST, SEND_PAYMENT, SEND_PAYMENT_FAILURE],
    },
  }),

  requestLightning: (form, pubkey) => ({
    [GRPC]: {
      method: 'addInvoice',
      body: {
        memo: form.note,
        value: form.amount,
      },
      types: [CREATE_INVOICE_REQUEST, CREATE_INVOICE, CREATE_INVOICE_FAILURE],
      model: 'invoice',
      passthrough: { pubkey, amount: form.amount },
    },
  }),

  changeBitcoinForm: data => ({ type: CHANGE_BITCOIN_FORM, data }),
  changeLightningForm: data => ({ type: CHANGE_LIGHTNING_FORM, data }),
  changeSendURI: uri => ({ type: CHANGE_LIGHTNING_SEND_URI, uri }),
}

export const selectors = {
  getBitcoinAddress: state => state.bitcoinAddress,
  getGeneratedPaymentRequest: state => state.generatedPaymentRequest,
}
