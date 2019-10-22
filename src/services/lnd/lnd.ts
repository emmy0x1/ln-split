import createLnRpc, { LnRpc, LnRpcClientConfig } from '@radar/lnrpc';

/**
 * Manages the application LND client instance
 *
 * @class Lightning
 */
export class Lightning {
  public static client: LnRpc;

  public static async init(): Promise<void> {
    Lightning.client = await LnRpcClientFactory.createLnRpcClient();
  }
}

/**
 * Creates LN RPC clients
 *
 * @class LnRpcClientFactory
 */
class LnRpcClientFactory {
  public static async createLnRpcClient(): Promise<LnRpc> {
    const config: LnRpcClientConfig = {
      server: process.env.LND_URL,
    };

    if (process.env.LND_MACAROON_PATH) {
      config.macaroonPath = process.env.LND_MACAROON_PATH;
    }

    if (process.env.LND_CERT_PATH) {
      config.tls = process.env.LND_CERT_PATH;
    }

    if (process.env.LND_MACAROON) {
      config.macaroon = process.env.LND_MACAROON;
    }

    if (process.env.LND_CERT) {
      config.cert = process.env.LND_CERT;
    }

    return createLnRpc(config);
  }
}
