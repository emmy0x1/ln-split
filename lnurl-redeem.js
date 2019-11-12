const lnurl = require('lnurl');
const fetch = require("node-fetch");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const args = process.argv.slice(2);
const encodedLnUrl = args[0];

console.log('received lnurl: ' + encodedLnUrl);
const decodedUrl = lnurl.decode(encodedLnUrl);
console.log('decoded lnurl: ' + decodedUrl);

async function executeLnUrl() {
  const lnUrlJson = await fetch(decodedUrl)
    .then(async res => {
      return res.json();
    });

  console.log(lnUrlJson);

  if (lnUrlJson.maxWithdrawable === 0) {
    console.log('No funds to withdrawal');
    return;
  }

  console.log('querying lightning node to create invoice for: ' + lnUrlJson.maxWithdrawable);

  const genInvoiceCmd = 'docker-compose exec -T simnet-lnd-btcd-bob lncli --chain bitcoin --network=simnet addinvoice ' + lnUrlJson.maxWithdrawable;

  const { stdout, stderr } = await exec(genInvoiceCmd);
  const invoiceResult = JSON.parse(stdout);
  console.log('invoice:', invoiceResult.pay_req);

  console.log('posting invoice to lnurl');
  const method = 'POST';

  const lnUrlQuery = `?k1=${lnUrlJson.k1}&pr=${invoiceResult.pay_req}`
  const preImageRes =
    await fetch(lnUrlJson.callback + lnUrlQuery, {method})
      .then(async res => {
        return  res.json();
      });

  console.log('payment preimage: ' + preImageRes.preimage);
}

executeLnUrl();
