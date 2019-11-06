# LApp

## Quickstart

This project contains three simnet nodes for local testing. By default, the example environment variables in `.env.example` have been populated with values that target our simnet node. You can replace these values in your `.env` file to target your own node.

### Install Dependencies

```sh
yarn
```

### Setup the simnet environment

For more details on the simnet suite, read the [simnet suite](#simnet-suite) section.

```sh
scripts/simnet-setup.sh
```

### Create your environment file

As noted above, you can copy the values from `.env.example` to `.env` to get up and running against the local simnet node. Update the values in your `.env` file at any time to target your own node.

```sh
cp .env.example .env
```

### Set up database

```
docker-compose up db
```

### Run the application

```sh
yarn run dev
```
