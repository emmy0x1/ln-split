export class LnUrlManager {
  public static server: any;

  public static async init(): Promise<void> {
    LnUrlManager.server = await LnUrlFactory.startLnUrlServer();
  }

  public static async generateRedeemUrl(amount: number): Promise<any> {
    const { encoded, secret, url } = await LnUrlManager.server.generateNewUrl(
      'withdrawRequest',
      {
        minWithdrawable: 1,
        maxWithdrawable: amount,
        defaultDescription: 'Redeem',
      },
    );

    console.log({ encoded, secret, url });
    return { encoded, secret, url };
  }
}

class LnUrlFactory {
  public static async startLnUrlServer(): Promise<any> {
    const lnurl = require('lnurl');
    const fs = require('fs');
    const macaroonLocation = '/tmp/macaroon';
    const certLocation = '/tmp/cert';

    // save lnd cert & macaroon to file storage for lnurl
    fs.writeFile(macaroonLocation, process.env.LND_MACAROON, (err: Error) => {
      if (err) {
        return console.log(err);
      }

      console.log('Saved macaroon to temp storage');
    });

    fs.writeFile(certLocation, process.env.LND_CERT, (err: Error) => {
      if (err) {
        return console.log(err);
      }

      console.log('Saved cert to temp storage');
    });

    return lnurl.createServer({
      host: 'localhost',
      port: 3002,
      url: `${process.env.API_PATH}/funds`,
      lightning: {
        backend: 'lnd',
        config: {
          hostname: process.env.LND_HTTP,
          cert: certLocation,
          macaroon: macaroonLocation,
        },
      },
    });
  }
}
