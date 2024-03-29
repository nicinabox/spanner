# Spanner

A simple tracking application to keep up with your vehicles.

![](public/assets/teaser-vehicle.png)

## Features

* Keep records for as many vehicles as you want
* Email Reminders for date or mileage
* Current mileage estimation
* Yearly mileage estimation
* Live record searching

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Generators

```bash
hygen component new NAME
```

```bash
hygen component new NAME --path "path/to/component"
```

```bash
hygen page new NAME --route "path/to/page"
```

## Deploy

* `git push dokku`

## Copyright

Copyright 2021 Nic Haynes.
