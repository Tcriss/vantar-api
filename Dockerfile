FROM node:20.11-alpine AS base

ARG DATABASE_URL
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app

# copy important files
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && corepack use pnpm@latest && pnpm install

# Bundle app source
COPY ./src/prisma/domain/schemas/schema.prisma ./app/dist/prisma/domina/schemas

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm dlx prisma generate

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Start a new stage from a minimal base image
FROM base
# Copy necessary files from the previous stages
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the port on which the app will run
EXPOSE 2020

# Start the server using the production build
CMD ["pnpm", "start:prod"]