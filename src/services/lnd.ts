import createLnRpc, { Invoice, LnRpc } from 'lnrpc';

/**
 * Creates and manages LN RPC clients
 *
 * @class LnRpcClientFactory
 */
export class LnRpcClientFactory {
  private static _lnRpcClient: LnRpc;

  public static async getLnRpc(): Promise<LnRpc> {
    if (this._lnRpcClient === undefined) {
      this._lnRpcClient = await createLnRpc({
        server: process.env.LND_URL,
        macaroonPath: process.env.LND_MACAROON_PATH,
      });
    }
    return this._lnRpcClient;
  }
}

/**
 * Generate a LN invoice and return the bolt11 representation
 *
 * @param memo optional description to attach to invoice
 * @param valueSatoshis invoice amount in satoshis
 * @param expirySeconds invoice expiration in seconds from now
 */
export async function generateInvoice(
  memo = '',
  valueSatoshis = 1000,
  expirySeconds = 3600,
): Promise<string> {
  const invoice = <Invoice.AsObject>{};
  invoice.memo = memo;
  invoice.value = valueSatoshis;
  invoice.expiry = expirySeconds;

  const lndClient = await LnRpcClientFactory.getLnRpc();
  return (await lndClient.addInvoice(invoice)).paymentRequest;
}
