import * as bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { ApiRoutes } from './routes';
import { logger } from './services';

/**
 * @class Server
 */
export class Server {
  /**
   * Bootstrap the server instance
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  public app: express.Application;

  /**
   * @class Server
   * @constructor
   */
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  /**
   * Configure server
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(
      morgan('tiny', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      } as morgan.Options),
    );

    // configure body parser
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    );

    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());

    // catch 404 and forward to error handler
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        err.status = 404;
        next(err);
      },
    );
    this.app.use(errorHandler());
    this.app.disable('etag');
  }

  /**
   * Assign server Router
   *
   * @class Server
   * @method routes
   * @return void
   */
  private routes() {
    this.app.use(ApiRoutes.path, ApiRoutes.router);
  }
}
