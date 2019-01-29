import dotenv from 'dotenv';
import { Server } from './app';
import { isTestEnv } from './env';
import { logger } from './services';
import {
  getInfo,
  getWalletBalance,
  LnRpcSubscriptionManager,
} from './services/lnd';

dotenv.config();

export const app = Server.bootstrap().app;

if (!isTestEnv()) {
  (async () => {
    logger.info(`[LND] Pubkey: ${(await getInfo()).identityPubkey}.`);
    logger.info(
      `[LND] Confirmed Wallet Balance (sats): ${
        (await getWalletBalance()).confirmedBalance
      }.`,
    );
    await LnRpcSubscriptionManager.subscribeInvoices();

    const port = process.env.SERVER_PORT;
    app.listen(port);
    logger.info(`[App] Server listening on port: ${port}.`);
  })();
}
