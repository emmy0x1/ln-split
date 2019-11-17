import { NextFunction, Request, Response } from 'express';
import { logger } from '../../services';
import { BaseRoute } from '../route';
const btcValue = require('btc-value');
const db = require('../../../../db/dbConnection');

/**
 * @api {get} /rate Rate Request
 * @apiName Rate
 * @apiGroup Rate
 *
 * @apiSuccess 200
 */
export class RateRoute extends BaseRoute {
  public static path = '/rate';
  private static instance: RateRoute;

  /**
   * @class RateRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.init();
  }

  static get router() {
    if (!RateRoute.instance) {
      RateRoute.instance = new RateRoute();
    }
    return RateRoute.instance.router;
  }

  private init() {
    logger.info('[RateRoute] Creating rate route.');
    this.router.get('/', this.get);
  }

  /**
   * Get current bitcoin rate
   * @class RateRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      // try to get rate from API
      btcValue({ isDecimal: true })
        .then(value => {
          console.log(`$${value}`);

          if (value === null || value === 0) {
            throw Error('Could  not get rate from API');
          }

          // update our db for current rate
          db.query(
            'INSERT INTO rate(rate) VALUES($1)',
            [value],
            (err: any, result: any) => {
              if (err) {
                logger.info('not able to make query');
              }
            },
          );

          res.status(200).json({ rate: value });
          next();
        })
        .catch(err => {
          console.warn('Could not get rate from API.. fallback');
          db.query(
            'SELECT * FROM rate ORDER BY date desc limit 1',
            [],
            (error: any, results: any) => {
              if (error) {
                throw error;
              }
              res.status(200).json(results.rows[0]);
              next();
            },
          );
        });
    } catch (err) {
      console.warn('Could not get rate from API.. fallback');
      db.query(
        'SELECT * FROM rate ORDER BY date desc limit 1',
        (error: any, results: any) => {
          if (error) {
            throw error;
          }
          res.status(200).json(results.rows[0]);
          next();
        },
      );
    }
  }
}
