# Vantar API

This is [Vantar Project's]('https://github.com/HaroldMart/Vantar-Frontend') API, is still in development so docs may be incomplete.

## Technologies used

This app is made in NestJS using Onion Arquitecture.

### 📦 Dependencies

- Prisma
- Class Validator
- Class Transformer
- UUID
- Jest
- Supertest
- Eslint
- Prettier

##  Setup

### 📃 Requirements

- NodeJS 20.13.1 with pnpm enbled
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

# db variables
DB_PASSWORD = #db password
DB_USER = #db user
DB_NAME = #db name

## connection
DATABASE_URL = postgres://${DB_USER}:${DB_PASSWORD}@localhost:5434/${DB_NAME}?schema=public
```

```dosini
# .env.docker
NODE_ENV = development
PORT = 2000

# db variables
DB_PASSWORD = #db password
DB_USER = #db user
DB_NAME = #db name

# replace connection variable where host name is localhost and port
DATABASE_URL = postgres://${DB_USER}:${DB_PASSWORD}@database:5432/${DB_NAME}?schema=public
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
> Note: --env-file flag is to tell docker that use .env.docker file in build time, if is not set docker will use default .env instead and it'll use the default configuration where localhost is set, instead of database service set in compose.yml file.

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
