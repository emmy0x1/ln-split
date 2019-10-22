import createLnRpc, { LnRpc } from '@radar/lnrpc';
import { Lightning } from '../../../src/services/lnd';
import { delay, expect, rest, utils } from '../../lib';

describe('invoice route', () => {
  const client = rest.client();
  const ABI_BASE = '/api/invoice';

  let bob: LnRpc;
  before(() => {
    return new Promise(async resolve => {
      // Initialize our client
      await Lightning.init();

      // Initialize bob for testing
      bob = await createLnRpc(utils.bobsNode());
      resolve();
    });
  });

  it('should GET invoice', async () => {
    const { status, body } = await client.get(ABI_BASE);
    expect(status).to.equal(200);
    expect(body.invoice).to.not.be.undefined;
  });

  it('should POST invoice/pay to pay route and return preimage', async () => {
    const { paymentRequest } = await bob.addInvoice({
      value: '1000',
    });
    const { status, body } = await client.post(`${ABI_BASE}/pay`).send({
      invoice: paymentRequest,
    });
    expect(status).to.equal(200);
    expect(body.preimage.length).to.equal(64);
  });

  it('should return error on POST invoice/pay with >10000 sats', async () => {
    const { paymentRequest } = await bob.addInvoice({
      value: '10001',
    });
    const { status, body } = await client.post(`${ABI_BASE}/pay`).send({
      invoice: paymentRequest,
    });
    expect(status).to.equal(400);
    expect(body.error[0].msg).to.match(
      /^Payment Request amount exceeds 10000 satoshi.*$/,
    );
  });

  it('should return paymentError on POST invoice/pay if LND SendPayment fails', async () => {
    const expectedPaymentError = 'invoice expired';
    const { paymentRequest } = await bob.addInvoice({
      value: '1000',
      expiry: '1',
    });
    await delay(1100);
    const { status, body } = await client.post(`${ABI_BASE}/pay`).send({
      invoice: paymentRequest,
    });
    expect(status).to.equal(400);
    expect(body.error).to.contain(expectedPaymentError);
  });
});
