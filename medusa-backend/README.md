# PHENO Medusa backend

This directory is an isolated Medusa `2.20.1` backend for the PHENO storefront.
The live Next.js application remains at the repository root and continues to use
the local commerce provider until the backend has passed infrastructure and
catalogue acceptance testing.

## Local commands

```bash
npm install
npm run dev
npm run build
npm start
```

The Medusa Admin dashboard is served at `/app`; the Store API is served under
`/store`.

## Railway service settings

- Service name: `medusa-backend`
- Root directory: `/medusa-backend`
- Build command: `npm run build`
- Start command: `npm start`
- Health check path: `/health`

`prestart` runs `medusa db:migrate` before the server starts. Keep the actual
database URL, JWT secret, cookie secret, admin credentials, and publishable key
in Railway variables only.

## Phase 2 scope

This scaffold intentionally does not import PHENO products or change the
storefront environment. The initial setup uses Medusa's shared worker mode so
the backend can be validated against PostgreSQL first. Before production
checkout, follow Medusa's self-hosting guidance to add Redis-backed modules and
a dedicated worker service.
