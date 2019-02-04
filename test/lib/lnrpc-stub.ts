/**
 * LnRpc stub used for testing purposes
 */
export const lnrpcStub = {
  addInvoice: () => {
    return {
      paymentRequest: 'invoice',
    };
  },
  decodePayReq: () => {
    return {
      numSatoshis: 1000,
    };
  },
  sendPaymentSync: () => {
    return {
      paymentPreimage: Buffer.from('deadbeef', 'hex'),
    };
  },
} as unknown;
