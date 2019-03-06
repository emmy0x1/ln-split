# ln-api-boilerplate

A boilerplate example project for creating lightning-enabled applications

[![CircleCI](https://img.shields.io/circleci/project/github/RadarTech/ln-api-boilerplate/master.svg?style=flat)](https://circleci.com/gh/RadarTech/ln-api-boilerplate)
[![Known Vulnerabilities](https://snyk.io/test/github/RadarTech/ln-api-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/RadarTech/ln-api-boilerplate?targetFile=package.json)
[![License](https://img.shields.io/github/license/radartech/ln-api-boilerplate.svg?style=flat)](https://img.shields.io/github/license/radartech/ln-api-boilerplate.svg?style=flat)

## Quickstart

```sh
$ yarn # OR npm install
$ cp .env.example .env
# set vars for accessing LND ie. LND_MACAROON_PATH
$ yarn start # OR npm run start
```

## Test

```sh
yarn test # OR npm run test
```

## Compile and run

```sh
yarn build # OR npm run build
node build/index
```

## Usage

```sh
$ curl -GET localhost:3000/api
# {"ok":true}
```

Ping the server:

```sh
$ curl -GET localhost:3000/api/ping
# "pong"
```

Generate a [bolt11](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md) encoded invoice:

```sh
$ curl -GET localhost:3000/api/invoice
# "lntb10..."
```

Pay a [bolt11](https://github.com/lightningnetwork/lightning-rfc/blob/master/11-payment-encoding.md) encoded invoice:

```sh
$ curl -d "invoice=lntb10..." -X POST localhost:3000/api/invoice/pay
# {"preimage":"649..."}
```

## VS Code Debugging

If you use VS Code, you can debug the application and tests using the built-in debugger.

Enter the debug view by clicking the Debug icon in the Activity Bar or using the keyboard shortcut `cmd + shift + D`

![screen shot 2019-02-04 at 9 54 08 am](https://user-images.githubusercontent.com/20102664/52223583-2fc7b000-2863-11e9-9686-7289614742ed.png)

There are three debug options:

- Launch & Debug Application - Launch the application with ts-node and debug
- Debug Tests - Start the tests and debug
- Attach Debugger to Process - Attach the to debugger to a running process

Note: The debugger can also be launched from the status bar.

![screen shot 2019-02-04 at 10 01 08 am](https://user-images.githubusercontent.com/20102664/52223860-d2802e80-2863-11e9-8eb8-f46a3788714d.png)

## Resources

- [Lightning Network Introduction](https://ion.radar.tech/)
- [Lightning Network Daemon](https://github.com/lightningnetwork/lnd)
- [lnrpc](https://github.com/RadarTech/lnrpc)

## Contributors

To develop on the project please run:

```sh
git clone git@github.com:RadarTech/ln-api-boilerplate.git && cd $_

yarn # OR npm install
yarn start # OR npm run start
```

## License

This project is licensed under the MIT License.