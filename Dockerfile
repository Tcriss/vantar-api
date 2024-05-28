FROM node:20.11-alpine

# env variable
ARG DATABASE_URL
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME

# Create app directory
WORKDIR /usr/src/app

# copy important data
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable pnpm
RUN corepack use pnpm@latest
RUN pnpm install

# Bundle app source
COPY . .

# Expose the port on which the app will run
EXPOSE 2000

# Start the server using the production build
CMD ["pnpm", "migrate:prod"]