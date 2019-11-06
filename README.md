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
