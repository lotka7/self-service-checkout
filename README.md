## Description

Selfe service checker API with NestJs.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## DB

Run Postgress db in docker with: docker-compose up -d

## Optional features

Use a database to store the currency - finished
Other part of Optional Features - unfinished

## Self Service Checkout API

Your application will simulate a self-checkout machine in a supermarket, which can be restocked,
and calculates which bills and coins should it give back as change when used.

## Details

Routes has an AuthGuard (except login), so first of all user has to authenticate to get the access_token.
At API calls header must include Bearer Token with the valid access_token

## /api/login
Body: {
    "username": "john",
    "password": "passsword"
}


