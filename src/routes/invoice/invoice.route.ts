import { NextFunction, Request, Response } from 'express';
import { logger } from '../../services';
import { generateInvoice } from '../../services/lnd';
import { BaseRoute } from '../route';

/**
 * @api {get} /invoice Invoice Request
 * @apiName Invoice
 * @apiGroup Invoice
 *
 * @apiSuccess {String} bolt11 invoice
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
  }

  /**
   * @class InvoiceRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    const invoice = await generateInvoice();
    res.json(invoice);
    next();
  }
}
