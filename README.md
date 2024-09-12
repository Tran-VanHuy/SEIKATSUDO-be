# SAM API

## Requirements

- Node 16.x
- MySQL 8.0.26

## Installation

```bash
$ yarn install
```

## Run DB on Docker

```sh
docker-compose up -d --build
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### Local env migrate

```sh
yarn build
yarn migrate:run

# Revert
yarn migrate:revert

# Seed
yarn seed:config
yarn seed:run
```

### Format code
```sh
yarn format
yarn lint
```