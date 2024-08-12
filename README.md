# Vantar API

This is [Vantar Project's]('https://github.com/HaroldMart/Vantar-Frontend') API, an API to manage your inventory.

## Features

### 🎯 Key Features

- **Manage Inventory:** Create an inventory from using products from your product list.

- **Manage Products:** Create your product list to use it when creating an invoice or an inventory.

- **Manage Invoices:** You can create invoices to save information about the sells you have.

- **Mailing:** When you login or forgot your password, an e-mail will be sent to you.

### 🔐 Security

This API implements the latest features on security in the Node environment.

Some of those features are:

- Hashing and encryptation.
- Inputs validations and sanitization.
- Rate limit.
- Caching.
- Role and Owner Based Access Control.
- Secure headers.

## Technologies used

[![Stack](https://skillicons.dev/icons?i=nestjs,prisma,postgres,mongo,jest)](https://skillicons.dev)

This app is made in NestJS following Clean Arquitecture principles alongside with Postgres and MongoDB.

### 📦 Dependencies

- swc
- Prisma
- Class-validator
- Class-transformer
- Bcrypt
- Passport
- Resend
- Helmet

##  Setup

### 📃 Requirements

- NodeJS 20.16.0 with pnpm enbled
```bash 
corepack enable pnpm
```
- NestJS CLI
```bash
pnpm add @nestjs/cli
```

- Docker desktop

### ✅ Installation

Set env files

```dosini
# .env
NODE_ENV = development
PORT = 2000
HOST = # app HOST
CLIENT = # clients allowed by cors

# db variables
DB_PASSWORD = #db password
DB_USER = #db user
DB_NAME = #db name

## connection
DATABASE_URL = postgres://${DB_USER}:${DB_PASSWORD}@localhost:5434/${DB_NAME}?schema=public
MONGO_URI = # mongo ulr
MONGO_DB_NAME = # mongo db database

# Email config
EMAIL_KEY = # RESEND API KEY
DEAFULT_EMAIL = # YOUR OWN EMAIL SERVER REGISTERED ON RESEND
AUTH_URL = ${HOST}/auth # URL used for account activation endpoint

# Tokens & security
AT_TIME = # Access_token expiry time
RT_TIME = # Refresh_token expiry time
HASH = # Rounds salts for bcrypt
SECRET = # Secret to sign access_tokens
RT_SECRET = # Refresh_token secret to sign them
ACTIVATION_SECRET = # Activation for activation token
RESET_SECRET = # Secret for reset token validation

```

```dosini
# .env.docker
NODE_ENV = development
PORT = 2000
HOST = # app HOST
CLIENT = # clients allowed by cors

# db variables
DB_PASSWORD = # postgres password
DB_USER = # postgres user
DB_NAME = # postgres name

# replace connection variable where host name is localhost and port
DATABASE_URL = postgres://${DB_USER}:${DB_PASSWORD}@database:5432/${DB_NAME}?schema=public
MONGO_URI = # mongo database url
MONGO_DB_NAME = # mongoDB name

# Email config
EMAIL_KEY = # RESEND API KEY
DEAFULT_EMAIL = # YOUR OWN EMAIL SERVER REGISTERED ON RESEND
AUTH_URL = ${HOST}/auth # URL used for account activation endpoint

# Tokens & security
AT_TIME = # Access_token expiry time
RT_TIME = # Refresh_token expiry time
HASH = # Rounds salts for bcrypt
SECRET = # Secret to sign access_tokens
RT_SECRET = # Refresh_token secret to sign them
ACTIVATION_SECRET = # Activation for activation token
RESET_SECRET = # Secret for reset token validation
```
### 🔄️ Restore dependencies

```bash
pnpm install
```

## Execution

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

Using docker

```bash
docker compose --env-file .env.docker up --build -d
```
> Note: --env-file flag is to tell docker that use a diferent .env file in runtime. This example has two environments: local dev & docker dev, if you will only use docker you can remove --env-file flag.

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
