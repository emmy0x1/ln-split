import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { logger } from '../../services';
import { Lightning } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /funds Funds
 * @apiName Funds
 * @apiGroup Funds
 *
 * @apiSuccess 200
 */
export class FundsRoute extends BaseRoute {
  public static path = '/funds';
  private static instance: FundsRoute;

  /**
   * @class FundsRoute
   * @constructor
   */
  private constructor() {
    super();
    this.available = this.available.bind(this);
    this.withdrawal = this.withdrawal.bind(this);
    this.init();
  }

  static get router() {
    if (!FundsRoute.instance) {
      FundsRoute.instance = new FundsRoute();
    }
    return FundsRoute.instance.router;
  }

  private init() {
    logger.info('[FundsRoute] Creating funds route.');
    this.router.get('/available', this.available);
    this.router.post(
      '/withdrawal',
      [
        check('invoice').exists(),
        body('invoice').custom(async encodedPayReq => {
          const { numSatoshis } = await Lightning.client.decodePayReq({
            payReq: encodedPayReq,
          });
          // add custom payment conditions...ie. max invoice amount
          if (new BigNumber(numSatoshis).gt(1000000)) {
            throw new Error(
              `Payment Request amount exceeds 1000000 satoshi (${numSatoshis})`,
            );
          }
        }),
      ],
      this.withdrawal,
    );
  }

  /**
   * Get available funds (in sats) for a certain user
   * @class FundsRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async available(req: Request, res: Response, next: NextFunction) {
    logger.info(
      `[FundsRoute] Retrieving available funds for user ${req.query.userId}.`,
    );

    // todo figure out how much the user has available
    // const userId = req.params.userId;
    res.json({ available: 5000 });
  }

  /**
   * Accept an invoice for payment withdrawal
   * @class FundsRoute
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async withdrawal(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(
        `[FundsRoute] /withdrawal validation error: ${errors.array()}.`,
      );
      res.status(400).json({ error: errors.array() });
      return;
    }

    // TODO validation that invoice amount is less than available for user
    const { numSatoshis } = await Lightning.client.decodePayReq({
      payReq: req.body.invoice,
    });
    console.log(`trying to pay an invoice for amount: ${numSatoshis}`);

    try {
      const {
        paymentPreimage,
        paymentError,
      } = await Lightning.client.sendPaymentSync({
        paymentRequest: req.body.invoice,
      });
      if (paymentError) {
        throw new Error(paymentError);
      }

      const preimage = (paymentPreimage as Buffer).toString('hex');
      logger.info(
        `[FundsRoute] /withdrawal payment complete for preimage: ${preimage}.`,
      );
      res.status(200).json({
        preimage,
      });
    } catch (err) {
      logger.info(`[FundsRoute] /withdrawal error: ${err}.`);
      res.status(400).json({ error: err.message });
    }
  }
}
