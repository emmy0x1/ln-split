import supertest from 'supertest';
import { app } from '../../../src/index';
import * as lnd from '../../../src/services/lnd';

jest.mock('../../../src/services/lnd', () => ({
  generateInvoice: jest
    .fn()
    .mockImplementation(() => Promise.resolve('newinvoice')),
  decodePayReq: jest.fn().mockImplementation(() =>
    Promise.resolve({
      numSatoshis: '10000',
    }),
  ),
  sendPayment: jest.fn().mockImplementation(() =>
    Promise.resolve({
      paymentPreimage: 'preimage',
    }),
  ),
}));

describe('invoice route', () => {
  it('should GET invoice', done => {
    supertest(app)
      .get('/api/invoice')
      .end((err: any, res: supertest.Response) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toBe('newinvoice');
          done();
        }
      });
  });

  it('should POST invoice/pay to pay route and return preimage', done => {
    supertest(app)
      .post('/api/invoice/pay')
      .send({
        invoice: 'invoice',
      })
      .end((err: any, res: supertest.Response) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body.preimage).toBe('preimage');
          done();
        }
      });
  });

  it('should return error on POST invoice/pay with >10000 sats', done => {
    (lnd.decodePayReq as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ numSatoshis: '10001' }),
    );
    supertest(app)
      .post('/api/invoice/pay')
      .send({
        invoice: 'invoice',
      })
      .end((err: any, res: supertest.Response) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(400);
          expect(res.body.error[0].msg).toMatch(
            /^Payment Request amount exceeds 10000 satoshi.*$/,
          );
          done();
        }
      });
  });

  it('should return paymentError on POST invoice/pay if LND SendPayment fails', done => {
    const expectedPaymentError = 'invoice expired';
    (lnd.sendPayment as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ paymentError: expectedPaymentError }),
    );
    supertest(app)
      .post('/api/invoice/pay')
      .send({
        invoice: 'invoice',
      })
      .end((err: any, res: supertest.Response) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(400);
          expect(res.body.error).toMatch(expectedPaymentError);
          done();
        }
      });
  });
});
