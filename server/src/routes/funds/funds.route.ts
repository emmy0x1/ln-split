import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import { body, check, param, query, validationResult } from 'express-validator';
import { logger } from '../../services';
import { Lightning } from '../../services/lnd';
import { LnUrlManager } from '../../services/lnurl';
import { BaseRoute } from '../route';
const db = require('../../../../db/dbConnection');

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
    this.generateLnUrl = this.generateLnUrl.bind(this);
    this.getLnUrl = this.getLnUrl.bind(this);
    this.withdrawal = this.withdrawal.bind(this);
    this.lnUrlWithdrawal = this.lnUrlWithdrawal.bind(this);
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
    this.router.get('/generateLnUrl', this.generateLnUrl);
    this.router.get('/lnurl', this.getLnUrl);
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
    this.router.post(
      '/lnurl',
      [
        check('k1').exists(),
        check('pr').exists(),
        query('pr').custom(async encodedPayReq => {
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
      this.lnUrlWithdrawal,
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

    const userId = req.query.userId;
    const availableFunds = await this.getAvailableFunds(userId);
    res.json({ available: availableFunds });
  }

  /**
   * Gets a generated LnUrl withdrawal request
   * @class FundsRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async getLnUrl(req: Request, res: Response, next: NextFunction) {
    logger.info(
      `[FundsRoute] Retrieving LNURL for secret ${req.query.secret}.`,
    );

    const secret = req.query.q;
    const userId = await this.getUserByLnUrlSecret(secret);
    const availableFunds = await this.getAvailableFunds(userId);

    const lnUrlResponse = {
      callback: `${process.env.API_PATH}${FundsRoute.path}/lnurl`,
      k1: secret,
      minWithdrawable: 1,
      maxWithdrawable: availableFunds,
      defaultDescription: 'Withdrawal',
    };
    res.json(lnUrlResponse);
  }

  /**
   * Generate LNURL withdrawal for a certain user
   * @class FundsRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async generateLnUrl(req: Request, res: Response, next: NextFunction) {
    logger.info(`[FundsRoute] Generating LNURL for user ${req.query.userId}.`);

    const userId = req.query.userId;
    const availableFunds = await this.getAvailableFunds(userId);

    if (availableFunds === 0) {
      res.status(400);
      next();
      return;
    }

    const { encoded, secret, url } = await LnUrlManager.generateRedeemUrl(
      availableFunds,
    );

    // save secret/user reference
    await db.query(
      'INSERT INTO lnurl (secret, "userId") VALUES ($1, $2) RETURNING id',
      [secret, userId],
      (err: any, result: any) => {
        if (err) {
          logger.info('not able to make query');
          next();
        }

        console.log(`retrieved rows: ${result.rows.length}`);
      },
    );

    res.json({ lnUrl: encoded });
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
    const invoice = req.body.invoice;
    const userId = req.body.userId;

    // checking invoice amount against user's available balance
    if (!(await this.userHasInvoiceAmount(userId, invoice))) {
      res.status(400).json({ error: 'Invoice amount too high.' });
      return;
    }

    try {
      const preimage = await this.payUserInvoice(userId, invoice);
      res.status(200).json({ preimage });
    } catch (err) {
      logger.info(`[FundsRoute] /withdrawal error: ${err}.`);
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Accept an invoice for payment via LNURL
   * @class FundsRoute
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async lnUrlWithdrawal(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(`[FundsRoute] /lnurl validation error: ${errors.array()}.`);
      res.status(400).json({ error: errors.array() });
      return;
    }
    const invoice = req.query.pr;
    const secret = req.query.k1;

    // look up user via lnurl secret
    const userId = await this.getUserByLnUrlSecret(secret);

    // checking invoice amount against user's available balance
    if (!(await this.userHasInvoiceAmount(userId, invoice))) {
      res.status(400).json({ error: 'Invoice amount too high.' });
      return;
    }

    try {
      const preimage = await this.payUserInvoice(userId, invoice);
      res.status(200).json({ preimage });
    } catch (err) {
      logger.info(`[FundsRoute] /lnurl error: ${err}.`);
      res.status(400).json({ error: err.message });
    }
  }

  private async getAvailableFunds(userId: number) {
    return new Promise<number>(res => {
      db.query(
        'SELECT sum(amount) FROM funds WHERE "userId" = $1',
        [userId],
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
          res(results.rows[0].sum || 0);
        },
      );
    });
  }

  private async getUserByLnUrlSecret(secret: string) {
    return new Promise<number>(res => {
      db.query(
        'SELECT * FROM lnurl WHERE "secret" = $1',
        [secret],
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
          res(results.rows[0].userId || null);
        },
      );
    });
  }

  private async subtrackAmountFromUserBalance(userId: number, amount: number) {
    return new Promise<void>(res => {
      db.query(
        'INSERT INTO funds ("userId", amount) VALUES ($1, $2)',
        [userId, 0 - amount],
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
        },
      );
      res(null);
    });
  }

  private async payUserInvoice(userId: number, invoice: string) {
    return new Promise<string>(async res => {
      logger.info(`Attempting to pay invoice: ${invoice}.`);

      const { numSatoshis } = await Lightning.client.decodePayReq({
        payReq: invoice,
      });

      const {
        paymentPreimage,
        paymentError,
      } = await Lightning.client.sendPaymentSync({
        paymentRequest: invoice,
      });
      if (paymentError) {
        throw new Error(paymentError);
      }

      // subtract paid amount from user
      await this.subtrackAmountFromUserBalance(userId, Number(numSatoshis));

      const preimage = (paymentPreimage as Buffer).toString('hex');
      logger.info(`payment complete for preimage: ${preimage}.`);
      res(preimage);
    });
  }

  private async userHasInvoiceAmount(userId: number, invoice: string) {
    return new Promise<Boolean>(async res => {
      const { numSatoshis } = await Lightning.client.decodePayReq({
        payReq: invoice,
      });
      console.log(`trying to pay an invoice for amount: ${numSatoshis}`);

      const totalAvailable = await this.getAvailableFunds(userId);
      if (Number(numSatoshis) > totalAvailable) {
        res(false);
      } else {
        res(true);
      }
    });
  }
}
