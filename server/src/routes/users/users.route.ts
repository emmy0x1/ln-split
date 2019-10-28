import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { logger } from '../../services';
import { CryptoUtility } from '../../utilities/CryptoUtility';
import { BaseRoute } from '../route';
import { User } from './user';
const db = require('../../../../db/dbConnection');

/**
 * @api {get} /users Users
 * @apiName Users
 * @apiGroup Users
 *
 * @apiSuccess 200
 */
export class UsersRoute extends BaseRoute {
  public static path = '/users';
  private static instance: UsersRoute;

  /**
   * @class UsersRoute
   * @constructor
   */
  private constructor() {
    super();
    this.get = this.get.bind(this);
    this.router.post(
      '/',
      [check('emailAddress').exists(), check('password').exists()],
      this.post,
    );
    this.router.post(
      '/login',
      [check('emailAddress').exists(), check('password').exists()],
      this.login,
    );
    this.init();
  }

  static get router() {
    if (!UsersRoute.instance) {
      UsersRoute.instance = new UsersRoute();
    }
    return UsersRoute.instance.router;
  }

  private init() {
    logger.info('[UsersRoute] Creating users route.');
    this.router.get('/', this.get);
  }

  /**
   * Get all users
   * @class UsersRoute
   * @method get
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info(`[UsersRoute] Retrieving all users.`);

      await db.query(
        'SELECT id, "emailAddress" FROM users',
        [],
        (err: any, result: any) => {
          if (err) next();

          console.log(`retrieved rows: ${result.rows.length}`);
          res.json(result.rows);
          next();
        },
      );
    } catch (err) {
      logger.error(`Caught error: ${err.message}`);
      res.status(400).json({ error: err.message });
      next();
    }
  }

  /**
   * Create new user
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async post(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(`[UsersRoute] / validation error: ${errors.array()}.`);
      res.status(400).json({ error: errors.array() });
      return;
    }

    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    // Check emailAddress is unique
    const emailAddressExists = await checkEmailAddressExisting(emailAddress);
    if (emailAddressExists) {
      res.status(400).json({ error: 'Email already signed up.' });
      next();
      return;
    }

    // Hash password with a salt
    const salt = CryptoUtility.genRandomString(16);
    const passwordHash = CryptoUtility.sha512(password, salt);

    // Save user
    await db.query(
      'INSERT INTO users ("emailAddress", "passwordHash", salt) VALUES ($1, $2, $3) RETURNING id',
      [emailAddress, passwordHash, salt],
      (error: any, results: any) => {
        if (error) {
          throw error;
        }
        res.status(201).json(results.rows[0].id);
      },
    );
  }

  /**
   * User log in
   * @method post
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  private async login(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.info(`[UsersRoute] /login validation error: ${errors.array()}.`);
      res.status(400).json({ error: errors.array() });
      return;
    }

    const emailAddress = req.body.emailAddress;
    const password = req.body.password;

    // Check email address is in the db
    const user = await findUserByEmailAddress(emailAddress);
    logger.info(`user trying to log in ${JSON.stringify(user)}`);

    if (!user) {
      logger.error('user not found..');
      res.status(400).json({ error: 'Incorrect email / password' });
      next();
      return;
    }

    // Check user password with hashed password saved in the db
    const salt = user.salt;
    const passwordHash = CryptoUtility.sha512(password, salt);
    if (user.passwordHash !== passwordHash) {
      logger.error('user password does not match.');
      res.status(400).json({ error: 'Incorrect email / password' });
      next();
      return;
    }

    // todo sanitize, somehow below doesn't work??
    // user.sanitize();
    res.status(200).json(user);
  }
}

export async function checkEmailAddressExisting(emailAddress: string) {
  return new Promise<boolean>(res => {
    db.query(
      'SELECT count(*) FROM users WHERE "emailAddress" = $1',
      [emailAddress],
      (error: any, results: any) => {
        if (error) {
          throw error;
        }
        logger.info(results.rows[0].count);
        if (results.rows[0].count > 0) {
          logger.error(`[UsersRoute] Duplicate email address: ${emailAddress}`);
          res(true);
        }
        res(false);
      },
    );
  });
}

export async function findUserByEmailAddress(
  emailAddress: string,
): Promise<User> {
  return new Promise<User>(res => {
    db.query(
      'SELECT * FROM users WHERE "emailAddress" = $1',
      [emailAddress],
      (error: any, results: any) => {
        if (error) {
          throw error;
        }
        logger.info(JSON.stringify(results.rows[0]));
        if (!results.rows[0]) {
          logger.error(
            `[UsersRoute] Could not find user by email address: ${emailAddress}`,
          );
          res(null);
        }
        res(results.rows[0]);
      },
    );
  });
}
