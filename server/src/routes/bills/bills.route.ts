import { NextFunction, Request, Response } from 'express';
import { logger } from '../../services';
import { BaseRoute } from '../route';
const pg = require('pg');

const config = {
  user: 'postgres',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
};

/**
 * @api {get} /bills Bills
 * @apiName Bills
 * @apiGroup Bills
 *
 * @apiSuccess 200
 */
export class BillsRoute extends BaseRoute {
  public static path = '/bills';
  private static instance: BillsRoute;

  /**
   * @class BillsRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.init();
  }

  static get router() {
    if (!BillsRoute.instance) {
      BillsRoute.instance = new BillsRoute();
    }
    return BillsRoute.instance.router;
  }

  private init() {
    logger.info('[BillsRoute] Creating bills route.');
    this.router.get('/', this.get);
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
      logger.info(`[BillsRoute] Retrieving all bills.`);

      const pool = new pg.Pool(config);
      await pool.connect((err: any, client: any, done: any) => {
        if (err) {
          logger.info(`not able to make connection ${err}`);
          next();
        }

        client.query('SELECT * FROM bills', (err: any, result: any) => {
          done();
          if (err) {
            logger.info('not able to make query');
            next();
          }

          console.log(`retrieved rows: ${result.rows.length}`);
          res.json(result.rows);
          next();
        });
      });
    } catch (err) {
      logger.error(`Caught error: ${err.message}`);
      res.status(400).json({ error: err.message });
      next();
    }
  }
}
