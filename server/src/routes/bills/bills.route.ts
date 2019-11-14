import BigNumber from 'bignumber.js';
import { NextFunction, Request, Response } from 'express';
import { body, check, query } from 'express-validator';
import { logger } from '../../services';
import { Lightning } from '../../services/lnd';
import { BaseRoute } from '../route';
const db = require('../../../../db/dbConnection');

// prettier-ignore
/**
 * @api {get} /bills Bills
 * @apiName Bills
 * @apiGroup Bills
 *
 * @apiSuccess 200
 */
export class BillsRoute extends BaseRoute {
  public static path = "/bills";
  private static instance: BillsRoute;

  /**
   * @class BillsRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.createBill = this.createBill.bind(this);
    this.getId = this.getId.bind(this);
    this.init();
  }

  static get router() {
    if (!BillsRoute.instance) {
      BillsRoute.instance = new BillsRoute();
    }
    return BillsRoute.instance.router;
  }

  private init() {
    logger.info("[BillsRoute] Creating bills route.");
    this.router.get("/", [check("userId").exists()], this.get);
    this.router.get("/:id", this.getId);
    this.router.post("/create", this.createBill);
  }

  /**
   * Get all bills
   * @class BillsRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(
        `[BillsRoute] Retrieving all bills from userId: ${req.query.userId}.`
      );

      const bills = await this.getUserBills(req.query.userId);
      res.json(bills);
      next();
    } catch (err) {
      logger.error(`Caught error: ${err.message}`);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  /**
   * Get bill by Id
   * @class BillsRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async getId(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(`[BillsRoute] Retrieving bill by id: ${req.params.id}.`);

      const bill = await this.getBill(req.params.id);
      res.json(bill);
      next();
    } catch (err) {
      logger.error(`Caught error: ${err.message}`);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  /**
   * Create bill
   * @class BillsRoute
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */

  private async createBill(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(`[BillsRoute] Creating a new bill.`);
      const description = req.body.description || null;
      const totalAmount = Number(req.body.totalAmount);
      // Limiting to USD for now.
      const currency = 'USD';
      // TODO: Pass in user.
      const createdBy = req.body.userId || 1;
      const userAmounts = JSON.stringify(req.body.userAmounts);

      const query = {
        text: 'INSERT INTO bills(name, description, amount, currency, "createdBy", user_amounts) VALUES($1, $2, $3, $4, $5, $6)',
        values:  ['test', description, totalAmount, currency, createdBy, userAmounts],
      }

      await db.query(
        query.text, query.values,
        (err: any, result: any) => {
          if (err) {
            logger.info("not able to make query");
            next();
          }
          console.log(`retrieved rows: ${result.rows.length}`);
          res.json(result.rows);
          next();
        }
      );
    } catch (err) {
      logger.error(`Caught error: ${err.message}`);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  private async getUserBills(userId: number) {
    return new Promise<number>(res => {
      db.query(
        'SELECT * FROM bills WHERE "createdBy" = $1',
        [userId],
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
          res(results.rows);
        }
      );
    });
  }

  private async getBill(billId: number) {
    return new Promise<number>(res => {
      db.query(
        'SELECT * FROM bills WHERE "id" = $1',
        [billId],
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
          res(results.rows[0]);
        }
      );
    });
  }
}
