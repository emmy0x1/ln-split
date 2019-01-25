import createLnRpc, {
  GetInfoResponse,
  Invoice,
  InvoiceSubscription,
  LnRpc,
  WalletBalanceResponse,
} from 'lnrpc';
import { logger, logInvoice } from './logger';

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
 * Create subscribers to LND events with callback support
 * TODO add transaction event subscriber
 * TODO add channelgraph event subscriber
 *
 * @class LnRpcSubscriptionManager
 */
export class LnRpcSubscriptionManager {
  private static _invoiceSubscriber: any;

  public static async subscribeInvoices(
    eventCallback: (invoice: Invoice.AsObject) => void = logInvoice,
  ): Promise<void> {
    const client = await LnRpcClientFactory.getLnRpc();
    if (this._invoiceSubscriber === undefined) {
      this._invoiceSubscriber = await client.subscribeInvoices(<
        InvoiceSubscription.AsObject
      >{});
    }

    this._invoiceSubscriber.on('data', (invoice: Invoice.AsObject) => {
      eventCallback(invoice);
    });
  }
}

/**
 * Returns result of LND GetInfo RPC call
 */
export async function getInfo(): Promise<GetInfoResponse.AsObject> {
  return (await LnRpcClientFactory.getLnRpc()).getInfo({});
}

/**
 * Returns result of LND WalletBalance RPC call
 */
export async function getWalletBalance(): Promise<
  WalletBalanceResponse.AsObject
> {
  return (await LnRpcClientFactory.getLnRpc()).walletBalance({});
}

/**
 * Generate a LN invoice and return the pay req string
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
  invoice.pb_private = true;

  return (await (await LnRpcClientFactory.getLnRpc()).addInvoice(invoice))
    .paymentRequest;
}
