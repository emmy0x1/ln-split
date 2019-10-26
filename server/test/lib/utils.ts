import { LnRpcClientConfig } from '@radar/lnrpc';

export const utils = {
  /**
   * Alice LND simnet credentials (us)
   */
  ourNode(): LnRpcClientConfig {
    return {
      server: process.env.LND_URL,
      macaroon: process.env.LND_MACAROON,
      cert: process.env.LND_CERT,
    };
  },

  /**
   * Bob LND simnet credentials
   */
  bobsNode(): LnRpcClientConfig {
    return {
      server: process.env.BOB_LND_URL,
      macaroon: process.env.BOB_LND_MACAROON,
      cert: process.env.BOB_LND_CERT,
    };
  },

  /**
   * Bob LND simnet credentials
   */
  charliesNode(): LnRpcClientConfig {
    return {
      server: process.env.CHARLIE_LND_URL,
      macaroon: process.env.CHARLIE_LND_MACAROON,
      cert: process.env.CHARLIE_LND_CERT,
    };
  },
};
