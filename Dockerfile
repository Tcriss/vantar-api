# Base stage
FROM node:20.11-alpine

ARG DATABASE_URL
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./
COPY /src/prisma ./src/prisma
RUN corepack enable pnpm && corepack use pnpm@latest && pnpm install

# Generate Prisma Client code
RUN pnpm dlx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on, here, I was using port 3333
EXPOSE 2020

# Command to run the app
CMD [ "pnpm", "migrate:prod" ]