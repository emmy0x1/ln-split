# ln-api-boilerplate
a boilerplate project for creating lightning-enabled backend applications

## Quickstart
```sh
$ yarn
$ cp .env.example .env
# set vars for accessing LND ie. LND_MACAROON_PATH
$ yarn start
```

## Compile and run
```sh
$ yarn build
$ node build/index
```

Check the server is running:
```sh
$ curl -GET localhost:3000/api
# {"ok":true}
```

Ping the server:
```sh
$ curl -GET localhost:3000/api/ping
# "pong"
```

Generate a lightning network invoice:
```sh
$ curl -GET localhost:3000/api/invoice
# "lntb10..."
```
