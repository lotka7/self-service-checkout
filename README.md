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
The previously loaded currencies are stored in the db.

## Optional features

Use a database to store the currency - finished
Implement a /api/v1/BlockedBills - finished
Prepare the machine for accepting Euros - unfinished

## Self Service Checkout API - Summary

Your application will simulate a self-checkout machine in a supermarket, which can be restocked,
and calculates which bills and coins should it give back as change when used.

## Details

Routes has an AuthGuard (except login), so first of all user has to authenticate to get the access_token.
At API calls header must include Bearer Token with the valid access_token

## /api/auth/login
Body: {
    "username": "john",
    "password": "passsword"
}

## POST /api/v1/Stock
The Stock endpoint accepts a JSON in a POST request, with an object containing the bills and coins to be
loaded into the “machine” (HUF)

## GET /api/v1/Stock
The endpoint should return a 200 OK response, with the currently stored items in the response body, or an
appropriate error response if an exception occurs.

## POST /api/v1/Checkout
- The endpoint accepts the same object used in the POST request for the Stock endpoint, but this time the
  object represents the bills and coins inserted into the machine by the customer during purchase. The JSON
  should also contain a price field representing the total price of the purchase.
- The purchase, if successful, should update the number of bills and coins stored in the machine accordingly.
- The endpoint should return with a
  - 200 OK response, and an object containing the change given back by the machine
  - 400 Bad Request response, with a response body describing the error if the purchase cannot be
    fulfilled for some reason. Prepare the algorithm for common exceptions and use cases.

## /api/v1/BlockedBills 
The endpoint returns with an array containing the denominations the machine currently accepts. A bill or coin cannot be accepted if the machine would not be able to give back proper change.


