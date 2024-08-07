####################
# Development Stage

FROM node:20.11-alpine as development

ARG DATABASE_URL
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./
COPY --chown=node:node /src/database ./src/database

RUN corepack enable pnpm && corepack use pnpm@latest && pnpm install

# Copy the rest of the application code
COPY --chown=node:node . .
USER node

#####################
# Build Stage

FROM node:20.11-alpine as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=development /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN corepack enable pnpm && corepack use pnpm@latest && pnpm install

ENV NODE_ENV production

RUN pnpm run build
RUN pnpm install --prod --frozen-lockfile

USER node

#####################
# Production Stage

FROM node:20.11-alpine as production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app

# Copy the build with only production dependencies from the build stage
COPY --chown=node:node --from=development /usr/src/app/src/database/infrastructure/schema.prisma ./src/database/infrastructure/schema.prisma
COPY --chown=node:node --from=development /usr/src/app/src/database/infrastructure/migrations ./src/database/infrastructure/migrations
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

RUN corepack enable pnpm && corepack use pnpm@latest

# Expose the port the app runs on, here, I was using port 3333
EXPOSE 2020

# Command to run the app
CMD [ "pnpm", "migrate:prod" ]