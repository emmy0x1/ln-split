import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator/check';
import { logger } from '../../services';
import { decodePayReq, generateInvoice, sendPayment } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /invoice Invoice Request
 * @api {post} /invoice/pay Pay Invoice Request
 * @apiName Invoice
 * @apiGroup Invoice
 *
 * @apiSuccess 200
 */
export class InvoiceRoute extends BaseRoute {
  public static path = '/invoice';
  private static instance: InvoiceRoute;

  /**
   * @class InvoiceRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.pay = this.pay.bind(this);
    this.init();
  }

  static get router() {
    if (!InvoiceRoute.instance) {
      InvoiceRoute.instance = new InvoiceRoute();
    }
    return InvoiceRoute.instance.router;
  }

  private init() {
    logger.info('[InvoiceRoute] Creating invoice route.');
    this.router.get('/', this.get);
    this.router.post(
      '/pay',
      [
        check('invoice').exists(),
        body('invoice').custom(async invoice => {
          const payReq = await decodePayReq(invoice);
          // add custom payment conditions...ie. max invoice amount
          if (new BigNumber(payReq.numSatoshis).gt(10000)) {
            throw new Error(
              `Payment Request amount exceeds 10000 satoshi (${
                payReq.numSatoshis
              })`,
            );
          }
        }),
      ],
      this.pay,
    );
  }

  /**
   * Get a newly generated invoice
   * @class InvoiceRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await generateInvoice();
      res.json(invoice);
    } catch (err) {
      res.status(400).json({ error: err });
    }
    next();
  }

  /**
   * Accept an invoice for payment
   * @class InvoiceRoute
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async pay(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }

    const sendPaymentResponse = await sendPayment(req.body.invoice);
    if (sendPaymentResponse.paymentError) {
      res.status(400).json({ error: sendPaymentResponse.paymentError });
      return;
    }

    res.status(200).json({
      preimage: (sendPaymentResponse.paymentPreimage as Buffer).toString('hex'),
    });
  }
}
