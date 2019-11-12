# LApp

## Quickstart

This project contains three simnet nodes for local testing. By default, the example environment variables in `.env.example` have been populated with values that target our simnet node. You can replace these values in your `.env` file to target your own node.

### You'll need to following dependencies first:

- Node.js
- PostgreSQL
- Yarn

### Setup the simnet environment

```sh
scripts/simnet-setup.sh
```

### Install dependencies and create development database

```
scripts/bootstrap.sh
```

### Run the application

```sh
yarn run dev
```

Visit `localhost:3001` in your browser.

### Withdrawal via LNURL

A quick little script to test out LNURL withdrawal on the local simnet instance. This creates an invoice from `bob` in our sim environment. 

Once you have a balance and an encoded withdrawal url (click on the qrcode in the withdrawal page to copy to clipboard), run the command below: 

```sh
node lnurl-redeem.js {lnurl...}
```

It should automatically try to create an invoice for the maximum amount and then send it to the LNURL callback URL. 
