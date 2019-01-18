import dotenv from 'dotenv';
import { Server } from './app';
import { logger } from './services';
import { LnRpcClientFactory } from './services/lnd';

dotenv.config();

export const app = Server.bootstrap().app;

(async () => {
  const lndClient = await LnRpcClientFactory.getLnRpc();
  const pubkey = (await lndClient.getInfo({})).identityPubkey;
  logger.info(`[LND] Pubkey: ${pubkey}.`);

  const port = process.env.SERVER_PORT;
  app.listen(port);
  logger.info(`[App] Server listening on port: ${port}.`);
})();
