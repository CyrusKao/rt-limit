# RT Limit

A simple IP address based rate limiting module written in Typescript with zero dependencies.

> See how it's implemented at [my blog post](https://nocache.org/p/build-a-ip-based-rate-limiting-module-in-node-js-with-typescript).

## Installation

```sh
npm i rt-limit
```

## Usage

```ts
import Ratelimit from 'rt-limit';
import express from 'express';

const ratelimit = new Ratelimit(60, 60 * 1000);
const app = express();

app.use((req, res, next) => {
  if (ratelimit.consume(req.ip, 1)) {
    next();
    return;
  }

  res.status(429).end();
});
```
