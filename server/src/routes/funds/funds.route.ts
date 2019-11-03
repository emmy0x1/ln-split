import { NextFunction, Request, Response } from 'express';
import { logger } from '../../services';
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
}
